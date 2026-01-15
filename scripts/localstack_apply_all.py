#!/usr/bin/env python3
"""
Parallelized LocalStack apply helper.

Runs build/init/import/plan steps for each module in parallel, then applies
changes sequentially for modules whose plan reported changes.
"""

from __future__ import annotations

import argparse
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass
from pathlib import Path
from typing import List, Optional


ROOT = Path(__file__).resolve().parent.parent


@dataclass
class Module:
    name: str
    build_cmd: List[str]
    state_script: Path
    import_script: Path
    tf_dir: Path
    tfvars_file: Path
    backend_config: str
    env_arg: str = "local"


def run_cmd(cmd: List[str], cwd: Path, label: str) -> subprocess.CompletedProcess:
    print(f"[{label}] $ {' '.join(cmd)}")
    return subprocess.run(cmd, cwd=str(cwd), check=True)


def run_plan(module: Module, label: str) -> int:
    plan_cmd = [
        "terraform",
        f"-chdir={module.tf_dir}",
        "plan",
        "-detailed-exitcode",
        f"-var-file={module.tfvars_file}",
        "-out=tfplan",
    ]
    print(f"[{label}] $ {' '.join(plan_cmd)}")
    result = subprocess.run(plan_cmd, cwd=str(module.tf_dir))
    return result.returncode


def prepare_module(module: Module) -> tuple[str, Optional[int]]:
    label = module.name
    try:
        run_cmd(module.build_cmd, module.tf_dir.parent, label)
        run_cmd([str(module.state_script), module.env_arg], module.tf_dir, label)
        run_cmd(
            ["terraform", f"-chdir={module.tf_dir}", "init", "-input=false", "-reconfigure", f"-backend-config={module.backend_config}"],
            module.tf_dir,
            label,
        )
        run_cmd([str(module.import_script), module.env_arg], module.tf_dir, label)
        plan_code = run_plan(module, label)
        return ("ok", plan_code)
    except subprocess.CalledProcessError as exc:
        print(f"[{label}] ERROR: command failed with exit code {exc.returncode}")
        return ("error", None)


def apply_module(module: Module) -> bool:
    label = module.name
    apply_cmd = ["terraform", f"-chdir={module.tf_dir}", "apply", "-input=false", "tfplan"]
    try:
        run_cmd(apply_cmd, module.tf_dir, label)
        return True
    except subprocess.CalledProcessError as exc:
        print(f"[{label}] ERROR: terraform apply failed with exit code {exc.returncode}")
        return False


def filter_modules(modules: List[Module], only: Optional[List[str]]) -> List[Module]:
    if not only:
        return modules
    wanted = {name.lower() for name in only}
    return [m for m in modules if m.name.lower() in wanted]


def main(argv: List[str]) -> int:
    parser = argparse.ArgumentParser(description="Run LocalStack apply steps with parallel build/plan.")
    parser.add_argument(
        "-only",
        dest="only",
        help="Comma-separated module names to include (DataCollection,Recap,Web)",
    )
    args = parser.parse_args(argv)

    only_modules = [m.strip() for m in args.only.split(",")] if args.only else []

    modules = [
        Module(
          name="DataCollection",
          build_cmd=["bash", "-lc", "pnpm install && pnpm run build"],
          state_script=ROOT / "PoliTopicsDataCollection/terraform/scripts/create-state-bucket.sh",
          import_script=ROOT / "PoliTopicsDataCollection/terraform/scripts/import_all.sh",
          tf_dir=ROOT / "PoliTopicsDataCollection/terraform",
          tfvars_file=ROOT / "PoliTopicsDataCollection/terraform/tfvars/localstack.tfvars",
          backend_config="backends/local.hcl",
        ),
        Module(
          name="Recap",
          build_cmd=["bash", "-lc", "pnpm install && pnpm run build:local"],
          state_script=ROOT / "PoliTopicsRecap/terraform/scripts/create-state-bucket.sh",
          import_script=ROOT / "PoliTopicsRecap/terraform/scripts/import_all.sh",
          tf_dir=ROOT / "PoliTopicsRecap/terraform",
          tfvars_file=ROOT / "PoliTopicsRecap/terraform/tfvars/localstack.tfvars",
          backend_config="backends/local.hcl",
        ),
        Module(
          name="Web",
          build_cmd=["bash", "-lc", "npm ci && npm run build:backend:local"],
          state_script=ROOT / "PoliTopicsWeb/terraform/scripts/create-state-bucket.sh",
          import_script=ROOT / "PoliTopicsWeb/terraform/scripts/import_all.sh",
          tf_dir=ROOT / "PoliTopicsWeb/terraform",
          tfvars_file=ROOT / "PoliTopicsWeb/terraform/tfvars/localstack.tfvars",
          backend_config="backends/local.hcl",
        ),
    ]

    modules = filter_modules(modules, only_modules)
    if not modules:
        print("No modules selected. Exiting.")
        return 1

    print(f"Running modules: {', '.join(m.name for m in modules)}")

    results = {}
    with ThreadPoolExecutor(max_workers=len(modules)) as executor:
        future_map = {executor.submit(prepare_module, module): module for module in modules}
        for future in as_completed(future_map):
            module = future_map[future]
            status, plan_code = future.result()
            results[module.name] = {"status": status, "plan_code": plan_code}

    needs_apply = []
    for module in modules:
        res = results.get(module.name, {})
        if res.get("status") != "ok":
            print(f"[{module.name}] skipped apply (prep failed)")
            continue
        code = res.get("plan_code")
        if code == 0:
            print(f"[{module.name}] no changes (plan exit 0)")
        elif code == 2:
            needs_apply.append(module)
            print(f"[{module.name}] changes detected (plan exit 2) -> queued for apply")
        else:
            print(f"[{module.name}] plan failed with exit {code}, skipping apply")

    for module in needs_apply:
        print(f"[{module.name}] applying tfplan...")
        success = apply_module(module)
        if not success:
            return 1

    print("All done.")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))

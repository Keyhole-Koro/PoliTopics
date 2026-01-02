import fs from "fs";
import path from "path";
import dotenv from "dotenv";

export function loadEnvFromFile(envPath: string, requiredKeys: string[]): Record<string, string> {
  const resolvedPath = path.resolve(envPath);
  const errors: string[] = [];

  if (!fs.existsSync(resolvedPath)) {
    errors.push(`Env file not found: ${resolvedPath}`);
  } else {
    dotenv.config({ path: resolvedPath });
  }

  const values: Record<string, string> = {};
  for (const key of requiredKeys) {
    const value = process.env[key];
    if (!value || value.trim() === "") {
      errors.push(`${key} is required (from ${resolvedPath})`);
      continue;
    }
    values[key] = value;
  }

  if (errors.length) {
    throw new Error(errors.join("; "));
  }

  return values;
}

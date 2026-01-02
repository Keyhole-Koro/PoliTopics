import path from "path";
import { loadEnvFromFile } from "../src/discord/env";

describe("Shared Discord webhook integration", () => {
  it("sends a test message and receives success", async () => {
    const envPath = path.resolve(__dirname, "../../.test.env");
    const { DISCORD_WEBHOOK_TEST_URL } = loadEnvFromFile(envPath, ["DISCORD_WEBHOOK_TEST_URL"]);

    const payload = {
      content: `Shared webhook test at ${new Date().toISOString()}`,
    };

    const response = await fetch(DISCORD_WEBHOOK_TEST_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    const bodyText = await response.text();
    if (!response.ok) {
      throw new Error(`Discord webhook responded with ${response.status}: ${bodyText || "<empty body>"}`);
    }

    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(300);
  });
});

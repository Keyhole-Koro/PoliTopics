export type DiscordField = { name: string; value: string; inline?: boolean };
export type DiscordEmbed = {
  title?: string;
  description?: string;
  color?: number;
  fields?: DiscordField[];
  timestamp?: string;
};

export type DiscordMessage = {
  username?: string;
  content?: string;
  embeds?: DiscordEmbed[];
};

export const DISCORD_COLORS = {
  error: 0xe74c3c,   // red
  warn: 0xf1c40f,    // yellow
  success: 0x2ecc71, // green
  access: 0x2d9cdb,  // blue
  batch: 0x3498db,   // bright blue
};

const DEFAULT_TIMEOUT_MS = 5_000;

export async function postDiscordWebhook(
  url: string | undefined,
  payload: DiscordMessage,
  label = "notification",
): Promise<void> {
  if (!url || url.trim() === "") {
    console.log(`[discord] Skip ${label}: webhook URL not configured`);
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[discord] Webhook responded with ${res.status} for ${label}`, body ? { body } : undefined);
    }
  } catch (error) {
    console.error(`[discord] Failed to send ${label} webhook`, { error });
  } finally {
    clearTimeout(timeout);
  }
}

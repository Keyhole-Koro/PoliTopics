import { DISCORD_COLORS, postDiscordWebhook, type DiscordField } from "./webhook";

export type NotificationPayload = {
  environment: string;
  webhook?: string;
  fallbackWebhook?: string;
  title: string;
  content: string;
  color?: number;
  fields?: DiscordField[];
  label?: string;
  timestamp?: string;
};

export async function sendNotification(payload: NotificationPayload): Promise<void> {
  const {
    environment,
    webhook,
    fallbackWebhook,
    title,
    content,
    color = DISCORD_COLORS.warn,
    fields = [],
    label = "notification",
    timestamp = new Date().toISOString(),
  } = payload;

  const finalFields: DiscordField[] = [
    { name: "Environment", value: environment, inline: true },
    ...fields,
  ];

  const message = {
    content,
    embeds: [
      {
        title,
        color,
        fields: finalFields,
        timestamp,
      },
    ],
  };

  if (webhook && webhook.trim() !== "") {
    await postDiscordWebhook(webhook, message, label);
    return;
  }

  if (fallbackWebhook && fallbackWebhook.trim() !== "") {
    await postDiscordWebhook(fallbackWebhook, message, `${label}-fallback`);
    return;
  }

  console.log(`[discord] Skip ${label}: no webhook configured (primary or fallback)`);
}

import type { framework } from "@types/chromecast-caf-receiver";

declare global {
  const cast: {
    framework: typeof framework;
  };
}

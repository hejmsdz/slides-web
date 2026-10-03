import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  allowedActionOrigins: process.env.FRONTEND_URL
    ? [process.env.FRONTEND_URL?.replace(/https?:\/\//, "")]
    : undefined,
} satisfies Config;

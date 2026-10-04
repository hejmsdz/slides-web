import invariant from "tiny-invariant";

const apiKey = process.env.OPENROUTER_API_KEY;

type AiRequestBody = {
  model: string;
  messages: {
    role: string;
    content: string;
  }[];
};

export class AiLimitExceededError extends Error {
  constructor() {
    super("AI usage limit exceeded");
    this.name = "AiLimitExceededError";
  }
}

export default async function openRouter(body: AiRequestBody) {
  invariant(apiKey, "OpenRouter API key must be set");

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    const json = await response.json().catch(() => ({}));
    if (json?.error?.message?.includes?.("limit exceeded")) {
      throw new AiLimitExceededError();
    } else {
      throw new Error("OpenRouter request failed!");
    }
  }

  return await response.json();
}

import invariant from "tiny-invariant";
import jwt from "jsonwebtoken";
import type { ActionFunctionArgs } from "react-router";
import * as zod from "zod";

const schema = zod
  .object({
    email: zod.string().email("Nieprawidłowy adres e-mail."),
    name: zod.string(),
    token: zod.string().min(1, "Weryfikacja nie powiodła się."),
    consent: zod.literal("true", { message: "Musisz wyrazić zgodę." }),
  })
  .strict();

export const action = async ({ request }: ActionFunctionArgs) => {
  invariant(process.env.WAITLIST_API_URL, "WAITLIST_API_URL is required");
  invariant(process.env.SESSION_SECRET, "SESSION_SECRET is required");
  const formData = await request.formData();

  const ip = request.headers.get("cf-connecting-ip");
  if (!ip) {
    return {
      success: false,
      error: "Weryfikacja IP nie powiodła się.",
    };
  }

  const result = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!result.success) {
    return {
      success: false,
      error: result.error.errors[0]?.message ?? "Wprowadź poprawne dane.",
      formToken: formData.get("token")?.toString(),
    };
  }
  const { email, name, token } = result.data;

  let tokenId = "";
  try {
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    if (
      typeof decoded === "object" &&
      "jti" in decoded &&
      typeof decoded.jti === "string"
    ) {
      tokenId = decoded.jti;
    } else {
      throw new Error("Invalid token");
    }
  } catch (error) {
    if (error instanceof Error && error.name === "NotBeforeError") {
      return {
        success: false,
        error: "Za szybko piszesz ;) Spróbuj ponownie za kilka sekund.",
        formToken: token,
      };
    }

    return {
      success: false,
      error: "Weryfikacja nie powiodła się.",
    };
  }

  if (name) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { success: true };
  }

  const response = await fetch(process.env.WAITLIST_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, tokenId, ip }),
  }).then((res) => res.json() as Promise<{ ok: boolean; reason?: string }>);

  if (!response.ok) {
    switch (response.reason) {
      case "rate_limit":
        return {
          success: false,
          error: "Przekroczono limit zapytań. Spróbuj ponownie za 10 minut.",
          formToken: token,
        };
      case "token_duplicated":
        return {
          success: false,
          error: "Odśwież stronę, aby wypełnić formularz ponownie.",
          formToken: token,
        };
      default:
        return {
          success: false,
          error:
            "Wystąpił błąd podczas dodawania do listy oczekujących. Spróbuj ponownie później.",
          formToken: token,
        };
    }
  }

  return { success: true };
};

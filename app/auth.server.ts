import { Google } from "arctic";
import invariant from "tiny-invariant";

invariant(process.env.AUTH_GOOGLE_ID, "AUTH_GOOGLE_ID is not set");
invariant(process.env.AUTH_GOOGLE_SECRET, "AUTH_GOOGLE_SECRET is not set");

export const google = new Google(
  process.env.AUTH_GOOGLE_ID,
  process.env.AUTH_GOOGLE_SECRET,
  new URL("auth/google/callback", process.env.FRONTEND_URL).toString(),
);

import { LoaderFunction, redirect } from "react-router";
import invariant from "tiny-invariant";
import { ApiError } from "~/api/api";
import { joinTeam } from "~/api/teams";
import {
  requireSession,
  createAuthenticatedApi,
  commitSession,
} from "~/session";

export const loader: LoaderFunction = async ({ request, params }) => {
  const session = await requireSession(request);
  const api = await createAuthenticatedApi(session);
  const { token } = params;
  invariant(token, "token is required");

  try {
    const team = await joinTeam(api, token);
    session.set("teamId", team.id);
    session.flash("toast", `Witaj w zespole ${team.name}!`);
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(error);
      if (error.message === "you already belong to this team") {
        session.flash("toast", "Już należysz do tego zespołu!");
      } else if (error.message === "invitation not found") {
        session.flash(
          "toast",
          "Nie znaleziono zaproszenia. Być może zostało już wykorzystane lub wygasło.",
        );
      } else {
        session.flash("toast", "Nie udało się dołączyć do zespołu.");
      }
    } else {
      session.flash("toast", "Nie udało się dołączyć do zespołu.");
    }
  }

  return redirect(`/dashboard`, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

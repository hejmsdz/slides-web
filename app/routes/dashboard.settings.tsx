import { LoaderFunctionArgs } from "@remix-run/node";
import { requireSession, createAuthenticatedApi } from "~/session";
import { getTeam } from "~/api/teams";
import { useLoaderData } from "@remix-run/react";
import MainContent from "~/components/main-content";
import { SiteHeader } from "~/components/site-header";
import { TeamCard } from "~/components/settings/team-card";
import { MyAccountCard } from "~/components/settings/my-account-card";
import { DeleteAccountCard } from "~/components/settings/delete-account-card";
import { getUsersMe } from "~/api/users";

export default function Settings() {
  const { team, user } = useLoaderData<typeof loader>();

  return (
    <>
      <SiteHeader>
        <h1>Ustawienia</h1>
      </SiteHeader>
      <MainContent>
        <div className="flex flex-col gap-4">
          {team && (
            <TeamCard id={team.id} name={team.name} members={team.members} />
          )}
          <MyAccountCard displayName={user.displayName} email={user.email} />
          <DeleteAccountCard />
        </div>
      </MainContent>
    </>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await requireSession(request);
  const api = await createAuthenticatedApi(session);

  const user = await getUsersMe(api);
  const team = session.has("teamId")
    ? await getTeam(api, session.get("teamId")!)
    : null;

  return {
    team,
    user,
  };
}

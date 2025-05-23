import { LoaderFunctionArgs, MetaFunction, useLoaderData } from "react-router";
import { requireSession, createAuthenticatedApi } from "~/session";
import { getTeam } from "~/api/teams";
import MainContent from "~/components/main-content";
import { SiteHeader } from "~/components/site-header";
import { TeamCard } from "~/components/settings/team-card";
import { MyAccountCard } from "~/components/settings/my-account-card";
import { DeleteAccountCard } from "~/components/settings/delete-account-card";
import { getUsersMe } from "~/api/users";
import { NewTeamCard } from "~/components/settings/new-team-card";

export const meta: MetaFunction = () => {
  return [{ title: "Ustawienia" }];
};

export default function Settings() {
  const { team, user } = useLoaderData<typeof loader>();

  return (
    <>
      <SiteHeader>
        <h1>Ustawienia</h1>
      </SiteHeader>
      <MainContent>
        <div className="flex flex-col gap-4">
          {team ? (
            <TeamCard id={team.id} name={team.name} members={team.members} />
          ) : (
            <NewTeamCard />
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
  const teamId = session.get("teamId");
  const team = teamId ? await getTeam(api, teamId) : null;

  return {
    team,
    user,
  };
}

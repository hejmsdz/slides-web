import { UserRound } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { TeamMember } from "~/api/teams";
import ConfirmButton from "../confirm-button";
import { TeamInvitationDialog } from "./team-invitation-dialog";

export function TeamCard({
  id,
  name,
  members,
}: {
  id: string;
  name: string;
  members: TeamMember[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-none">
          {members.map((member) => (
            <li key={member.id} className="flex items-center gap-2 mb-1">
              <UserRound className="w-4 h-4" />
              {member.name}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <div className="flex gap-2">
          <TeamInvitationDialog teamId={id} teamName={name} />
          <ConfirmButton
            message={
              <>
                Czy na pewno chcesz opuścić zespół <strong>{name}</strong>?
              </>
            }
            action={`/dashboard/teams/${id}/leave`}
            actionButtonLabel="Opuść zespół"
          >
            Opuść zespół
          </ConfirmButton>
        </div>
      </CardFooter>
    </Card>
  );
}

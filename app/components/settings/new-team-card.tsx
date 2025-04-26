import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { NewTeamDialog } from "~/components/new-team-dialog";
import { Button } from "../ui/button";

export function NewTeamCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Utwórz zespół</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="max-w-prose">
          Nie należysz jeszcze do żadnego zespołu. Utwórz zespół, aby móc
          dodawać własne teksty, edytować istniejące i udostępniać je innym
          osobom z&nbsp;Twojej wspólnoty.
        </p>
      </CardContent>
      <CardFooter>
        <NewTeamDialog>
          <Button>Utwórz zespół</Button>
        </NewTeamDialog>
      </CardFooter>
    </Card>
  );
}

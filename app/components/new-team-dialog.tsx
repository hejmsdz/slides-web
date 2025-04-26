import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import FormItem from "./form-item";
import { Form } from "react-router";

export function NewTeamDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nowy zespół</DialogTitle>
          <DialogDescription>
            Utwórz zespół, aby dodawać własne teksty i udostępniać je innym
            osobom.
          </DialogDescription>
        </DialogHeader>
        <Form method="post" action="/dashboard/teams/create">
          <FormItem>
            <Label htmlFor="name">Nazwa zespołu</Label>
            <Input id="name" name="name" required />
          </FormItem>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit">Utwórz</Button>
            </DialogClose>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

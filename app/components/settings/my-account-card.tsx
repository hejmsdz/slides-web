import Form from "~/components/form";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import FormItem from "../form-item";

export function MyAccountCard({
  displayName,
  email,
}: {
  displayName: string;
  email: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Twój profil</CardTitle>
      </CardHeader>
      <Form
        method="post"
        action="/dashboard/account/update"
        onSubmit={() => {
          toast.success("Zapisano");
        }}
      >
        <CardContent>
          <FormItem>
            <Label htmlFor="displayName">Imię i nazwisko</Label>
            <Input
              type="text"
              id="displayName"
              name="displayName"
              defaultValue={displayName}
              required
            />
          </FormItem>
          <FormItem>
            <Label htmlFor="email">Adres e-mail</Label>
            <Input
              type="email"
              id="email"
              name="email"
              defaultValue={email}
              disabled
            />
          </FormItem>
        </CardContent>
        <CardFooter>
          <div className="flex gap-2">
            <Button type="submit">Zapisz</Button>
          </div>
        </CardFooter>
      </Form>
    </Card>
  );
}

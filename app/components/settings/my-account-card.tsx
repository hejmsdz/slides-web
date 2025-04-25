import { Form } from "@remix-run/react";
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

export function MyAccountCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Twój profil</CardTitle>
      </CardHeader>
      <CardContent>
        <FormItem>
          <Label htmlFor="title">Imię i nazwisko</Label>
          <Input
            type="text"
            id="title"
            name="title"
            defaultValue="Mikołaj Rozwadowski"
            required
          />
        </FormItem>
        <FormItem>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            defaultValue="...@gmail.com"
            required
            disabled
          />
        </FormItem>
      </CardContent>
      <CardFooter>
        <div className="flex gap-2">
          <Form method="post" action="/dashboard/settings/invite">
            <Button type="submit">Zapisz</Button>
          </Form>
        </div>
      </CardFooter>
    </Card>
  );
}

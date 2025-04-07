import { SongWithLyrics } from "~/api/songs";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { cn } from "~/lib/utils";
import { Button } from "../ui/button";
import { Form } from "@remix-run/react";

const FormItem = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col w-full gap-1.5", className)}>
      {children}
    </div>
  );
};

export default function SongForm({ song }: { song?: SongWithLyrics }) {
  return (
    <Form key={song?.id} method="post" className="flex flex-col gap-4 h-full">
      <input type="hidden" name="id" value={song?.id} />
      <FormItem>
        <Label htmlFor="title">Tytuł</Label>
        <Input type="text" id="title" name="title" defaultValue={song?.title} />
      </FormItem>
      <FormItem>
        <Label htmlFor="subtitle">Podtytuł</Label>
        <Input
          type="text"
          id="subtitle"
          name="subtitle"
          defaultValue={song?.subtitle}
        />
      </FormItem>
      <FormItem className="flex-grow">
        <Label htmlFor="lyrics">Tekst</Label>
        <Textarea
          id="lyrics"
          name="lyrics"
          className="flex-grow"
          defaultValue={song?.lyrics.join("\n\n")}
        />
      </FormItem>
      <Button type="submit" variant="default">
        Zapisz
      </Button>
    </Form>
  );
}

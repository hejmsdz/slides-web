import { SongWithLyrics } from "~/api/songs";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { cn } from "~/lib/utils";
import { Button } from "../ui/button";
import { Form } from "@remix-run/react";
import { Team } from "~/api/teams";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { DeleteButton } from "./delete-button";
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

export default function SongForm({
  song,
  teams,
}: {
  song?: SongWithLyrics;
  teams: Record<string, Team>;
}) {
  return (
    <Form
      key={song?.id ?? ""}
      method="post"
      className="flex flex-col gap-4 h-full"
    >
      <FormItem>
        <Label htmlFor="title">Tytuł</Label>
        <Input
          type="text"
          id="title"
          name="title"
          defaultValue={song?.title}
          required
        />
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
      <FormItem>
        <Label htmlFor="teamId">Widoczność</Label>
        <input type="hidden" name="prevTeamId" value={song?.teamId ?? "0"} />
        <Select name="teamId" defaultValue={song?.teamId ?? "0"}>
          <SelectTrigger>
            <SelectValue placeholder="Wybierz zespół" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="0">Publiczna</SelectItem>
              {Object.entries(teams).map(([id, team]) => (
                <SelectItem key={id} value={id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </FormItem>
      <FormItem className="flex-grow">
        <Label htmlFor="lyrics">Tekst</Label>
        <Textarea
          id="lyrics"
          name="lyrics"
          className="flex-grow"
          defaultValue={song?.lyrics.join("\n\n")}
          required
        />
      </FormItem>
      <div className="flex w-full gap-2">
        <Button type="submit" variant="default" className="flex-[2]">
          Zapisz
        </Button>
        {song?.canDelete && (
          <DeleteButton id={song.id} className="flex-[1]">
            Usuń
          </DeleteButton>
        )}
      </div>
    </Form>
  );
}

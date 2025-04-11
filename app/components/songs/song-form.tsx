import { useState } from "react";
import { Form } from "@remix-run/react";
import { SongWithLyrics } from "~/api/songs";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { cn } from "~/lib/utils";
import { Button } from "../ui/button";
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
import { Checkbox } from "../ui/checkbox";
import LyricsEditor from "./lyrics-editor";

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
  currentTeamId,
  isAdmin,
}: {
  song?: SongWithLyrics;
  teams: Record<string, Team>;
  currentTeamId: string;
  isAdmin: boolean;
}) {
  const [isOverride, setIsOverride] = useState<boolean>(
    song !== undefined && song.teamId === null && !isAdmin,
  );
  const [teamId, setTeamId] = useState(song?.teamId ?? "0");

  return (
    <Form method="post" className="flex flex-col gap-4 h-full">
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
      {isAdmin ? (
        <FormItem>
          <Label htmlFor="teamId">Widoczność</Label>
          <Select
            name="teamId"
            value={teamId}
            onValueChange={(value) => setTeamId(value)}
          >
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
          {song?.teamId === null && teamId !== "0" && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isOverride"
                name="isOverride"
                checked={isOverride}
                onCheckedChange={(checked) => setIsOverride(checked === true)}
              />
              <label
                htmlFor="isOverride"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Zapisz jako własną wersję
              </label>
            </div>
          )}
        </FormItem>
      ) : (
        <>
          <input type="hidden" name="teamId" value={currentTeamId} />
          {isOverride && <input type="hidden" name="isOverride" value="yes" />}
        </>
      )}
      <FormItem className="flex-grow">
        <Label htmlFor="lyrics">Tekst</Label>
        <LyricsEditor
          id="lyrics"
          name="lyrics"
          className="flex-grow"
          defaultValue={song?.lyrics.join("\n\n")}
          required
        />
      </FormItem>
      <div className="flex w-full gap-2">
        <Button type="submit" variant="default" className="flex-[2]">
          {isOverride ? "Zapisz własną wersję" : "Zapisz"}
        </Button>
        {song?.canDelete && (
          <DeleteButton
            id={song.id}
            className="flex-[1]"
            isOverride={song.isOverride}
          >
            {song.isOverride ? "Usuń własną wersję" : "Usuń"}
          </DeleteButton>
        )}
      </div>
    </Form>
  );
}

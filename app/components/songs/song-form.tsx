import { useEffect, useRef, useState } from "react";
import { useBlocker } from "react-router";
import { SongWithLyrics } from "~/api/songs";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Collapsible, CollapsibleContent } from "../ui/collapsible";
import { DeleteButton } from "./delete-button";
import { Checkbox } from "../ui/checkbox";
import LyricsEditor from "./lyrics-editor";
import PreviewButton from "./preview-button";
import { SiteHeader } from "../site-header";
import MainContent from "../main-content";
import { toast } from "sonner";
import LyricsFormattingHelpButton from "./lyrics-formatting-help-button";
import Form from "~/components/form";
import FormItem from "../form-item";
import {
  SidebarMenuItem,
  SidebarMenu,
  SidebarGroupContent,
  SidebarGroup,
  SidebarContent,
  Sidebar,
  SidebarMenuButton,
} from "../ui/sidebar";
import { PopoverContent, PopoverTrigger, Popover } from "../ui/popover";
import { Eye, MoreHorizontal, Save, Trash2 } from "lucide-react";
import useEventListener from "~/hooks/use-event-listener";
import useDashboardData from "~/hooks/use-dashboard-data";
import { useIsMobile } from "~/hooks/use-mobile";

function useSaveGuard(): React.MutableRefObject<boolean> {
  const isSavedRef = useRef<boolean>(true);

  const blocker = useBlocker(() => {
    return !isSavedRef.current;
  });

  useEffect(() => {
    if (blocker.state === "blocked") {
      const canProceed = window.confirm(
        "Masz niezapisane zmiany w tekście. Czy na pewno chcesz wyjść z tej strony i odrzucić zmiany?",
      );
      if (canProceed) {
        blocker.proceed();
      } else {
        blocker.reset();
      }
    }
  }, [blocker.state]);

  useEventListener("beforeunload", (event) => {
    if (!isSavedRef.current) {
      event.preventDefault();
    }
  });

  return isSavedRef;
}

export default function SongForm({
  song,
  autoFocus = false,
}: {
  song?: SongWithLyrics;
  autoFocus?: boolean;
}) {
  const { teams, currentTeamId, isAdmin } = useDashboardData();

  const isNewSong = song === undefined;
  const [isOverride, setIsOverride] = useState<boolean>(
    !isNewSong && song.teamId === null && !isAdmin,
  );
  const [teamId, setTeamId] = useState(
    song?.teamId ?? (song?.isUnofficial ? "unofficial" : "0"),
  );
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);
  const lyricsRef = useRef<HTMLTextAreaElement>(null);
  const isDisabled = (isOverride || isNewSong) && !currentTeamId;
  const isSavedRef = useSaveGuard();
  const isMobile = useIsMobile();

  return (
    <Form
      method="post"
      className="flex flex-col h-full"
      onSubmit={() => {
        isSavedRef.current = true;
        toast.success("Pieśń została zapisana.");
      }}
      onChange={() => {
        isSavedRef.current = false;
      }}
    >
      <SiteHeader>
        <h1 className="truncate">{isNewSong ? "Nowa pieśń" : song.title}</h1>
        <div className="flex gap-2 ml-auto">
          {!isDisabled && (
            <Button type="submit" variant="default">
              <Save className="sm:hidden w-4 h-4" />
              <span className="max-sm:sr-only">Zapisz</span>
            </Button>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className="data-[state=open]:bg-accent"
              >
                <MoreHorizontal />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-56 overflow-hidden rounded-lg p-0"
              align="end"
            >
              <Sidebar collapsible="none">
                <SidebarContent>
                  <SidebarGroup className="border-b last:border-none">
                    <SidebarGroupContent className="gap-0">
                      <SidebarMenu>
                        <PreviewButton lyricsRef={lyricsRef} asChild>
                          <SidebarMenuItem>
                            <SidebarMenuButton type="button">
                              <Eye /> <span>Podgląd</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        </PreviewButton>
                        {song?.canDelete && (
                          <DeleteButton id={song.id} asChild>
                            <SidebarMenuItem>
                              <SidebarMenuButton
                                type="button"
                                className="text-red-500 hover:text-red-600 active:text-red-700"
                              >
                                <Trash2 /> <span>Usuń</span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          </DeleteButton>
                        )}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                </SidebarContent>
              </Sidebar>
            </PopoverContent>
          </Popover>
        </div>
      </SiteHeader>
      <MainContent>
        <div className="flex flex-col h-full">
          <Collapsible open={!(isMobile && isTextareaFocused)}>
            <CollapsibleContent className="flex flex-col">
              <div className="flex flex-col md:flex-row md:gap-4">
                <FormItem>
                  <Label htmlFor="title">Tytuł</Label>
                  <Input
                    type="text"
                    id="title"
                    name="title"
                    defaultValue={song?.title}
                    required
                    readOnly={isDisabled}
                    autoFocus={autoFocus} // eslint-disable-line jsx-a11y/no-autofocus
                  />
                </FormItem>
                <FormItem>
                  <Label htmlFor="subtitle">Podtytuł</Label>
                  <Input
                    type="text"
                    id="subtitle"
                    name="subtitle"
                    defaultValue={song?.subtitle}
                    readOnly={isDisabled}
                  />
                </FormItem>
                <FormItem>
                  <Label htmlFor="author">Autor</Label>
                  <Input
                    type="text"
                    id="author"
                    name="author"
                    defaultValue={song?.author}
                    readOnly={isDisabled}
                  />
                </FormItem>
              </div>
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
                        <SelectItem value="unofficial">Nieoficjalna</SelectItem>
                        {Object.entries(teams).map(([id, team]) => (
                          <SelectItem key={id} value={id}>
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {song?.teamId === null &&
                    teamId !== "0" &&
                    teamId !== "unofficial" && (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="isOverride"
                          name="isOverride"
                          checked={isOverride}
                          onCheckedChange={(checked) =>
                            setIsOverride(checked === true)
                          }
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
                  {isOverride && (
                    <input type="hidden" name="isOverride" value="yes" />
                  )}
                </>
              )}
            </CollapsibleContent>
          </Collapsible>
          <div className="flex flex-col h-full">
            <FormItem className="flex-grow">
              <Label htmlFor="lyrics" className="flex items-center gap-2">
                Tekst
                <LyricsFormattingHelpButton />
              </Label>
              <LyricsEditor
                ref={lyricsRef}
                id="lyrics"
                name="lyrics"
                className="flex-grow"
                defaultValue={song?.lyrics.join("\n\n")}
                required
                readOnly={isDisabled}
                onFocus={() => setIsTextareaFocused(true)}
                onBlur={() => setIsTextareaFocused(false)}
              />
            </FormItem>
          </div>
        </div>
      </MainContent>
    </Form>
  );
}

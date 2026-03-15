import { useId } from "react";
import { Search } from "lucide-react";
import { Label } from "~/components/ui/label";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from "~/components/ui/sidebar";

export function SearchForm({
  query,
  onQueryChange,
}: {
  onQueryChange: (query: string) => void;
  query: string;
}) {
  const inputId = useId();

  return (
    <SidebarGroup className="py-0">
      <SidebarGroupContent className="relative">
        <Label htmlFor={inputId} className="sr-only">
          Szukaj
        </Label>
        <SidebarInput
          id={inputId}
          placeholder="Wyszukaj pieśni"
          className="pl-8"
          onChange={(event) => onQueryChange(event.currentTarget.value)}
          value={query}
        />
        <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

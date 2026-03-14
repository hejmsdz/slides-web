import { useEffect, useId, useRef } from "react";
import { Search } from "lucide-react";
import { Label } from "~/components/ui/label";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from "~/components/ui/sidebar";
import useDebouncedCallback from "~/hooks/use-debounced-callback";

export function SearchForm({
  onQueryChange,
}: {
  onQueryChange: (query: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQueryChange = useDebouncedCallback(onQueryChange);

  useEffect(() => {
    // Re-trigger if the input has a value on mount (e.g. browser back/forward)
    if (inputRef.current && inputRef.current.value.length > 0) {
      onQueryChange(inputRef.current.value);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedQueryChange(event.currentTarget.value);
  };

  const inputId = useId();

  return (
    <SidebarGroup className="py-0">
      <SidebarGroupContent className="relative">
        <Label htmlFor={inputId} className="sr-only">
          Szukaj
        </Label>
        <SidebarInput
          ref={inputRef}
          id={inputId}
          placeholder="Wyszukaj pieśni"
          className="pl-8"
          onChange={handleChange}
        />
        <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

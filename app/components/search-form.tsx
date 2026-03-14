import { useEffect, useRef } from "react";
import { FetcherWithComponents } from "react-router";
import { Search } from "lucide-react";
import { Label } from "~/components/ui/label";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from "~/components/ui/sidebar";
import { useDebouncedCallback } from "~/hooks/use-debounced-callback";

export function SearchForm({
  fetcher,
}: {
  fetcher: FetcherWithComponents<unknown>;
}) {
  const debouncedSubmit = useDebouncedCallback(
    (form: HTMLFormElement | null, value: string) => {
      if (value.length > 0) {
        fetcher.submit(form);
      } else {
        fetcher.reset();
      }
    },
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSubmit(event.currentTarget.form, event.currentTarget.value);
  };

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && inputRef.current.value.length > 0) {
      fetcher.submit(formRef.current);
    }
  }, []);

  return (
    <fetcher.Form ref={formRef} method="get" action="/dashboard/songs/search">
      <SidebarGroup className="py-0">
        <SidebarGroupContent className="relative">
          <Label htmlFor="search" className="sr-only">
            Szukaj
          </Label>
          <SidebarInput
            ref={inputRef}
            id="search"
            name="query"
            placeholder="Wyszukaj pieśni"
            className="pl-8"
            onChange={handleChange}
          />
          <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
        </SidebarGroupContent>
      </SidebarGroup>
    </fetcher.Form>
  );
}

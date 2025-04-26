import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router";

export function NewSongButton() {
  return (
    <Button variant="outline" asChild>
      <Link to="/dashboard/songs/new">
        <PlusIcon />
        <span>Dodaj nową pieśń</span>
      </Link>
    </Button>
  );
}

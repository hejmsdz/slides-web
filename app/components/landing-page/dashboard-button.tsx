import { Key } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";

const DashboardButton = () => {
  return (
    <Button
      size="lg"
      variant="outline"
      className="w-full sm:w-auto border-primary-foreground/30 text-primary-background hover:bg-primary-foreground/10 px-8 hover:text-primary-foreground"
      asChild
    >
      <Link to="/dashboard">
        <Key className="w-4 h-4" />
        Zaloguj się do panelu
      </Link>
    </Button>
  );
};

export default DashboardButton;

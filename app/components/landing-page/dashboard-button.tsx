import { Key } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Link, useLoaderData } from "react-router";
import type { loader } from "~/routes/_index";

const DashboardButton = () => {
  const { isAuthenticated } = useLoaderData<typeof loader>();

  return (
    <Button
      size="lg"
      variant="outline"
      className="border-primary-foreground/30 text-primary-background hover:bg-primary-foreground/10 px-8 hover:text-primary-foreground"
      asChild
    >
      {isAuthenticated ? (
        <Link to={`/dashboard`}>
          <Key className="w-4 h-4" />
          Przejdź do panelu
        </Link>
      ) : (
        <Link to={`/auth/google`}>
          <Key className="w-4 h-4" />
          Zaloguj się
        </Link>
      )}
    </Button>
  );
};

export default DashboardButton;

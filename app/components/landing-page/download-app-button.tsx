import { Smartphone } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useLoaderData } from "react-router";
import type { loader } from "~/routes/_index";

const DownloadAppButton = () => {
  const { appDownloadUrl } = useLoaderData<typeof loader>();

  return (
    <Button
      size="lg"
      className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-glow"
      asChild
    >
      <a href={appDownloadUrl} target="_blank" rel="noopener noreferrer">
        <Smartphone className="w-5 h-5 mr-2" />
        Pobierz na Androida
      </a>
    </Button>
  );
};

export default DownloadAppButton;

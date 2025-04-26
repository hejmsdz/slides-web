import { useFetcher } from "react-router";
import { Button } from "~/components/ui/button";
import { Copy, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { TeamInvitation } from "~/api/teams";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type TeamInvitationDialogProps = {
  teamId: string;
  teamName: string;
};

function getValidityPeriod(expiresAt: string) {
  const now = new Date();
  const expiresAtDate = new Date(expiresAt);
  const diffMilliseconds = expiresAtDate.getTime() - now.getTime();
  const diffHours = Math.round(diffMilliseconds / (1000 * 60 * 60));

  return `${diffHours}h`;
}

function copyToClipboard(data: string | undefined) {
  if (!data) {
    return;
  }

  navigator.clipboard.writeText(data);
  toast.success("Skopiowano link do schowka");
}

export function TeamInvitationDialog({
  teamId,
  teamName,
}: TeamInvitationDialogProps) {
  const fetcher = useFetcher<TeamInvitation>();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (fetcher.data) {
      setOpen(true);
    }
  }, [fetcher.data]);

  return (
    <>
      <fetcher.Form method="post" action={`/dashboard/teams/${teamId}/invite`}>
        <Button type="submit" variant="outline">
          <UserPlus className="w-4 h-4" />
          Zaproś nową osobę
        </Button>
      </fetcher.Form>
      {fetcher.data && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Zaproszenie do zespołu</DialogTitle>
              <DialogDescription>
                Skopiuj poniższy link i wyślij go osobie, którą chcesz zaprosić
                do&nbsp;zespołu <strong>{teamName}</strong>.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <div className="flex gap-2">
                  <Input
                    id="invitation-url"
                    value={fetcher.data.url}
                    readOnly
                    className="font-mono select-all"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      copyToClipboard(fetcher.data?.url);
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <DialogDescription>
                  Link jest jednorazowy i ważny przez&nbsp;
                  <strong>{getValidityPeriod(fetcher.data.expiresAt)}</strong>.
                </DialogDescription>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Zamknij
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

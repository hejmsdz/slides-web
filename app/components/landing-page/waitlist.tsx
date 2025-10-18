import { useEffect, useId, useRef } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Checkbox } from "../ui/checkbox";
import { Smartphone } from "lucide-react";
import { Link, useFetcher, useLoaderData } from "react-router";
import type { loader } from "~/routes/_index";
import type { action } from "~/routes/waitlist";
import "./waitlist.css";

const Waitlist = () => {
  const htmlId = useId();
  const { formToken } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (fetcher.data?.success) {
      formRef.current?.reset();
    }
  }, [fetcher.data?.success]);

  return (
    <section className="py-24 bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6"
            aria-hidden="true"
          >
            <Smartphone className="w-8 h-8 text-primary" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Już wkrótce na iOS!
          </h2>

          <p className="text-xl text-muted-foreground mb-8">
            Aplikacja jest obecnie dostępna tylko na&nbsp;Androida, ale trwają
            prace nad wersją dla&nbsp;iPhone&apos;ów. Zapisz się na listę
            oczekujących, aby nie przegapić premiery!
          </p>

          <fetcher.Form
            method="post"
            action="/waitlist"
            className="max-w-md mx-auto space-y-4"
            id="waitlist-form"
            ref={formRef}
          >
            <p>
              <Label htmlFor={`${htmlId}-email`} className="sr-only">
                Adres e-mail
              </Label>
              <Input
                id={`${htmlId}-email`}
                type="email"
                required
                name="email"
                placeholder="Wpisz swój adres e-mail"
              />
            </p>

            <p>
              <Label htmlFor={`${htmlId}-name`} className="sr-only">
                Imię
              </Label>
              <Input
                id={`${htmlId}-name`}
                type="text"
                name="name"
                placeholder="Wpisz swoje imię"
              />
            </p>

            <p>
              <Label className="flex items-center">
                <Checkbox
                  name="consent"
                  value="true"
                  className="mr-2"
                  required
                />
                <span className="text-xs text-muted-foreground text-left">
                  Wyrażam zgodę na otrzymywanie informacji o&nbsp;udostępnieniu
                  aplikacji na&nbsp;podany adres e-mail, zgodnie z&nbsp;
                  <Link to="/privacy" className="text-primary underline">
                    polityką prywatności
                  </Link>
                  .
                </span>
              </Label>
            </p>

            <input
              type="hidden"
              name="token"
              value={fetcher.data?.formToken ?? formToken}
            />

            {fetcher.data?.error && (
              <p className="text-sm text-destructive font-bold">
                <span>{fetcher.data?.error}</span>
              </p>
            )}
            {fetcher.data?.success && (
              <p className="text-sm text-green-800 font-bold">
                <span>
                  Dzięki za zapisanie się na listę, do usłyszenia niedługo!
                </span>
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={fetcher.state !== "idle"}
            >
              Dołącz do listy oczekujących
            </Button>
          </fetcher.Form>
        </div>
      </div>
    </section>
  );
};

export default Waitlist;

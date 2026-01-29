import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useMatches,
} from "react-router";
import type { LinksFunction } from "react-router";
import { Route } from "./+types/root";
import { ExternalScripts } from "remix-utils/external-scripts";

import "./tailwind.css";
import { Button } from "~/components/ui/button";
import { Frown } from "lucide-react";
import faviconSvg from "~/assets/psallite.svg?no-inline";

export const links: LinksFunction = () => [];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function tryGetProperty<T>(obj: any, property: string): T | undefined {
  return obj && typeof obj === 'object' && property in obj ? obj[property] as T : undefined;
}

export function Layout({ children }: { children: React.ReactNode }) {
  const matches = useMatches();
  const noScript = matches.some((match) => tryGetProperty(match.handle, "noScript"));

  const backgroundColor = [...matches].reverse().reduce((stack, match) => stack ?? tryGetProperty<string>(match.loaderData, "backgroundColor"), undefined as string | undefined);

  const bodyStyle = {
    '--background-color': backgroundColor,
    backgroundColor: backgroundColor ? 'var(--background-color)' : undefined,
  } as React.CSSProperties;

  return (
    <html lang="pl" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={faviconSvg} type="image/svg+xml" />
        <Meta />
        <Links />
      </head>
      <body className="h-full" style={bodyStyle}>
        {children}
        <ExternalScripts />
        <ScrollRestoration />
        {noScript ? null : <Scripts />}
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const is404 =
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    error.status === 404;

  if (is404) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-6xl font-extrabold text-black mb-4">404</h1>
          <h2 className="text-2xl text-gray-700 font-bold mb-2">
            Nie znaleziono strony
          </h2>
          <p className="text-gray-500 mb-6">
            Strona, której szukasz, nie istnieje,
            <br />a przynajmniej nie pod tym adresem.
          </p>
          <Button variant="default" asChild>
            <Link to={`/`}>Wróć do strony głównej</Link>
          </Button>
        </div>
      </div>
    );
  }

  console.log(error);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Frown className="w-10 h-10 text-red-600" />
      <div className="text-center">
        <h1 className="text-2xl font-bold my-2">
          Wystąpił niespodziewany błąd
        </h1>
        <p className="text-gray-500">Spróbuj ponownie później.</p>
      </div>
    </div>
  );
}

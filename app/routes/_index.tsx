import type { MetaFunction } from "react-router";
import { Link, useLoaderData } from "react-router";
import { Key, Smartphone } from "lucide-react";
import { defaultApi } from "~/api/api";
import { getBootstrap } from "~/api/bootstrap";
import { Button } from "~/components/ui/button";

export const meta: MetaFunction = () => {
  return [{ title: "psal.lt" }];
};

export default function Index() {
  const { appDownloadUrl } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-900">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        style={{
          fillRule: "evenodd",
          clipRule: "evenodd",
          strokeLinejoin: "round",
          strokeMiterlimit: 2,
        }}
        viewBox="0 0 430 430"
        width={200}
        height={200}
      >
        <path
          d="M216 40c8.777 0 16 7.223 16 16v120c0 8.777-7.223 16-16 16h-39.36l21.61 27a8.007 8.007 0 0 1 1.754 5c0 4.391-3.613 8.004-8.004 8.004a8.01 8.01 0 0 1-6.25-3.004l-29.59-37H99.84l-29.59 37a8.01 8.01 0 0 1-6.25 3.004c-4.391 0-8.004-3.613-8.004-8.004 0-1.817.619-3.581 1.754-5l21.61-27H40c-8.777 0-16-7.223-16-16V56c0-8.777 7.223-16 16-16h80V24c0-4.389 3.611-8 8-8 4.389 0 8 3.611 8 8v16h80Zm-50.735 31.872a4.994 4.994 0 0 0-4.278-.906l-53.21 13.303a5.002 5.002 0 0 0-3.779 4.838v42.964a16.621 16.621 0 0 0-6.651-1.389c-9.122 0-16.628 7.507-16.628 16.629 0 9.122 7.506 16.628 16.628 16.628s16.628-7.506 16.628-16.628V95.167l43.234-10.808v34.417a16.642 16.642 0 0 0-6.652-1.388c-9.122 0-16.628 7.506-16.628 16.628s7.506 16.629 16.628 16.629 16.629-7.507 16.629-16.629V75.805a4.995 4.995 0 0 0-1.921-3.933Z"
          // style={{ fill: "#d3a858" }}
          className="fill-white"
          transform="matrix(1.63021 0 0 1.63021 6.339 8.788)"
        />
      </svg>
      <h1 className="text-white text-4xl font-bold mb-8">psal.lt</h1>
      <div className="flex flex-row gap-4">
        <Button variant="secondary" asChild>
          <Link to={`/auth/google`}>
            <Key className="w-4 h-4" />
            Zaloguj się
          </Link>
        </Button>
        <Button variant="secondary" asChild>
          <a href={appDownloadUrl}>
            <Smartphone className="w-4 h-4" />
            Pobierz aplikację
          </a>
        </Button>
      </div>
    </div>
  );
}

export async function loader() {
  const bootstrap = await getBootstrap(defaultApi);
  return {
    appDownloadUrl: bootstrap.appDownloadUrl,
  };
}

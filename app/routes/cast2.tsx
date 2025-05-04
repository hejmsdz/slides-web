import { useEffect, useRef, useState } from "react";
import { ExternalScriptsHandle } from "remix-utils/external-scripts";
import PdfPresentation from "~/components/pdf/pdf-presentation";
import "~/styles/presentation.css";
import Spinner from "~/components/spinner";

export const handle: ExternalScriptsHandle = {
  scripts: () => [
    {
      src: "//www.gstatic.com/cast/sdk/libs/caf_receiver/v3/cast_receiver_framework.js",
      defer: false,
      async: false,
    },
  ],
};

export default function Cast() {
  const [url, setUrl] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const contextRef = useRef<framework.CastReceiverContext | null>(null);

  useEffect(() => {
    if (contextRef.current) {
      return;
    }

    const context = cast.framework.CastReceiverContext.getInstance();

    const namespace = "urn:x-cast:lt.psal.psallite";

    context.addCustomMessageListener(`${namespace}.start`, (event) => {
      const { data } = event;

      setUrl(data.url);
      setPage(data.currentPage);
    });

    context.addCustomMessageListener(`${namespace}.changePage`, (event) => {
      const { data } = event;

      setPage(data.page);
    });

    contextRef.current = context.start();
  }, []);

  if (!url) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return <PdfPresentation src={url} page={page + 1} />;
}

import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import { defaultApi } from "~/api/api";
import { getBootstrap } from "~/api/bootstrap";
import { getSession } from "~/session";
import Hero from "~/components/landing-page/hero";
import Features from "~/components/landing-page/features";
import Screenshots from "~/components/landing-page/screenshots";
import Waitlist from "~/components/landing-page/waitlist";
import CTA from "~/components/landing-page/cta";
import Footer from "~/components/landing-page/footer";
import invariant from "tiny-invariant";

export const meta: MetaFunction = () => {
  return [
    { title: "Psallite" },
    {
      name: "description",
      content:
        "Psallite – aplikacja, która ułatwia prowadzenie śpiewu liturgicznego. Wyświetlaj teksty pieśni, steruj prezentacją prosto z telefonu i zaangażuj całą wspólnotę.",
    },
  ];
};

export default function Index() {
  const { hasWaitlist } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <Screenshots />
      {hasWaitlist && <Waitlist />}
      <CTA />
      <Footer />
    </div>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const bootstrap = await getBootstrap(defaultApi);
  const session = await getSession(request.headers.get("Cookie"));

  const hasWaitlist = Boolean(process.env.WAITLIST_API_URL);
  let formToken = "";
  if (hasWaitlist) {
    invariant(process.env.SESSION_SECRET, "SESSION_SECRET is not set");
    formToken = jwt.sign({}, process.env.SESSION_SECRET, {
      jwtid: randomUUID(),
      notBefore: "10s",
    });
  }

  return {
    appDownloadUrl: bootstrap.appDownloadUrl,
    isAuthenticated: Boolean(session.data?.accessToken),
    hasWaitlist,
    formToken,
  };
}

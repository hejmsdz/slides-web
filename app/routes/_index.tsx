import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { defaultApi } from "~/api/api";
import { getBootstrap } from "~/api/bootstrap";
import { getSession } from "~/session";
import Hero from "~/components/landing-page/hero";
import Features from "~/components/landing-page/features";
import Screenshots from "~/components/landing-page/screenshots";
import CTA from "~/components/landing-page/cta";
import Footer from "~/components/landing-page/footer";

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

export const handle = {
  noScript: true,
};

export default function Index() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <Screenshots />
      <CTA />
      <Footer />
    </div>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const bootstrap = await getBootstrap(defaultApi);
  const session = await getSession(request.headers.get("Cookie"));

  return {
    appDownloadUrl: bootstrap.appDownloadUrl,
    isAuthenticated: Boolean(session.data?.accessToken),
  };
}

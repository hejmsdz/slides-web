import { Button } from "~/components/ui/button";
import { Download, Globe } from "lucide-react";
import DashboardButton from "./dashboard-button";
import DownloadAppButton from "./download-app-button";

const CTA = () => {
  return (
    <section className="py-20 bg-gradient-hero">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-12">
            Wypróbuj Psallite już dziś!
          </h2>
          {/* <p className="text-xl text-primary-foreground/90 mb-12 leading-relaxed">
            Join hundreds of churches already using Psallite to create more
            engaging and professional liturgical presentations.
          </p> */}

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <DownloadAppButton />
            <DashboardButton />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;

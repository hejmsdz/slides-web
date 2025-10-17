import DashboardButton from "./dashboard-button";
import DownloadAppButton from "./download-app-button";

const CTA = () => {
  return (
    <section className="py-20 bg-gradient-hero">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-12">
            Wypróbuj Psallite już&nbsp;dziś!
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <DownloadAppButton />
            <DashboardButton />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;

import heroImage from "~/assets/hero.jpg";
import DownloadAppButton from "./download-app-button";
import DashboardButton from "./dashboard-button";
import Logo from "~/assets/psallite.svg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: `url(${heroImage})` }}
      ></div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="w-24 h-24 bg-primary p-1 rounded-2xl shadow-glow mb-4 inline-block">
          <img src={Logo} alt="" className="rounded-2xl text-accent" />
        </div>
        <div className="flex items-center justify-center mb-8">
          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground">
            Niech cały kościół śpiewa!
          </h1>
        </div>

        <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 leading-relaxed">
          Wyświetlaj teksty pieśni liturgicznych bez wysiłku za&nbsp;pomocą
          aplikacji <strong>Psallite</strong>.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <DownloadAppButton />
          <DashboardButton />
        </div>
      </div>
    </section>
  );
};

export default Hero;

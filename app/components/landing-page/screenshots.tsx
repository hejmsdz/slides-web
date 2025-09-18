import imgHome from "~/assets/screenshots/home.png";
import imgSearch from "~/assets/screenshots/search.png";
import imgVerses from "~/assets/screenshots/verses.png";
import imgPresentation from "~/assets/screenshots/presentation.png";

const Screenshots = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Intuicyjna obsługa
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Do stworzenia slajdów wystarczy kilka kliknięć, a sterowanie
            prezentacją odbywa się za pomocą prostych gestów. Możesz skupić się
            na prowadzeniu śpiewu!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <img
            src={imgHome}
            alt="Ekran główny aplikacji z listą pieśni dodanych do zestawu"
            className="w-full h-full object-cover max-w-[366px] mx-auto"
          />
          <img
            src={imgSearch}
            alt="Wyszukiwarka pieśni po tytułach"
            className="w-full h-full object-cover max-w-[366px] mx-auto"
          />
          <img
            src={imgVerses}
            alt="Wybór zwrotki pieśni"
            className="w-full h-full object-cover max-w-[366px] mx-auto"
          />
        </div>
        <div className="max-w-6xl mx-auto">
          <img
            src={imgPresentation}
            alt="Prezentacja pieśni"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default Screenshots;

import { Card, CardContent } from "~/components/ui/card";
import {
  Database,
  Edit3,
  ScreenShare,
  BookMarked,
  Joystick,
  FileText,
} from "lucide-react";

const features = [
  {
    icon: Database,
    title: "Baza pieśni",
    description: "Ponad 150 tekstów pieśni liturgicznych gotowych do użycia.",
  },
  {
    icon: Edit3,
    title: "Własne teksty",
    description:
      "Dodawaj i edytuj własne teksty (na komputerze lub telefonie) i udostępniaj je w swoim zespole.",
  },
  {
    icon: BookMarked,
    title: "Liturgia Słowa",
    description:
      "Refren psalmu i aklamacja przed Ewangelią na dany dzień pobierają się automatycznie.",
  },
  {
    icon: ScreenShare,
    title: "Zewnętrzny ekran",
    description:
      "Prezentuj teksty na rzutniku lub telewizorze przez przeglądarkę WWW, Chromecasta lub funkcję klonowania ekranu, prosto z telefonu.",
  },
  {
    icon: Joystick,
    title: "Zaawansowane zdalne sterowanie",
    description:
      "Przełączaj slajdy, przeskakuj między pieśniami, pomijaj zwrotki. Możesz nawet zmienić repertuar w trakcie nabożeństwa!",
  },
  {
    icon: FileText,
    title: "Eksport do PDF",
    description:
      "Potrzebujesz udostępnić gotowe slajdy w jednym pliku albo wyświetlić je w tradycyjny sposób? Żaden problem!",
  },
];

const Features = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Wszystkie potrzebne funkcje
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Psallite to kompleksowe rozwiązanie do prezentacji pieśni,
            zaprojektowane z myślą o scholach, organistach i kantorach.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="border-none shadow-card hover:shadow-glow transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-6 text-center">
                  <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;

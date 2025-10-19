import { Cast, ScreenShare } from "lucide-react";
import { useLoaderData } from "react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import type { loader } from "~/routes/_index";

function Link({ children, href }: { children: React.ReactNode; href: string }) {
  const isExternal = href.startsWith("http://") || href.startsWith("https://");

  return (
    <a
      href={href}
      className="text-primary underline"
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  );
}

const faqs = [
  {
    question: "Jak wyświetlić prezentację z aplikacji na rzutniku/telewizorze?",
    answer: (
      <>
        <p>
          Prezentację uruchomioną na telefonie możesz połączyć następującymi
          sposobami:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-3">
          <li>
            <h4 className="font-bold">Przez stronę WWW</h4>
            Naciśnij przycisk z ikoną ekranu i strzałki{" "}
            <span className="whitespace-nowrap">
              <ScreenShare className="w-4 h-4 inline" />.
            </span>{" "}
            Pojawi się adres strony, na której będzie dostępna Twoja
            prezentacja, zsynchronizowana w czasie rzeczywistym z telefonem.
            Wejdź na nią na komputerze, kliknij dwukrotnie, żeby wejść w tryb
            pełnoekranowy i podłącz komputer do&nbsp;rzutnika/telewizora.
          </li>
          <li>
            <h4 className="font-bold">
              Przez funkcję bezprzewodowego klonowania ekranu (Miracast)
            </h4>
            Odszukaj w menu telewizora i telefonu opcję, która w zależności od
            marki może się nazywać „Klonowanie ekranu”, „Bezprzewodowy
            wyświetlacz” lub „Smart View” – i połącz się bezprzewodowo. Zasięg
            wynosi zazwyczaj ok.&nbsp;5–10&nbsp;
            <abbr className="no-underline" title="metrów">
              m
            </abbr>
            .
          </li>
          <li>
            <h4 className="font-bold">Przez kabel HDMI/USB-C</h4>
            Jeśli Twój telefon obsługuje funkcję <em>
              DisplayPort Alt Mode
            </em>{" "}
            (np. Samsung Galaxy z serii S), możesz bezpośrednio połączyć go z
            rzutnikiem/telewizorem za pomocą{" "}
            <Link href="https://www.x-kom.pl/p/553343-kabel-hdmi-silver-monkey-kabel-usb-c-hdmi-14-18-m.html?sm=i9rJxe71">
              specjalnego kabla
            </Link>{" "}
            lub{" "}
            <Link href="https://www.x-kom.pl/p/1093339-przejsciowka-silver-monkey-adapter-usb-c-hdmi.html?sm=jhoHiW9X">
              przejściówki
            </Link>
            .
          </li>
          <li>
            <h4 className="font-bold">
              Przez Google Cast (dawniej Chromecast)
            </h4>
            Ta opcja wymaga urządzenia z systemem Android TV / Google TV,
            znajdującego się w tej samej sieci WiFi co telefon. Aby nawiązać
            połączenie, naciśnij przycisk{" "}
            <span className="whitespace-nowrap">
              <Cast
                aria-label="z ikoną Google Cast"
                className="w-4 h-4 inline"
              />
              .
            </span>{" "}
            Jeśli Twój telewizor nie ma wbudowanej obsługi Google Cast, możesz
            użyć przystawki podłączanej przez HDMI, np.{" "}
            <Link href="https://www.x-kom.pl/p/1350572-odtwarzacz-multimedialny-xiaomi-smart-tv-stick-4k-eu-2-gen.html?sm=RJ4v98gu">
              Xiaomi Smart TV Stick
            </Link>
            .
          </li>
        </ul>
        <p>
          Jeśli nie możesz zastosować żadnego z tych sposobów, pobierz
          prezentację jako plik PDF i wyświetl go tradycyjnie przez komputer.
        </p>
      </>
    ),
  },
  {
    question: "Czy muszę się logować?",
    answer: (
      <p>
        Nie, prezentacje można tworzyć i wyświetlać bez logowania. Konto będzie
        Ci potrzebne tylko jeśli chcesz dodawać własne teksty pieśni.
      </p>
    ),
  },
  {
    question: "Jak dodać własne teksty pieśni?",
    answer: (
      <>
        <p>
          Możesz to zrobić po zalogowaniu się na stronie{" "}
          <Link href="/dashboard">psal.lt</Link>, a także w aplikacji mobilnej.
          Teksty dodane na komputerze będą dostępne w&nbsp;aplikacji mobilnej i
          vice versa.
        </p>
        <p>
          Przy wpisywaniu tekstu, rozdzielaj zwrotki pustą linią – każdy taki
          blok tekstu zostanie wyświetlony jako kolejny slajd. Na stronie edycji
          tekstu znajdziesz dodatkowe wskazówki dotyczące formatowania i
          umieszczania powtarzających się fragmentów (refrenów).
        </p>
      </>
    ),
  },
  {
    question: "Kto ma dostęp do dodanych przeze mnie tekstów?",
    answer: (
      <p>
        Teksty, które dodajesz do aplikacji, są prywatne. Jeśli chcesz
        udostępnić je innym osobom ze swojej wspólnoty, żeby też mogły je
        edytować i wykorzystywać na slajdach, możesz zaprosić ich do Twojego
        zespołu, przekazując im specjalny link – znajdziesz tę opcję w menu
        bocznym, po kliknięciu na nazwę zespołu.
      </p>
    ),
  },
  {
    question:
      "Wersja tekstu w bazie pieśni różni się od tej, którą znam i którą śpiewa się u mnie. Mogę ją edytować?",
    answer: (
      <p>
        Tak, możesz edytować teksty w bazie pieśni. Zmiany będą widoczne tylko
        dla Twojego zespołu.
      </p>
    ),
  },
  {
    question: "Czy aplikacja działa offline?",
    answer: (
      <>
        <p>
          W bardzo ograniczonym zakresie. Do stworzenia prezentacji potrzebne
          jest połączenie z internetem. Jeśli w czasie nabożeństwa nie masz
          dostępu do sieci, możesz przygotować slajdy wcześniej i pobrać je jako
          plik PDF.
        </p>
        <p>
          Sterowanie prezentacją w trybie offline jest możliwe tylko przy
          połączeniu kablem HDMI lub przez Miracast.
        </p>
      </>
    ),
  },
  {
    question: "Ile to kosztuje?",
    answer: (
      <p>
        Aplikacja jest darmowa. Choć jeśli liczba użytkowników przekroczy moje
        oczekiwania i wytrzymałość serwera, to mogę w przyszłości wprowadzić
        drobną opłatę.
      </p>
    ),
  },
];

const FAQ = () => {
  const { contactUrl } = useLoaderData<typeof loader>();

  const contact = contactUrl
    ? [
        {
          question:
            "Mam inne pytanie, chcę zgłosić błąd albo zaproponować nową funkcję.",
          answer: (
            <p>
              Wspaniale! <Link href={contactUrl}>Napisz do mnie maila</Link>.
            </p>
          ),
        },
      ]
    : [];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Najczęściej zadawane pytania
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-4" asChild>
          <ul className="max-w-3xl mx-auto">
            {[...faqs, ...contact].map((faq, index) => (
              <li key={index}>
                <AccordionItem
                  value={`item-${index}`}
                  className="bg-card border border-border rounded-lg px-6"
                >
                  <AccordionTrigger className="text-left">
                    <h3>{faq.question}</h3>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-3">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </li>
            ))}
          </ul>
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;

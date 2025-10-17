import { MetaFunction, useLoaderData } from "react-router";

export const meta: MetaFunction = () => {
  return [{ title: "Polityka prywatności" }];
};

export const handle = {
  noScript: true,
};

export async function loader() {
  return {
    adminName: process.env.PRIVACY_POLICY_ADMIN_NAME,
    adminEmail: process.env.PRIVACY_POLICY_ADMIN_EMAIL,
  };
}

function Section({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        {number}. {title}
      </h2>
      <div className="text-gray-700">{children}</div>
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="list-disc pl-6 mt-2 space-y-1">
      {items.map((item, index) => (
        <li key={index} className="text-gray-700">
          {item}
        </li>
      ))}
    </ul>
  );
}

function Link({ children, href }: { children: React.ReactNode; href: string }) {
  const isExternal = href.startsWith("http://") || href.startsWith("https://");

  return (
    <a
      href={href}
      className="text-blue-600 hover:underline"
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  );
}

function EmailLink() {
  const { adminEmail: email } = useLoaderData<typeof loader>();

  return <Link href={`mailto:${email}`}>{email}</Link>;
}

export default function PrivacyPolicy() {
  const { adminName } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-prose mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        Polityka prywatności
      </h1>

      <p className="text-gray-700 mb-8">
        Niniejszy dokument określa zasady przetwarzania danych osobowych
        użytkowników aplikacji Psallite, służącej do tworzenia i obsługi
        prezentacji z tekstami pieśni kościelnych. Aplikacja składa się ze
        strony internetowej oraz aplikacji mobilnej.
      </p>

      <Section number={1} title="Administrator danych">
        <p>Administratorem danych osobowych jest:</p>
        <p className="mt-2">
          {adminName}
          <br />
          Adres e-mail: <EmailLink />
        </p>
      </Section>

      <Section number={2} title="Zakres przetwarzanych danych">
        <p>
          Z aplikacji mobilnej Psallite można korzystać bez logowania — w takim
          przypadku dane osobowe nie są zbierane.
        </p>
        <p className="mt-2">
          Dane osobowe są przetwarzane przede wszystkim w przypadku zalogowania
          się użytkownika przez konto Google (dotyczy aplikacji webowej oraz
          aplikacji mobilnej po zalogowaniu). W&nbsp;takim przypadku
          przetwarzane dane to:
        </p>
        <List
          items={[
            "adres e-mail,",
            "imię i nazwisko (możliwe do edycji po zalogowaniu).",
          ]}
        />
        <p className="mt-2">
          Dane osobowe są przetwarzane również po zapisaniu się na listę
          oczekujących przez stronę WWW. Wówczas przetwarzany jest tylko adres
          e-mail.
        </p>
      </Section>

      <Section number={3} title="Cel i podstawa prawna przetwarzania danych">
        <p>Dane osobowe są przetwarzane wyłącznie w celu:</p>
        <List
          items={[
            "umożliwienia logowania i zarządzania kontem,",
            "przypisywania treści do autora (np. własne teksty pieśni),",
            "przekazywania istotnych informacji technicznych lub organizacyjnych związanych z funkcjonowaniem aplikacji, takich jak planowana niedostępność usługi, zmiany w regulaminie lub polityce prywatności.",
          ]}
        />
        <p className="mt-4">
          Podstawą prawną przetwarzania danych jest art. 6 ust. 1 lit. b RODO —
          przetwarzanie jest niezbędne do wykonania umowy (świadczenia usług w
          ramach aplikacji). W&nbsp;zakresie wysyłania istotnych informacji (np.
          o zmianach warunków korzystania) podstawą jest także prawnie
          uzasadniony interes administratora.
        </p>
      </Section>

      <Section number={4} title="Dobrowolność podania danych">
        <p>
          Podanie danych osobowych jest dobrowolne. Użytkownik może korzystać z
          aplikacji mobilnej w trybie niezalogowanym, ale wówczas nie ma dostępu
          do funkcji edycji i wprowadzania własnych treści.
        </p>
      </Section>

      <Section number={5} title="Zbieranie danych technicznych">
        <p>
          Aplikacja może automatycznie zbierać anonimowe dane techniczne
          dotyczące sposobu korzystania z niej, takie jak:
        </p>
        <List
          items={[
            "liczba żądań HTTP,",
            "czas odpowiedzi serwera,",
            "komunikaty o błędach,",
            "metoda i ścieżka zapytania,",
            "kod odpowiedzi serwera,",
            "identyfikator agenta użytkownika (User-Agent),",
            "kraj pochodzenia zapytania (ustalany tymczasowo na podstawie adresu IP).",
          ]}
        />
        <p className="mt-2">
          Do celów statystycznych i optymalizacyjnych wykorzystywana jest usługa{" "}
          <Link href="https://apianalytics.dev">API&nbsp;Analytics</Link>. Dane
          przekazywane do tej usługi są anonimizowane — adres IP jest
          przetwarzany wyłącznie tymczasowo w celu określenia kraju użytkownika
          użytkownika i następnie usuwany. Dane te nie pozwalają na
          identyfikację konkretnego użytkownika.
        </p>
      </Section>

      <Section number={6} title="Przekazywanie danych">
        <p>
          Dane osobowe nie są przekazywane, sprzedawane, ani udostępniane żadnym
          podmiotom trzecim.
        </p>
        <p className="mt-2">
          Wyjątkiem jest przekazywanie zanonimizowanych danych technicznych do
          usługi API&nbsp;Analytics w celu analizy i optymalizacji działania
          aplikacji. Usługa ta nie gromadzi danych umożliwiających identyfikację
          użytkownika — w tym adresów IP, które są usuwane po określeniu kraju.
          Dane są przechowywane na zabezpieczonym serwerze zlokalizowanym w
          Londynie (Wielka Brytania).
        </p>
      </Section>

      <Section number={7} title="Brak reklam i profilowania">
        <p>
          Aplikacja nie zawiera reklam i nie prowadzi profilowania użytkowników.
        </p>
      </Section>

      <Section number={8} title="Hosting i przetwarzanie danych">
        <p>
          Dane przechowywane są na serwerach zlokalizowanych w Unii
          Europejskiej. Infrastruktura hostingowa spełnia wymagania RODO.
          Wykonywane są regularne kopie zapasowe.
        </p>
      </Section>

      <Section number={9} title="Czas przechowywania danych">
        <p>
          Dane użytkownika zalogowanego są przechowywane dopóki użytkownik
          posiada konto w aplikacji. Usunięcie konta skutkuje trwałym usunięciem
          danych.
        </p>
        <p className="mt-2">
          Dane użytkownika zapisanego na listę oczekujących są przechowywane do
          momentu udostępnienia produktu, na który oczekuje użytkownik, ale nie
          dłużej niż 2 lata.
        </p>
      </Section>

      <Section number={10} title="Ciasteczka (cookies)">
        <p>
          Aplikacja webowa korzysta z ciasteczek wyłącznie w zakresie niezbędnym
          do&nbsp;działania systemu logowania (utrzymywanie sesji) i
          zapamiętania preferencji użytkownika. Nie są one wykorzystywane
          do&nbsp;celów marketingowych ani analitycznych.
        </p>
      </Section>

      <Section number={11} title="Uprawnienia użytkownika">
        <p>Zgodnie z RODO, użytkownik ma prawo do:</p>
        <List
          items={[
            "dostępu do swoich danych,",
            "ich poprawiania,",
            'usunięcia („prawo do bycia zapomnianym"),',
            "ograniczenia przetwarzania,",
            "przenoszenia danych,",
            "wniesienia skargi do organu nadzorczego (Prezes UODO).",
          ]}
        />
        <p className="mt-4">
          W celu realizacji swoich praw należy skontaktować się
          z&nbsp;administratorem pod&nbsp;adresem: <EmailLink />.
        </p>
      </Section>

      <p className="text-gray-600 mb-8">
        Data aktualizacji: 17 października 2025 r.
      </p>
    </div>
  );
}

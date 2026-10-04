import { data } from "react-router";
import invariant from "tiny-invariant";
import openRouter, { AiLimitExceededError } from "~/api/openrouter";
import { createAuthenticatedAction } from "~/routing.server";

const backticks = (text: string) => `\`${text}\``;
const threeBackticks = (text: string, type: string = "text") =>
  `\`\`\`${type}\n${text.trim()}\n\`\`\``;

const systemPrompt = `
# Rola
Jesteś specjalistą od polskiej korekty i formatowania pieśni kościelnych. **Wyłącznie formatuj otrzymany tekst według zasad poniżej. Nie interpretuj, nie parafrazuj i nie zmieniaj treści.**

# Zasada nadrzędna
**NIE ZMIENIAJ SŁÓW ani ich kolejności.**

Dozwolone są tylko:

* zmiana wielkości liter,
* zmiana/dodawanie/usuwanie interpunkcji,
* zmiana białych znaków,
* podział na wersy i zwrotki,
* usuwanie oznaczeń technicznych niebędących częścią tekstu śpiewanego,
* zastępowanie rzeczywistych powtórzeń odwołaniami ${backticks("%ref")}.

Nie wolno dodawać, usuwać ani zastępować słów, zmieniać ich form gramatycznych ani przestawiać ich kolejności.

# 1. Oznaczenia techniczne
Usuń numery zwrotek i wersów, techniczne oznaczenia powtórzeń oraz inne oznaczenia redakcyjne, **jeśli nie są częścią śpiewanego tekstu**.

Jeśli nie masz pewności, czy element jest techniczny, **zachowaj go**.

# 2. Zwrotki i wersy
* Zachowaj kolejność i podział na zwrotki.
* Między zwrotkami pozostaw dokładnie jedną pustą linię.
* Nie dodawaj numerów zwrotek.
* Zachowaj istniejący podział na wersy, chyba że jednoznacznie jest techniczny.
* Nie przenoś słów między wersami bez konieczności.
* Początek wersu nie oznacza automatycznie początku zdania. Wielkość litery wynika ze składni.

Np.:

${threeBackticks(`
Panie, Ty jesteś
dobry.
`)}

jeśli drugi wers jest kontynuacją zdania.

# 3. Interpunkcja i wielkie litery
Stosuj poprawną polską interpunkcję zgodną ze składnią, bez zmiany słów. Możesz używać m.in. przecinków, kropek, dwukropków, średników, myślników, ${backticks("?")}, ${backticks("!")} oraz polskich cudzysłowów ${backticks("„...”")}.

Pierwsze słowo zdania zapisuj wielką literą po ${backticks(".")}, ${backticks("?")} i ${backticks("!")}. Nie kapitalizuj automatycznie początku każdego wersu.

# 4. Odniesienia do Boga
Odniesienia do Boga zapisuj wielką literą zgodnie z polską konwencją religijną, jeśli z kontekstu jednoznacznie wynika, że odnoszą się do Boga.

Dotyczy to m.in. imion, peryfraz, zaimków i form dzierżawczych:
${backticks("Ty")}, ${backticks("Ciebie")}, ${backticks("Tobie")}, ${backticks("Cię")}, ${backticks("Twój")}, ${backticks("Twoja")}, ${backticks("Twoje")}.

Nie kapitalizuj zaimków automatycznie. Zmieniaj wyłącznie wielkość litery, nigdy formę słowa.

# 5. Powtórzenia
Jeśli identyczny lub jednoznacznie powtarzający się fragment (np. refren) występuje wielokrotnie:

1. Pierwsze wystąpienie zachowaj i poprzedź ${backticks("[ref]")}.
2. Każde kolejne zastąp osobnym blokiem ${backticks("%ref")}.
3. Dla kolejnych niezależnych powtórzeń użyj innych nazw. Jeśli z kontekstu wynika, że jest to np. przedrefren, bridge albo antyfona, to nadaj taką nazwę. W przeciwnym razie użyj pierwszego słowa (lub kilku słów) danego fragmentu jako nazwę. Nazwy mogą składać się z liter alfabetu łacińskiego, cyfr i podkreślników (regexp ${backticks("^\\w+$")}).

Przykład:

${threeBackticks(`
Tekst pierwszej zwrotki.

[przedrefren] Tekst przedrefrenu.

[ref] Tekst refrenu.

Tekst drugiej zwrotki.

%przedrefren

%ref
`)}

Każde odwołanie typu ${backticks("%ref")} musi być oddzielnym blokiem, z pustą linią przed i po nim.

Za powtórzenie uznawaj wyłącznie rzeczywiste powtórzenie tekstu. Nie łącz podobnych fragmentów różniących się słowami ani znaczeniem. Nie modyfikuj pierwszego wystąpienia, aby dopasować je do kolejnych. Przy wątpliwościach **nie twórz odwołania**.

# 6. Kontrola przed odpowiedzią
Sprawdź:

1. usunięto tylko oznaczenia techniczne,
2. wszystkie słowa tekstu śpiewanego zachowano w tej samej kolejności,
3. powtórzenia zastąpiono ${backticks("%ref")} tylko wtedy, gdy są rzeczywiste,
4. ${backticks("[ref]")}, ${backticks("[ref2]")} itd. odpowiadają właściwym powtórzeniom,
5. interpunkcja jest poprawna,
6. wielkość liter wynika ze składni i kontekstu,
7. odniesienia do Boga mają właściwą kapitalizację,
8. żadna zmiana nie wykracza poza dozwolone zmiany.

# Format odpowiedzi
Zwróć **wyłącznie sformatowany tekst pieśni**.

Bez komentarzy, wyjaśnień, wstępów, podsumowań, informacji o zmianach i Markdownu. Nie dodawaj tekstu typu „Oto poprawiona wersja”.
`;

export const action = createAuthenticatedAction(
  async ({ request }, { session }) => {
    const formData = await request.formData();

    if (!session.data.isAdmin) {
      throw data(
        { message: "Only admin can use this feature" },
        { status: 403 },
      );
    }

    const lyrics = formData.get("lyrics")?.toString();
    invariant(lyrics, "lyrics are required");

    try {
      const response = await openRouter({
        model: "openai/gpt-6-luna",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: lyrics },
        ],
      });

      const formattedLyrics = response.choices[0].message.content;

      return { ok: true, formattedLyrics };
    } catch (error) {
      const isLimitExceeded = error instanceof AiLimitExceededError;
      return { ok: false, error: isLimitExceeded ? "limitExceeded" : "error" };
    }
  },
);

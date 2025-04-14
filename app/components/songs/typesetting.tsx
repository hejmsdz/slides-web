
const verseName = /^\[(\w+)\]\s+/;
const verseRef = /^%(\w+)$/;

const commentSymbol = "//";
const lineBreakSymbol = " * ";

export function formatLyrics(lyricsString: string): string[] {
  const verses = lyricsString.split("\n\n");
  const lyrics: string[] = [];
  const namedVerses: Record<string, string> = {};

  for (let verse of verses) {
    if (verse.startsWith(commentSymbol)) {
      continue;
    }

    const refMatch = verse.match(verseRef);
    if (refMatch) {
      const name = refMatch[1];
      if (namedVerses[name]) {
        verse = namedVerses[name];
      }
    } else {
      verse = verse.replaceAll(lineBreakSymbol, "\n");
      const nameMatch = verse.match(verseName);
      if (nameMatch) {
        const name = nameMatch[1];
        verse = verse.slice(nameMatch[0].length);
        namedVerses[name] = verse;
      }
    }

    lyrics.push(verse);
  }

  return lyrics;
}

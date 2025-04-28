import { forwardRef, Fragment, useRef, useState } from "react";
import { cn } from "~/lib/utils";

type Block = VerseText | VerseDefinition | VerseReference | Comment;

type VerseText = {
  type: "verse";
  text: string;
};

type VerseDefinition = {
  type: "def";
  name: string;
  text: string;
};

type VerseReference = {
  type: "ref";
  name: string;
  isValid: boolean;
};

type Comment = {
  type: "comment";
  text: string;
};

type ParsedLyrics = {
  blocks: Block[];
  definitions: Record<string, string>;
};

function parseLyrics(lyrics: string): ParsedLyrics {
  const definitions: Record<string, string> = {};

  const blocks = lyrics.split("\n\n").map((block: string): Block => {
    if (block.startsWith("//")) {
      return { type: "comment", text: block };
    }

    const defMatch = block.match(/^\[(\w+)\]/);
    if (defMatch) {
      definitions[defMatch[1]] = block;
      return {
        type: "def",
        name: defMatch[1].trim(),
        text: block.slice(defMatch[0].length),
      };
    }

    const refMatch = block.match(/^%(\w+)$/);
    if (refMatch) {
      return {
        type: "ref",
        name: refMatch[1].trim(),
        isValid: Boolean(definitions[refMatch[1].trim()]),
      };
    }

    return { type: "verse", text: block };
  });

  return { blocks, definitions };
}

const Verse = ({ text }: VerseText) => {
  return <div>{text || " "}</div>;
};

const Def = ({
  name,
  text,
  definitionColors,
}: VerseDefinition & {
  definitionColors: Record<string, string>;
}) => {
  return (
    <div>
      <span className={definitionColors[name]}>[{name}]</span>
      {text}
    </div>
  );
};

const Ref = ({
  name,
  isValid,
  definitionColors,
}: VerseReference & {
  definitionColors: Record<string, string>;
}) => {
  return (
    <div className={cn(isValid ? definitionColors[name] : "line-through")}>
      %{name}
    </div>
  );
};

const Comment = ({ text }: Comment) => {
  return <div className="text-gray-400 line-through">{text}</div>;
};

const Block = ({
  block,
  definitionColors,
}: {
  block: Block;
  definitionColors: Record<string, string>;
}) => {
  switch (block.type) {
    case "verse":
      return <Verse {...block} />;
    case "def":
      return <Def {...block} definitionColors={definitionColors} />;
    case "ref":
      return <Ref {...block} definitionColors={definitionColors} />;
    case "comment":
      return <Comment {...block} />;
  }
};

const textClassNames =
  "absolute inset-0 px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm";

const colors = [
  "text-red-700",
  "text-sky-700",
  "text-lime-700",
  "text-yellow-700",
  "text-purple-700",
  "text-orange-700",
];

const LyricsEditor = forwardRef<
  HTMLTextAreaElement,
  Omit<React.ComponentProps<"textarea">, "defaultValue"> & {
    defaultValue?: string;
  }
>(({ className, defaultValue = "", ...rest }, ref) => {
  const [value, setValue] = useState<string>(defaultValue);
  const textRef = useRef<HTMLDivElement>(null);

  const { blocks, definitions } = parseLyrics(value);
  const definitionColors = Object.keys(definitions).reduce(
    (acc, key, index) => {
      acc[key] = colors[index % colors.length];
      return acc;
    },
    {} as Record<string, string>,
  );

  return (
    <div
      className={cn(
        "relative flex min-h-[60px] w-full border border-input bg-transparent",
        className,
      )}
    >
      <textarea
        ref={ref}
        value={value}
        onInput={(e) => setValue(e.currentTarget.value)}
        className={cn(
          textClassNames,
          "absolute inset-0 text-transparent caret-foreground rounded-md overscroll-none resize-none",
        )}
        onScroll={(event) => {
          if (textRef.current) {
            textRef.current.scrollTop = event.currentTarget.scrollTop;
          }
        }}
        {...rest}
      />
      <div
        ref={textRef}
        className={cn(
          textClassNames,
          "pointer-events-none whitespace-pre-wrap overflow-hidden",
        )}
        aria-hidden
      >
        {blocks.map((block, i) => (
          <Fragment key={i}>
            <Block block={block} definitionColors={definitionColors} />
            <br />
          </Fragment>
        ))}
      </div>
    </div>
  );
});

LyricsEditor.displayName = "LyricsEditor";

export default LyricsEditor;

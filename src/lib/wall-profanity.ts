import {
  DataSet,
  englishDataset,
  englishRecommendedTransformers,
  pattern,
  RegExpMatcher,
} from "obscenity";

// obscenity's English dataset handles leetspeak, repeated letters, spacing and
// confusable characters. We add a few phrases it doesn't cover.
const matcher = new RegExpMatcher({
  ...englishRecommendedTransformers,
  ...new DataSet<{ originalWord: string }>()
    .addAll(englishDataset)
    .addPhrase((phrase) => phrase.setMetadata({ originalWord: "kys" }).addPattern(pattern`kill yourself`))
    .addPhrase((phrase) => phrase.setMetadata({ originalWord: "hitler" }).addPattern(pattern`|heil hitler|`))
    .build(),
});

// obscenity ignores "f u c k" / "f.u.c.k" on purpose; glue those runs back together.
const spacedLetters = /(?<![\p{L}\p{N}])\p{L}(?:[\s.\-_*]+\p{L}){2,}(?![\p{L}\p{N}])/gu;

export function hasProfanity(text: string): boolean {
  if (matcher.hasMatch(text)) return true;
  const glued = text.replace(spacedLetters, (run) => run.replace(/[\s.\-_*]+/g, ""));
  return glued !== text && matcher.hasMatch(glued);
}

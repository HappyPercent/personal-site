import {
  DataSet,
  englishDataset,
  englishRecommendedTransformers,
  pattern,
  RegExpMatcher,
} from "obscenity";

// Self-harm talk doesn't belong on a public wall either. `|` anchors a word
// boundary, so "skill me" and "the end of my life's work" don't trip it.
// Some doubled letters are collapsed before matching, hence "wana" and "cuting".
const selfHarm = [
  pattern`|kill me|`,
  pattern`|kill myself|`,
  pattern`|killing myself|`,
  pattern`|kms|`,
  pattern`|suicide`,
  pattern`|suicidal|`,
  pattern`|want to die|`,
  pattern`|wana die|`,
  pattern`|end my life|`,
  pattern`|end it all|`,
  pattern`|hurt myself|`,
  pattern`|cut myself|`,
  pattern`|cuting myself|`,
  pattern`|hang myself|`,
  pattern`|self?harm`, // ? matches any one character: space, hyphen, underscore
  pattern`|selfharm`,
  pattern`|unalive`,
];

// obscenity's English dataset handles leetspeak, repeated letters, spacing and
// confusable characters. We add a few phrases it doesn't cover.
const matcher = new RegExpMatcher({
  ...englishRecommendedTransformers,
  ...new DataSet<{ originalWord: string }>()
    .addAll(englishDataset)
    .addPhrase((phrase) => phrase.setMetadata({ originalWord: "kys" }).addPattern(pattern`kill yourself`))
    .addPhrase((phrase) => phrase.setMetadata({ originalWord: "hitler" }).addPattern(pattern`|heil hitler|`))
    .addPhrase((phrase) => selfHarm.reduce((p, pat) => p.addPattern(pat), phrase.setMetadata({ originalWord: "self-harm" })))
    .build(),
});

// obscenity ignores "f u c k" / "f.u.c.k" on purpose; glue those runs back together.
const spacedLetters = /(?<![\p{L}\p{N}])\p{L}(?:[\s.\-_*]+\p{L}){2,}(?![\p{L}\p{N}])/gu;

export function hasProfanity(text: string): boolean {
  if (matcher.hasMatch(text)) return true;
  const glued = text.replace(spacedLetters, (run) => run.replace(/[\s.\-_*]+/g, ""));
  return glued !== text && matcher.hasMatch(glued);
}

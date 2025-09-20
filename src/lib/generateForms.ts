import { toRomaji } from "wanakana";
import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";

const godanMap: Record<
  string,
  { dict: string; nai: string; te: string; ta: string }
> = {
  う: { dict: "う", nai: "わない", te: "って", ta: "った" },
  つ: { dict: "つ", nai: "たない", te: "って", ta: "った" },
  る: { dict: "る", nai: "らない", te: "って", ta: "った" },
  く: { dict: "く", nai: "かない", te: "いて", ta: "いた" },
  ぐ: { dict: "ぐ", nai: "がない", te: "いで", ta: "いだ" },
  す: { dict: "す", nai: "さない", te: "して", ta: "した" },
  ぬ: { dict: "ぬ", nai: "なない", te: "んで", ta: "んだ" },
  む: { dict: "む", nai: "まない", te: "んで", ta: "んだ" },
  ぶ: { dict: "ぶ", nai: "ばない", te: "んで", ta: "んだ" },
};

function masuToDict(masu: string, group: string): string {
  const stem = masu.slice(0, -2); // hapus ます
  if (group === "1") {
    const lastKana = stem.slice(-1);
    const kanaMap: Record<string, string> = {
      い: "う",
      き: "く",
      ぎ: "ぐ",
      し: "す",
      ち: "つ",
      に: "ぬ",
      ひ: "ふ",
      び: "ぶ",
      み: "む",
      り: "る",
    };
    const dictLast = kanaMap[lastKana] || lastKana;
    return stem.slice(0, -1) + dictLast;
  }
  if (group === "2") return stem + "る";
  if (group === "3") {
    if (masu === "します") return "する";
    if (masu === "きます") return "くる";
  }
  return stem;
}

export async function generateForms(masu: string, group: string) {
  const kuroshiro = new Kuroshiro();
  await kuroshiro.init(new KuromojiAnalyzer());

  const dictForm = masuToDict(masu, group); // bentuk kamus
  const base = dictForm.slice(0, -1); // stem kamus
  const lastKana = dictForm.slice(-1);
  const stem = base;

  // Hitung masuSuffix dari input asli
  const masuSuffix = masu.slice(stem.length);

  if (group === "1") {
    const rule = godanMap[lastKana];
    if (!rule) {
      return {
        stem,
        masu: masuSuffix,
        kanji: masu,
        dict: "",
        te: "",
        nai: "",
        ta: "",
        masuRead: toRomaji(masu),
        dictRead: "",
        teRead: "",
        naiRead: "",
        taRead: "",
      };
    }

    return {
      stem,
      masu: masuSuffix,
      kanji: masu,
      dict: rule.dict,
      te: rule.te,
      nai: rule.nai,
      ta: rule.ta,
      masuRead: await kuroshiro.convert(masu, { to: "romaji" }),
      dictRead: await kuroshiro.convert(base + rule.dict, { to: "romaji" }),
      teRead: await kuroshiro.convert(base + rule.te, { to: "romaji" }),
      naiRead: await kuroshiro.convert(base + rule.nai, { to: "romaji" }),
      taRead: await kuroshiro.convert(base + rule.ta, { to: "romaji" }),
    };
  }

  if (group === "2") {
    const stem = dictForm.slice(0, -1);
    return {
      stem,
      masu: masuSuffix,
      kanji: masu,
      dict: "る",
      te: "て",
      nai: "ない",
      ta: "た",
      masuRead: await kuroshiro.convert(masu, { to: "romaji" }),
      dictRead: await kuroshiro.convert(dictForm, { to: "romaji" }),
      teRead: await kuroshiro.convert(stem + "て", { to: "romaji" }),
      naiRead: await kuroshiro.convert(stem + "ない", { to: "romaji" }),
      taRead: await kuroshiro.convert(stem + "た", { to: "romaji" }),
    };
  }

  if (group === "3") {
    if (masu === "します") {
      return {
        stem: "し",
        masu: "ます",
        kanji: masu,
        dict: "する",
        te: "して",
        nai: "しない",
        ta: "した",
        masuRead: await kuroshiro.convert(masu, { to: "romaji" }),
        dictRead: await kuroshiro.convert("する", { to: "romaji" }),
        teRead: await kuroshiro.convert("して", { to: "romaji" }),
        naiRead: await kuroshiro.convert("しない", { to: "romaji" }),
        taRead: await kuroshiro.convert("した", { to: "romaji" }),
      };
    }
    if (masu === "きます") {
      return {
        stem: "き",
        masu: "ます",
        kanji: masu,
        dict: "くる",
        te: "きて",
        nai: "こない",
        ta: "きた",
        masuRead: await kuroshiro.convert(masu, { to: "romaji" }),
        dictRead: await kuroshiro.convert("くる", { to: "romaji" }),
        teRead: await kuroshiro.convert("きて", { to: "romaji" }),
        naiRead: await kuroshiro.convert("こない", { to: "romaji" }),
        taRead: await kuroshiro.convert("きた", { to: "romaji" }),
      };
    }
  }

  return {
    stem,
    masu: masuSuffix,
    kanji: masu,
    dict: "",
    te: "",
    nai: "",
    ta: "",
    masuRead: await kuroshiro.convert(masu, { to: "romaji" }),
    dictRead: "",
    teRead: "",
    naiRead: "",
    taRead: "",
  };
}

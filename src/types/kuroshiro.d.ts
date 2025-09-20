declare module "kuroshiro" {
  export default class Kuroshiro {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    init(analyzer: any): Promise<void>;
    convert(text: string, options?: { to?: "hiragana" | "katakana" | "romaji" }): Promise<string>;
  }
}

declare module "kuroshiro-analyzer-kuromoji" {
  export default class KuromojiAnalyzer { }
}

export class LZW {
  // 圧縮処理
  static compress(input: Uint8Array): number[] {
    const dictionary: { [key: string]: number } = {};
    let dictSize = 256;

    // 初期辞書を作成 (0-255のバイト値を登録)
    for (let i = 0; i < 256; i++) {
      dictionary[String.fromCharCode(i)] = i;
    }

    let result: number[] = [];
    let w = "";

    for (const byte of input) {
      const c = String.fromCharCode(byte);
      const wc = w + c;

      if (dictionary.hasOwnProperty(wc)) {
        w = wc;
      } else {
        result.push(dictionary[w]);
        dictionary[wc] = dictSize++;
        w = c;
      }
    }

    // 最後の文字列を出力
    if (w !== "") {
      result.push(dictionary[w]);
    }

    return result;
  }

  // 解凍処理
  static decompress(compressed: number[]): Uint8Array {
    const dictionary: { [key: number]: string } = {};
    let dictSize = 256;

    // 初期辞書を作成 (0-255のバイト値を登録)
    for (let i = 0; i < 256; i++) {
      dictionary[i] = String.fromCharCode(i);
    }

    let w = dictionary[compressed[0]];
    if (!w) throw new Error("Invalid compressed data");

    const result: number[] = Array.from(w).map(char => char.charCodeAt(0));

    for (let i = 1; i < compressed.length; i++) {
      const k = compressed[i];
      let entry: string;

      if (dictionary[k]) {
        entry = dictionary[k];
      } else if (k === dictSize) {
        entry = w + w[0];
      } else {
        throw new Error("Invalid compressed sequence");
      }

      result.push(...Array.from(entry).map(char => char.charCodeAt(0)));
      dictionary[dictSize++] = w + entry[0];
      w = entry;
    }

    return new Uint8Array(result);
  }
}

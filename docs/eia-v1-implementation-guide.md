# EIA v1 実装ガイド

## 概要

本文書は、EIA v1フォーマットの実装ガイダンスを提供し、エンコーディング戦略、最適化技術、一般的な使用例を含みます。

## 1. エンコーディング戦略

### 1.1 キーフレーム選択

エンコーダーは圧縮効率とランダムアクセスのバランスを取るためキーフレーム間隔を使用すべきです（SHOULD）：

```typescript
const keyframeInterval = 10; // 10フレームごとがキーフレーム
```

利点：
- **圧縮**: 長い間隔はより良い圧縮を提供
- **アクセス**: 短い間隔は高速なランダムアクセスを可能にする
- **エラー回復**: キーフレームはエラー伝播を制限

### 1.2 差分エンコーディングプロセス

1. **ベース画像選択**: 前のフレームをベース画像として使用
2. **差分検出**: ピクセル値を比較して変化した領域を特定
3. **バウンディングボックス最適化**: 重複領域をマージし矩形を最適化
4. **閾値判定**: 変化が閾値を超えた場合はキーフレームにフォールバック

### 1.3 最適化技術

#### 矩形マージ
```typescript
// 重複する矩形をマージしてオーバーヘッドを削減
const mergedBoxes = mergeOverlapBoundingBox(
  shrinkOverlapBoundingBox(diffBox)
);
```

#### サイズ閾値
```typescript
// 変化が広範囲すぎる場合はキーフレームを使用
if (mergedBoundingBoxes[0].area === currentImage.rect.width * currentImage.rect.height) {
  // クロップではなくマスターファイルとして保存
}
```

## 2. ファイルサイズ管理

### 2.1 チャンク戦略

大きなデータセットは自動的に複数ファイルに分割されます：

```typescript
const FileSizeLimit = 95 * 1024 * 1024; // ファイルあたり95MB

export const compressEIAv1 = async (
  data: RawImageObjV1Cropped[],
  count = 1,
  stepSize = 10,
): Promise<Buffer[]> => {
  // 圧縮サイズに基づく適応分割
  if (compressedPart.length > FileSizeLimit) {
    return compressEIAv1(data, count + 1);
  }
}
```

### 2.2 サイズ推定

異なるシナリオの圧縮率推定を提供：
- **静的コンテンツ**: 0.1-0.2倍（90-80%削減）
- **スライドプレゼンテーション**: 0.2-0.4倍（80-60%削減）  
- **動画コンテンツ**: 0.4-0.8倍（60-20%削減）

## 3. フォーマット互換性

### 3.1 サポートされるテクスチャフォーマット

| フォーマット | バイト/ピクセル | 用途 | 圧縮 |
|-------------|----------------|------|------|
| RGB24       | 3              | 標準画像 | 良好 |
| RGBA32      | 4              | アルファ付き画像 | 良好 |
| DXT1        | 0.5            | テクスチャ圧縮 | 優秀 |

### 3.2 プラットフォーム考慮事項

- **Web**: 幅広い互換性のためRGB24を使用
- **モバイル**: より良いパフォーマンスのためDXT1を検討
- **デスクトップ**: 高品質アプリケーションにはRGBA32

## 4. パフォーマンス特性

### 4.1 圧縮パフォーマンス

スライドプレゼンテーションの典型的な圧縮結果：

```
入力サイズ: 50画像 × 1920×1080 × 3バイト = 約311MB
EIA v1出力: 約20-60MB（80-94%削減）
処理時間: 2-5秒（コンテンツの複雑さに依存）
```

### 4.2 メモリ使用量

- **エンコーディング**: ピークメモリ ≈ 非圧縮サイズの2倍
- **デコーディング**: インクリメンタル、約1フレームバッファが必要
- **ランダムアクセス**: キーフレームはO(1)、差分フレームはO(k)

### 4.3 最適化ガイドライン

#### エンコーダー向け：
- シーケンス順で画像を処理
- 差分検出バッファを再利用
- LZ4圧縮操作をバッチ処理

#### デコーダー向け：
- 差分再構築のためベース画像をキャッシュ
- 大きなファイルにはストリーミング展開を使用
- UIの応答性のためプログレッシブローディングを実装

## 5. エラーハンドリングのベストプラクティス

### 5.1 検証チェックリスト

```typescript
// ヘッダー検証
if (!data.startsWith('EIA^')) {
  throw new Error('無効なEIAヘッダー');
}

// バージョン互換性
if (manifest.v !== 1) {
  throw new Error(`サポートされていないバージョン: ${manifest.v}`);
}

// 境界チェック
if (file.s + file.l > dataSection.length) {
  throw new Error('ファイルがデータセクションを超えています');
}
```

### 5.2 回復戦略

- **破損したマニフェスト**: 既知の構造を使用した部分回復を試行
- **欠損ベースファイル**: 依存するクロップファイルをスキップまたは最近のキーフレームを使用
- **圧縮エラー**: 利用可能な場合は生データにフォールバック

## 6. 統合例

### 6.1 Webアプリケーション

```typescript
// ブラウザでのプログレッシブローディング
async function loadEIASequence(url: string) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  
  const decoder = new EIADecoder(buffer);
  const manifest = decoder.getManifest();
  
  // オンデマンドで画像をロード
  for (let i = 0; i < manifest.i.length; i++) {
    const image = await decoder.getImage(i);
    displayImage(image);
  }
}
```

### 6.2 Node.js処理

```typescript
// バッチ変換
import { compressEIAv1 } from './lib/eia/compressEIAv1';

async function convertSlides(inputFiles: string[]) {
  const selectedFiles = await loadImages(inputFiles);
  const compressed = await selectedFiles2EIAv1RGB24Cropped(selectedFiles);
  
  // 結果を保存
  compressed.forEach((buffer, index) => {
    fs.writeFileSync(`output_${index}.eia`, buffer);
  });
}
```

## 7. 移行ガイド

### 7.1 TextZip v1からの移行

EIA v1は画像シーケンスでより良い圧縮を提供：

| 機能 | TextZip v1 | EIA v1 |
|------|------------|--------|
| コンテナ | ZIP | バイナリ |
| 圧縮 | ファイル単位 | 差分 + LZ4 |
| ランダムアクセス | 良好 | 優秀 |
| サイズ効率 | 良好 | 優秀 |

### 7.2 移行手順

1. **評価**: 既存のTextZipファイルのクロップ可能性を分析
2. **変換**: 提供された移行ツールを使用
3. **検証**: 出力品質と圧縮率を比較
4. **展開**: EIA v1サポートのためクライアントアプリケーションを更新

## 8. デバッグとプロファイリング

### 8.1 診断ツール

```typescript
// 圧縮分析
function analyzeCompression(input: RawImageObjV1[], output: Buffer[]) {
  const inputSize = input.reduce((acc, img) => acc + img.buffer.length, 0);
  const outputSize = output.reduce((acc, buf) => acc + buf.length, 0);
  
  console.log(`圧縮率: ${(outputSize / inputSize * 100).toFixed(1)}%`);
  console.log(`節約容量: ${(inputSize - outputSize) / 1024 / 1024} MB`);
}
```

### 8.2 パフォーマンス監視

主要メトリクスを追跡：
- 画像あたりの**エンコーディング時間**
- コンテンツタイプ別の**圧縮率**  
- **メモリ使用量**のピーク
- **差分効率**（クロップ対キーフレームの比率）

## 9. 将来の考慮事項

### 9.1 潜在的な拡張

- **マルチ解像度**: 異なる品質レベルのサポート
- **音声同期**: プレゼンテーションのタイミング情報
- **メタデータ**: 拡張アノテーションサポート
- **暗号化**: オプションのデータ保護

### 9.2 後方互換性

将来のバージョンはv1との互換性を維持すべきです（SHOULD）：
- コア構造を保持
- 機能を置き換えるのではなく拡張
- 明確な移行パスを提供

## 付録: リファレンス実装

リファレンス実装はソースコードで利用可能です：

- **エンコーダー**: `src/lib/eia/compressEIAv1.ts`
- **型定義**: `src/_types/eia/v1.ts`
- **統合**: `src/lib/selectedFiles2EIA/selectedFiles2EIAv1RGB24Cropped.ts`
- **クロップロジック**: `src/lib/crop/cropImages.ts`

# EIA v1 Implementation Guide

## Overview

This document provides implementation guidance for the EIA v1 format, including encoding strategies, optimization techniques, and common use cases.

## 1. Encoding Strategy

### 1.1 Keyframe Selection

The encoder SHOULD use a keyframe interval to balance compression efficiency and random access:

```typescript
const keyframeInterval = 10; // Every 10th frame is a keyframe
```

Benefits:
- **Compression**: Longer intervals provide better compression
- **Access**: Shorter intervals enable faster random access
- **Error Recovery**: Keyframes limit error propagation

### 1.2 Differential Encoding Process

1. **Base Image Selection**: Use the previous frame as the base image
2. **Difference Detection**: Compare pixel values to identify changed regions
3. **Bounding Box Optimization**: Merge overlapping regions and optimize rectangles
4. **Threshold Decision**: Fall back to keyframe if changes exceed threshold

### 1.3 Optimization Techniques

#### Rectangle Merging
```typescript
// Merge overlapping rectangles to reduce overhead
const mergedBoxes = mergeOverlapBoundingBox(
  shrinkOverlapBoundingBox(diffBox)
);
```

#### Size Threshold
```typescript
// Use keyframe if changes are too extensive
if (mergedBoundingBoxes[0].area === currentImage.rect.width * currentImage.rect.height) {
  // Store as master file instead of cropped
}
```

## 2. File Size Management

### 2.1 Chunking Strategy

Large datasets are automatically split into multiple files:

```typescript
const FileSizeLimit = 95 * 1024 * 1024; // 95MB per file

export const compressEIAv1 = async (
  data: RawImageObjV1Cropped[],
  count = 1,
  stepSize = 10,
): Promise<Buffer[]> => {
  // Adaptive splitting based on compressed size
  // `compressedPart` would be the result of compressing a slice of data, e.g., from `await compressEIAv1Part(dataSlice);`
  if (compressedPart.length > FileSizeLimit) {
    // This implies retrying the compression for the whole dataset with more, smaller parts.
    return compressEIAv1(data, count + 1);
  }
}
```

### 2.2 Size Estimation

Provide compression ratio estimates for different scenarios:
- **Static content**: 0.1-0.2 ratio (90-80% reduction)
- **Slide presentations**: 0.2-0.4 ratio (80-60% reduction)  
- **Video content**: 0.4-0.8 ratio (60-20% reduction)

## 3. Format Compatibility

### 3.1 Supported Texture Formats

| Format | Bytes/Pixel | Use Case | Compression |
|--------|-------------|----------|-------------|
| RGB24  | 3          | Standard images | Good |
| RGBA32 | 4          | Images with alpha | Good |
| DXT1   | 0.5        | Texture compression | Excellent |

### 3.2 Platform Considerations

- **Web**: Use RGB24 for broad compatibility
- **Mobile**: Consider DXT1 for better performance
- **Desktop**: RGBA32 for high-quality applications

## 4. Performance Characteristics

### 4.1 Compression Performance

Typical compression results for slide presentations:

```
Input Size: 50 images × 1920×1080 × 3 bytes = ~311MB
EIA v1 Output: ~20-60MB (80-94% reduction)
Processing Time: 2-5 seconds (depends on content complexity)
```

### 4.2 Memory Usage

- **Encoding**: Peak memory ≈ 2× uncompressed size
- **Decoding**: Incremental, ~1 frame buffer needed
- **Random Access**: O(1) for keyframes, O(k) for differential frames

### 4.3 Optimization Guidelines

#### For Encoders:
- Process images in sequence order
- Reuse difference detection buffers
- Batch LZ4 compression operations

#### For Decoders:
- Cache base images for differential reconstruction
- Use streaming decompression for large files
- Implement progressive loading for UI responsiveness

## 5. Error Handling Best Practices

### 5.1 Validation Checklist

```typescript
// Header validation
if (!data.startsWith('EIA^')) {
  throw new Error('Invalid EIA header');
}

// Version compatibility
if (manifest.v !== 1) {
  throw new Error(`Unsupported version: ${manifest.v}`);
}

// Bounds checking
if (file.s + file.l > dataSection.length) {
  throw new Error('File extends beyond data section');
}
```

### 5.2 Recovery Strategies

- **Corrupted Manifest**: Attempt partial recovery using known structure
- **Missing Base File**: Skip dependent cropped files or use nearest keyframe
- **Compression Errors**: Fall back to raw data if available

## 6. Integration Examples

### 6.1 Web Application

```typescript
// Progressive loading in browser
async function loadEIASequence(url: string) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  
  const decoder = new EIADecoder(buffer);
  const manifest = decoder.getManifest();
  
  // Load images on demand
  for (let i = 0; i < manifest.i.length; i++) {
    const image = await decoder.getImage(i);
    displayImage(image);
  }
}
```

### 6.2 Node.js Processing

```typescript
// Batch conversion
import { compressEIAv1 } from './lib/eia/compressEIAv1';

async function convertSlides(inputFiles: string[]) {
  const selectedFiles = await loadImages(inputFiles);
  const compressed = await selectedFiles2EIAv1RGB24Cropped(selectedFiles);
  
  // Save results
  compressed.forEach((buffer, index) => {
    fs.writeFileSync(`output_${index}.eia`, buffer);
  });
}
```

## 7. Migration Guide

### 7.1 From TextZip v1

EIA v1 provides better compression for image sequences:

| Feature | TextZip v1 | EIA v1 |
|---------|------------|--------|
| Container | ZIP | Binary |
| Compression | Per-file | Differential + LZ4 |
| Random Access | Good | Excellent |
| Size Efficiency | Good | Excellent |

### 7.2 Migration Steps

1. **Assessment**: Analyze existing TextZip files for cropping potential
2. **Conversion**: Use provided migration tools
3. **Validation**: Compare output quality and compression ratios
4. **Deployment**: Update client applications to support EIA v1

## 8. Debugging and Profiling

### 8.1 Diagnostic Tools

```typescript
// Compression analysis
function analyzeCompression(input: RawImageObjV1[], output: Buffer[]) {
  const inputSize = input.reduce((acc, img) => acc + img.buffer.length, 0);
  const outputSize = output.reduce((acc, buf) => acc + buf.length, 0);
  
  console.log(`Compression ratio: ${(outputSize / inputSize * 100).toFixed(1)}%`);
  console.log(`Space saved: ${(inputSize - outputSize) / 1024 / 1024} MB`);
}
```

### 8.2 Performance Monitoring

Track key metrics:
- **Encoding time** per image
- **Compression ratio** by content type  
- **Memory usage** peaks
- **Differential efficiency** (ratio of cropped vs. keyframes)

## 9. Future Considerations

### 9.1 Potential Extensions

- **Metadata**: Extended annotation support
- **Encryption**: Optional data protection

### 9.2 Backward Compatibility

Future versions SHOULD maintain compatibility with v1:
- Preserve core structure
- Extend rather than replace features
- Provide clear migration paths

## Appendix: Reference Implementation

The reference implementation is available in the source code:

- **Encoder**: `src/lib/eia/compressEIAv1.ts`
- **Type Definitions**: `src/_types/eia/v1.ts`
- **Integration**: `src/lib/selectedFiles2EIA/selectedFiles2EIAv1RGB24Cropped.ts`
- **Cropping Logic**: `src/lib/crop/cropImages.ts`

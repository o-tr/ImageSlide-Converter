# EIA (Efficient Image Archive) Version 1 Specification

## Abstract

This document defines the EIA (Efficient Image Archive) Version 1 format, a binary container format designed for efficient storage and transmission of image sequences with cropping optimization. EIA v1 provides significant compression advantages for image sequences with minimal differences between frames through differential encoding and LZ4 compression.

## 1. Introduction

### 1.1 Purpose

The EIA v1 format is designed to efficiently store sequences of images, particularly those with minimal frame-to-frame differences such as slide presentations or UI screenshots. The format achieves compression through:

- Differential encoding of cropped regions
- LZ4 compression of image data
- Optimized binary structure for fast access

### 1.2 Terminology

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119.

### 1.3 Format Identifier

EIA v1 files are identified by:
- Type identifier: `"eia"`
- Version number: `1`
- Compression method: `"lz4"`

## 2. File Structure

### 2.1 Overall Structure

An EIA v1 file consists of:

```
[Header][Manifest][Compressed Data Blocks...]
```

### 2.2 Header Format

The file header MUST begin with the literal string `"EIA^"` followed by the JSON-encoded manifest and terminated with `"$"`:

```
EIA^{manifest_json}$
```

Where `{manifest_json}` is a JSON-encoded EIAManifestV1 object.

### 2.3 Manifest Structure

The manifest is a JSON object with the following required fields:

```typescript
type EIAManifestV1 = {
  t: "eia";           // Type identifier (MUST be "eia")
  c: "lz4";           // Compression method (MUST be "lz4")
  v: 1;               // Version number (MUST be 1)
  f: string[];        // Features array
  e: EIAExtension[];  // Extensions array
  i: EIAFileV1[];     // Items array
}
```

#### 2.3.1 Features Array

The features array (`f`) MUST contain strings in the format `"Format:{format_name}"` where `{format_name}` is one of the supported texture formats used in the archive.

#### 2.3.2 Extensions Array

The extensions array (`e`) MUST contain supported extension identifiers. Currently supported extensions:
- `"note"`: Text annotations for individual items

#### 2.3.3 Items Array

The items array (`i`) MUST contain EIAFileV1 objects describing each image in the archive.

## 3. File Types

### 3.1 Master Files

Master files contain complete image data without dependencies:

```typescript
type EIAFileV1Master = {
  t: "m";                        // Type (MUST be "m")
  n: string;                     // Name/identifier
  f: TTextureFormat;             // Format identifier
  w: number;                     // Width in pixels
  h: number;                     // Height in pixels
  s: number;                     // Start offset in data section
  l: number;                     // Compressed data length
  u: number;                     // Uncompressed data size
  e?: EIAExtensionObject;        // Optional extensions
}
```

### 3.2 Cropped Files

Cropped files contain differential data referencing a base image:

```typescript
type EIAFileV1Cropped = {
  t: "c";                        // Type (MUST be "c")
  b: string;                     // Base file name reference
  n: string;                     // Name/identifier
  f: TTextureFormat;             // Format identifier
  w: number;                     // Original width in pixels
  h: number;                     // Original height in pixels
  s: number;                     // Start offset in data section
  l: number;                     // Compressed data length
  u: number;                     // Uncompressed data size
  e?: EIAExtensionObject;        // Optional extensions
  r: EIAFileV1CroppedPart[];     // Rectangles array
}
```

#### 3.2.1 Cropped Parts

Each cropped part describes a rectangular region that differs from the base image:

```typescript
type EIAFileV1CroppedPart = {
  x: number;          // X coordinate in base image
  y: number;          // Y coordinate in base image
  w: number;          // Width in pixels
  h: number;          // Height in pixels
  s: number;          // Start offset within file's data
  l: number;          // Length in bytes
}
```

## 4. Data Section

### 4.1 Structure

The data section immediately follows the header and contains LZ4-compressed image data blocks. Each file's data is stored as a single compressed block.

### 4.2 Compression

- All image data MUST be compressed using LZ4
- Each file's data is compressed independently
- Cropped files contain concatenated rectangle data before compression

### 4.3 Data Layout

For master files:
- The compressed block contains the complete image data

For cropped files:
- Rectangle data is concatenated in the order specified in the `r` array
- The concatenated data is then LZ4-compressed as a single block
- Offsets in `EIAFileV1CroppedPart.s` refer to positions in the uncompressed concatenated data

## 5. Supported Formats

### 5.1 Texture Formats

Currently supported texture formats:
- `"RGB24"`: 24-bit RGB (3 bytes per pixel)
- `"RGBA32"`: 32-bit RGBA (4 bytes per pixel)

### 5.2 Format Requirements

- Pixel data MUST be stored in the specified format
- RGB24 format MUST use 8 bits per channel in RGB order
- RGBA32 format MUST use 8 bits per channel in RGBA order

## 6. Extensions

### 6.1 Extension Object

Extensions are stored in an optional `e` field:

```typescript
type EIAExtensionObject = {
  note?: string;                 // Optional text annotation
  [key: string]: string;         // Additional extensions
}
```

### 6.2 Note Extension

The `note` extension MAY contain UTF-8 encoded text annotations for the image.

## 7. Processing Guidelines

### 7.1 Encoding

Encoders SHOULD:
- Use differential encoding for sequences with minimal changes
- Set keyframe intervals to balance compression and random access
- Optimize rectangle placement to minimize redundant data

### 7.2 Decoding

Decoders MUST:
- Validate the header format before processing
- Check version compatibility
- Decompress data using LZ4
- Reconstruct cropped images by applying rectangles to base images

### 7.3 Error Handling

Implementations MUST handle:
- Invalid header formats
- Unsupported versions
- Compression errors
- Missing base file references

## 8. Security Considerations

### 8.1 Input Validation

Implementations MUST validate:
- Header format and length
- JSON manifest structure
- Offset and length values to prevent buffer overflows
- Compression ratios to detect compression bombs

### 8.2 Resource Limits

Implementations SHOULD enforce reasonable limits on:
- Manifest size
- Number of files
- Image dimensions
- Uncompressed data sizes

## 9. Examples

### 9.1 Minimal Master File

```json
{
  "t": "eia",
  "c": "lz4",
  "v": 1,
  "f": ["Format:RGB24"],
  "e": ["note"],
  "i": [{
    "t": "m",
    "n": "0",
    "f": "RGB24",
    "w": 1920,
    "h": 1080,
    "s": 0,
    "l": 256000,
    "u": 6220800
  }]
}
```

### 9.2 Cropped File with Base Reference

```json
{
  "t": "eia",
  "c": "lz4", 
  "v": 1,
  "f": ["Format:RGB24"],
  "e": ["note"],
  "i": [{
    "t": "c",
    "b": "0",
    "n": "1",
    "f": "RGB24",
    "w": 1920,
    "h": 1080,
    "s": 0,
    "l": 5000,
    "u": 15000,
    "r": [{
      "x": 100,
      "y": 200,
      "w": 50,
      "h": 100,
      "s": 0,
      "l": 15000
    }]
  }]
}
```

## 10. References

- RFC 2119: Key words for use in RFCs to Indicate Requirement Levels
- LZ4 Compression Algorithm
- S3TC/DXT1 Texture Compression Specification

## Appendix A: Type Definitions

See the complete TypeScript type definitions in the source code:
- `src/_types/eia/v1.ts`: Core EIA v1 types
- `src/_types/text-zip/formats.ts`: Texture format definitions

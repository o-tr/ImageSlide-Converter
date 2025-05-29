# EIA v1 Documentation

This directory contains the complete documentation for the EIA (Efficient Image Archive) Version 1 format.

**言語 / Languages:**
- [English](./README.md) (Current)
- [日本語](../README.md)

## Documents

### [EIA v1 Specification](./eia-v1-specification.md)
The formal specification document defining the EIA v1 format in RFC 2119 compliant language. This document covers:

- **File Structure**: Binary format layout and manifest structure
- **Data Types**: Master files, cropped files, and their relationships
- **Compression**: LZ4 compression methodology and data organization
- **Extensions**: Support for metadata and future extensibility
- **Security**: Validation requirements and security considerations

**Target Audience**: Format implementers, decoder/encoder developers, specification reviewers

### [EIA v1 Implementation Guide](./eia-v1-implementation-guide.md)
Practical guidance for implementing EIA v1 encoders and decoders. This document includes:

- **Encoding Strategies**: Keyframe selection, differential encoding, optimization techniques
- **Performance**: Compression ratios, memory usage, processing guidelines
- **Integration**: Web and Node.js examples, migration from other formats
- **Debugging**: Diagnostic tools, performance monitoring, troubleshooting

**Target Audience**: Software developers, application integrators, performance engineers

## Quick Reference

### Key Features
- **Differential Encoding**: Efficient storage of image sequences with minimal changes
- **LZ4 Compression**: Fast compression/decompression with good ratios
- **Random Access**: Direct access to any frame without full decompression
- **Multiple Formats**: Support for RGB24, RGBA32, and DXT1 textures
- **Extensible**: Metadata support and room for future enhancements

### File Format Summary
```
File Structure: [Header][Manifest][Data Blocks...]
Header Format:  EIA^{json_manifest}$
Compression:    LZ4 on image data
Extensions:     .eia (recommended)
```

### Typical Use Cases
- **Slide Presentations**: 80-94% size reduction typical
- **UI Screenshots**: Excellent compression for repetitive elements  
- **Animation Sequences**: Efficient differential encoding
- **Documentation**: Step-by-step visual guides

### Performance Characteristics
- **Compression**: 0.2-0.8 ratio depending on content type
- **Speed**: 2-5 seconds for 50 slides @ 1920×1080
- **Memory**: ~2× peak during encoding, streaming decode
- **Access**: O(1) keyframes, O(k) differential frames

## Implementation Status

### Reference Implementation
The reference implementation is available in this codebase:

| Component | Location | Status |
|-----------|----------|---------|
| Encoder | `src/lib/eia/compressEIAv1.ts` | ✅ Complete |
| Type Definitions | `src/_types/eia/v1.ts` | ✅ Complete |
| Cropping Logic | `src/lib/crop/cropImages.ts` | ✅ Complete |
| Integration | `src/lib/selectedFiles2EIA/selectedFiles2EIAv1RGB24Cropped.ts` | ✅ Complete |
| Decoder | - | ⏳ Planned |

### Compatibility Matrix

| Platform | Encoder | Decoder | Notes |
|----------|---------|---------|-------|
| Node.js | ✅ | ⏳ | Reference implementation |
| Browser | ✅ | ⏳ | Via web workers |
| VRChat | ⏳ | ✅ | https://github.com/o-tr/jp.ootr.ImageDeviceController |

## Getting Started

### For Implementers
1. Read the [specification](./eia-v1-specification.md) thoroughly
2. Review the [implementation guide](./eia-v1-implementation-guide.md)
3. Examine the reference implementation in `src/lib/eia/`
4. Test with the provided examples and edge cases

### For Integrators
1. Review the [implementation guide](./eia-v1-implementation-guide.md)
2. Check the integration examples for your platform
3. Consider the performance characteristics for your use case
4. Plan migration strategy if coming from other formats

### For Contributors
1. Understand both specification and implementation
2. Follow the established patterns in the reference code
3. Add tests for new features or edge cases
4. Update documentation for any changes

## Version History

### Version 1.0 (Current)
- Initial specification release
- Support for RGB24, RGBA32, DXT1 formats
- Differential encoding with LZ4 compression
- Note extensions for metadata

### Future Versions (Planned)
- Multi-resolution support
- Audio synchronization
- Extended metadata formats
- Performance optimizations

## Contributing

Contributions to the EIA v1 specification and implementation are welcome:

1. **Specification Issues**: Open issues for clarifications or improvements
2. **Implementation Bugs**: Report issues with the reference implementation  
3. **Performance**: Suggest optimizations or alternative algorithms
4. **Extensions**: Propose new features while maintaining compatibility

## License

This specification and implementation are available under the project license. See the main project README for details.

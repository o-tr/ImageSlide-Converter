import { BASIS_FORMAT, BasisFile, initializeBasis } from "@/lib/basis";

export const basis2dxt1 = (data: Uint8Array): Uint8Array => {
	initializeBasis();
	const basisFile = new BasisFile(data);

	if (!basisFile.startTranscoding()) {
		throw new Error("Failed to start transcoding");
	}

	const dstSize = basisFile.getImageTranscodedSizeInBytes(
		0,
		0,
		BASIS_FORMAT.cTFBC1,
	);
	const dst = new Uint8Array(dstSize);
	if (!basisFile.transcodeImage(dst, 0, 0, BASIS_FORMAT.cTFBC1, 0, 0)) {
		basisFile.close();
		basisFile.delete();
		throw new Error("Failed to transcode image");
	}

	basisFile.close();
	basisFile.delete();

	return dst;
};

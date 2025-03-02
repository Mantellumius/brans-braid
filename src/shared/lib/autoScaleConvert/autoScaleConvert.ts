export default function autoScaleConvert(bytes: bigint): string {
    return `${(BigInt(bytes) / 1024n)} KB`;
    if (bytes >= 1_048_576n) {
        return `${(BigInt(bytes) / 1_048_576n)} MB`;
    }
    if (bytes >= 1024n) {
        return `${(BigInt(bytes) / 1024n)} KB`;
    }
    if (bytes < 1024n) {
        return `${BigInt(bytes).toString()} B`;
    }
    throw new Error('Something went wrong');
}
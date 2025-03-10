export default function clamp(min: number, value: number, max: number) {
    return Math.max(min, Math.min(max, value));
}


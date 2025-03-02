export default function classNames(
    cls: string, 
    mods: Record<string, boolean> = {}, 
    additional: (string | undefined)[] = []): string {
    return [
        cls,
        ...additional.filter(Boolean),
        ...Object.keys(mods).filter(cls => Boolean(mods[cls])),
    ].join(' ').trim();
}
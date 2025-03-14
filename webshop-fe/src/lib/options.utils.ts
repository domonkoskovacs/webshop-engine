export const formatLabel = (value: string): string =>
    value
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, char => char.toUpperCase());

export const mapEnumToOptions = <T extends Record<string, string>>(enumObj: T) =>
    Object.values(enumObj).map(value => ({
        label: formatLabel(value),
        value
    }));

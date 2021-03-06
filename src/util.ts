export const parseCollectionName = (name: string | undefined): string => {
    return name ? capitalize(name).replaceAll('_', ' ') : "";
}

export const capitalize = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

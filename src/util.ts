export const parseCollectionName = (name: String): String => {
    return capitalizeFirstLetter(name).replaceAll('_', ' ')
}

export const capitalizeFirstLetter = (string: String): String => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
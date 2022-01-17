export const parseCollectionName = (name: String): String => {
    return capitalizeFirstLetter(name).replaceAll('_', ' ')
}

export const capitalize = (string: String): String => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
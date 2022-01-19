export const parseCollectionName = (name: string): string => {
    return capitalize(name).replaceAll('_', ' ')
}

export const capitalize = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const myError = () => {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject("i am a bad error");
      });
    });
  };
module.exports = {
  removeDuplicates: (arr: []): string[] => {
    return Array.from(new Set(arr));
  },
  GetTags: (
    tags: string,
    name: string,
    category: string,
    description: string
  ) => {
    const mergedString: string =
      tags + " " + name + " " + category + " " + description;
    const myArray: string[] = mergedString.split(" ");

    return Array.from(new Set(myArray));
  },
};

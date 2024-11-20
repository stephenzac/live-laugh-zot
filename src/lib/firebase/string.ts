export const titleCase = (name: string) => {
  const splitName = name.split(" ");
  let formattedName = "";
  const length = splitName.length;

  for (let i = 0; i < length - 1; i++) {
    formattedName += splitName[i].toLowerCase() + "-";
  }
  formattedName += splitName[length - 1].toLowerCase();

  return formattedName;
};

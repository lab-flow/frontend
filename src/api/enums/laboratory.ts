export enum Laboratory {
  LGM = "LGM",
  LG = "LG",
}

export const getLaboratoryName = (role: Laboratory | string) => {
  switch (role) {
    case Laboratory.LGM:
      return "LGM";
    case Laboratory.LG:
      return "LG";
    default:
      return "";
  }
};

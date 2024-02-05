export enum REAGENT_REQUEST_STATUS {
  AWAITING_APPROVAL = "AA", // default
  APPROVED = "AP",
  REJECTED = "RE",
}

export const getReagentRequestStatusName = (
  requestStatus: REAGENT_REQUEST_STATUS | string,
) => {
  switch (requestStatus) {
    case REAGENT_REQUEST_STATUS.AWAITING_APPROVAL:
      return "Oczekujący na zatwierdzenie";
    case REAGENT_REQUEST_STATUS.APPROVED:
      return "Zatwierdzony";
    case REAGENT_REQUEST_STATUS.REJECTED:
      return "Odrzucony";
  }
};

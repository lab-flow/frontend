export enum ROLE {
  LAB_MANAGER = "LM",
  PROCEDURE_MANAGER = "PM",
  LAB_WORKER = "LW",
}

export const ADMIN_ROLE = "AM"; // only on frontend
export const ANY_ROLE_LIST = [
  ROLE.LAB_MANAGER,
  ROLE.PROCEDURE_MANAGER,
  ROLE.LAB_WORKER,
  ADMIN_ROLE,
];
export const getRoleName = (role: ROLE | string) => {
  switch (role) {
    case ROLE.LAB_MANAGER:
      return "Kierownik laboratorium";
    case ROLE.PROCEDURE_MANAGER:
      return "Kierownik projektu (procedury)";
    case ROLE.LAB_WORKER:
      return "Pracownik laboratorium";
    default:
      return "";
  }
};

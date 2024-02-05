export enum HazardGroup {
  PHY = "PHY",
  HEA = "HEA",
  ENV = "ENV",
}

export const getHazardGroupName = (role: HazardGroup | string) => {
  switch (role) {
    case HazardGroup.PHY:
      return "Zagrożenia fizyczne";
    case HazardGroup.HEA:
      return "Zagrożenia dla zdrowia";
    case HazardGroup.ENV:
      return "Zagrożenia dla środowiska";
    default:
      return role.toString();
  }
};

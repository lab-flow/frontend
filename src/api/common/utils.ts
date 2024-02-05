export function objectToQueryString(
  obj: { [key: string]: string[] | string | undefined } | undefined,
) {
  if (!obj) {
    return "";
  }
  const queryParams = [];
  for (const key in obj) {
    if (Array.isArray(obj[key])) {
      (obj[key] as Array<string>).forEach((item: string) => {
        !!item && queryParams.push(key + "=" + item);
      });
      continue;
    } else if (obj[key] === undefined || obj[key] === "") {
      continue;
    }
    queryParams.push(key + "=" + obj[key]);
  }
  return queryParams.length ? queryParams.join("&") : "";
}

export function getCurrentDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

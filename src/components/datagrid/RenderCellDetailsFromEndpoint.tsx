import { GridCellDetailsFromEndpoint } from "./GridCellDetailsFromEndpoint.tsx";
import { AxiosResponse } from "axios";

export function renderCellDetailsFromEndpoint(params: {
  getDetails: (id: number) => Promise<AxiosResponse> | never;
  value: { id: number; repr: string };
  colDef: { computedWidth: number };
}) {
  return params.value?.id ? (
    <GridCellDetailsFromEndpoint
      value={params.value?.repr}
      getDetails={() =>
        params.value?.id ? params.getDetails(params.value.id) : Promise.reject()
      }
      width={params.colDef.computedWidth}
    />
  ) : (
    params.value?.repr
  );
}

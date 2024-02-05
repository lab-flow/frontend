import "../../api/dataProviders/dataProviders";
import { Names } from "../../api/common/dataNames.ts";
import { renderCellExpand } from "../../components/datagrid/GridCellExpand.tsx";
import { Button } from "@mui/material";
import { ADMIN_ROLE } from "../../api/enums/userRoles";
import { PrivateComponent } from "../../components/PrivateComponent";
import { GridValidRowModel } from "@mui/x-data-grid/models/gridRows";

export const historyColumns: GridValidRowModel[] = [
  {
    field: "id",
    headerName: Names.history_id,
    width: 100,
    renderCell: renderCellExpand,
    sortable: false,
  },
  {
    field: "history_change_reason",
    headerName: Names.history_change_reason,
    width: 150,
    renderCell: renderCellExpand,
    sortable: false,
  },
  {
    field: "history_date",
    headerName: Names.history_date,
    width: 170,
    renderCell: renderCellExpand,
    sortable: false,
  },
  {
    field: "history_type",
    headerName: Names.history_type,
    width: 140,
    renderCell: renderCellExpand,
    sortable: false,
  },
  {
    field: "history_user",
    headerName: Names.history_user,
    width: 140,
    renderCell: renderCellExpand,
    sortable: false,
  },
];

export const showHistoryButton = (
  navigate: (endpoint: string) => void,
  endpoint: string,
) => {
  return (
    <PrivateComponent
      roles={[ADMIN_ROLE]}
      component={() => (
        <Button
          onClick={() => {
            navigate(`/${endpoint}/history`);
          }}
        >
          {Names.show_history}
        </Button>
      )}
    />
  );
};

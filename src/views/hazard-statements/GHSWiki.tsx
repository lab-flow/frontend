import { GridColDef } from "@mui/x-data-grid";

import DashboardCard from "../../components/basic/DashboardCard";
import "../../api/dataProviders/dataProviders";
import { Names } from "../../api/common/dataNames.ts";
import DataGridPagination from "../../components/datagrid/DataGridPagination.tsx";
import { renderCellExpand } from "../../components/datagrid/GridCellExpand.tsx";
import { DataProviders } from "../../api/dataProviders/DataProvider.ts";
import { GridValidRowModel } from "@mui/x-data-grid/models/gridRows";

function GHSWiki() {
  const columns: GridValidRowModel[] = [
    {
      field: "clp_classification",
      headerName: Names.clp_classification,
      width: 100,
      renderCell: renderCellExpand,
      sortable: false,
    },
    {
      field: "classification",
      headerName: Names.phrase,
      width: 180,
      renderCell: renderCellExpand,
      sortable: false,
    },
    {
      field: "pictogram",
      headerName: Names.pictogram,
      width: 90,
      renderCell: (params: { row: { pictogram: string } }) =>
        params.row.pictogram ? (
          <img
            src={params.row.pictogram}
            alt={"pictogram"}
            style={{
              width: "30px",
              height: "30px",
              boxShadow: "0 0 1px rgba(0, 0, 0, 0.5)",
            }}
          />
        ) : null,
      sortable: false,
    },
  ];

  return DashboardCard({
    title: Names.ghs_hazard_statements,
    content: (
      <DataGridPagination
        columns={columns as GridColDef[]}
        query_key="getGHS"
        query_fn={DataProviders.HAZARD_STATEMENTS_GHS.getItemList}
      />
    ),
  });
}

export default GHSWiki;

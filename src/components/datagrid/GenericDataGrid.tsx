import { DataGrid, GridToolbar, plPL } from "@mui/x-data-grid";
import { Names } from "../../api/common/dataNames";

interface GenericDataGridProps {
  data: Array<object>;
  isLoading: boolean;
  getRowId?: (row: object) => string;
}

function GenericDataGrid(props: GenericDataGridProps) {
  const columns =
    props.data &&
    Object.keys(props.data[0])?.map((key) => {
      return {
        field: key,
        headerName: Names[key as keyof typeof Names] || key,
        width: 300,
      };
    });

  return (
    <DataGrid
      autoHeight
      rows={props.data}
      rowsPerPageOptions={[10, 30, 50, 70, 100]}
      pagination
      columns={columns}
      getRowId={props.getRowId}
      components={{
        Toolbar: GridToolbar,
      }}
      localeText={plPL.components.MuiDataGrid.defaultProps.localeText}
    />
  );
}

export default GenericDataGrid;

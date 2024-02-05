import {
  DataGrid,
  GridRowClassNameParams,
  GridRowIdGetter,
  GridSortModel,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  plPL,
} from "@mui/x-data-grid";
import { ReactNode, useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Names } from "../../api/common/dataNames";
import { Box, Card, Chip, Typography } from "@mui/material";
import { APIAlertContext } from "../../providers/alertProvider";
import SearchBar from "../basic/SearchBar";
import { objectToQueryString } from "../../api/common/utils";
import { AxiosResponse } from "axios";
import type { GridColumns } from "@mui/x-data-grid/models/colDef/gridColDef";
import { GetWithPaginationResponse } from "../../api/interfaces/getWithPaginationResponse.ts";
import BackButton from "../basic/BackButton.tsx";

interface DataGridPaginationProps {
  beforeDataGrid?: ReactNode;
  columns: GridColumns;
  disableSearchBar?: boolean;
  getCellClassName?: never;
  getRowId?: GridRowIdGetter<any> | undefined;
  logsPage?: boolean;
  historyData?: boolean;
  minHeight?: string;
  noDataContent?: ReactNode;
  pageSize?: number;
  queryParams?: { [key: string]: string[] | string | undefined };
  query_fn: (
    limit?: number,
    page?: number,
    noPagination?: boolean,
    additionalParams?: string,
  ) => Promise<AxiosResponse | GetWithPaginationResponse>;
  query_key: string;
  sortType?: string;
  rowsPerPageOptions?: number[];
  columnVisibilityModel?: any;
  onColumnVisibilityModelChange?: any;
}

function Toolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
    </GridToolbarContainer>
  );
}

function mapSortOptionValue(event: GridSortModel | undefined) {
  if (!event || !Array.isArray(event) || event.length === 0) return null;
  else {
    const fieldValue = event[0]?.field;
    const mappedFieldValue = fieldValue == "pk" ? "id" : fieldValue;
    const sortSign = event[0]?.sort === "asc" ? "" : "-";
    return sortSign + mappedFieldValue;
  }
}

function DataGridPagination(props: DataGridPaginationProps) {
  const { alert } = useContext(APIAlertContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentQueryParams, setCurrentQueryParams] = useState(
    objectToQueryString(props.queryParams),
  );
  const [sortOption, setSortOption] = useState<GridSortModel>();
  const [pageState, setPageState] = useState({
    page: 1,
    pageSize: props.pageSize || 100,
  });

  const { data, isFetching, isLoading } = useQuery(
    [
      props.query_key,
      currentQueryParams,
      alert,
      sortOption,
      pageState.page,
      pageState.pageSize,
    ],
    () =>
      props.query_fn(
        pageState.pageSize,
        pageState.page - 1,
        false,
        currentQueryParams,
      ),
  );

  useEffect(() => {
    const newQueryParams = {
      ...props.queryParams,
      search: searchTerm.toString(),
      ordering: mapSortOptionValue(sortOption)?.toString(),
    };
    setCurrentQueryParams(objectToQueryString(newQueryParams));
  }, [props.queryParams, searchTerm, sortOption]);

  const chipsVisible = {
    is_validated_by_admin: (data as GetWithPaginationResponse)?.results?.some(
      (dict) => "is_validated_by_admin" in dict,
    ),
  };

  const customNoData =
    props.noDataContent &&
    !isLoading &&
    (data as GetWithPaginationResponse)?.results?.length === 0;

  return customNoData ? (
    props.noDataContent
  ) : (
    <>
      {!props.logsPage && props.historyData && (
        <>
          <BackButton />
          <Box sx={{ m: 2 }} />
        </>
      )}
      <Box
        sx={{
          "& .not-verified-by-admin": {
            backgroundColor: "rgba(255,239,116,0.82)",
            color: "#868686",
            border: "none",
          },
        }}
      >
        {chipsVisible.is_validated_by_admin && (
          <Card variant="outlined" sx={{ padding: "10px" }}>
            <Typography>{Names.legend}</Typography>
            <Box sx={{ m: 1 }} />
            <Chip
              label={Names.not_verified}
              className="not-verified-by-admin"
            />
          </Card>
        )}
        <Box sx={{ m: 2 }} />
        {!props.disableSearchBar && (
          <SearchBar handleSearchChange={(value) => setSearchTerm(value)} />
        )}
        <Box sx={{ m: 2 }} />
        {props.beforeDataGrid}
        <DataGrid
          components={{
            Toolbar: Toolbar,
          }}
          localeText={plPL.components.MuiDataGrid.defaultProps.localeText}
          columnBuffer={2}
          columnThreshold={2}
          rowBuffer={pageState.pageSize}
          rowThreshold={pageState.pageSize}
          getRowHeight={() => "auto"}
          rows={(data as GetWithPaginationResponse)?.results || []}
          rowCount={(data as GetWithPaginationResponse)?.count || 0}
          loading={isFetching || isLoading}
          rowsPerPageOptions={[10, 30, 50, 70, 100]}
          disableColumnMenu
          pagination
          page={pageState.page - 1}
          pageSize={pageState.pageSize}
          paginationMode="server"
          onPageChange={(newPage) => {
            setPageState((old) => ({ ...old, page: newPage + 1 }));
          }}
          onPageSizeChange={(newPageSize) => {
            setPageState((old) => ({ ...old, pageSize: newPageSize }));
          }}
          {...props.columns}
          getCellClassName={props.getCellClassName}
          getRowClassName={(params: GridRowClassNameParams) => {
            return params.row.is_validated_by_admin === false
              ? "not-verified-by-admin"
              : "";
          }}
          sx={{ minHeight: props.minHeight || "65vh" }}
          sortingMode="server"
          onSortModelChange={(e) => setSortOption(e)}
          getRowId={props.getRowId}
          {...props}
        />
      </Box>
    </>
  );
}

export default DataGridPagination;

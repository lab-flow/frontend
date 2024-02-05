import { GridColDef } from "@mui/x-data-grid";

import DashboardCard from "../../components/basic/DashboardCard";
import "../../api/dataProviders/dataProviders";
import { Names } from "../../api/common/dataNames.ts";
import DataGridPagination from "../../components/datagrid/DataGridPagination.tsx";
import { renderCellExpand } from "../../components/datagrid/GridCellExpand.tsx";
import CustomMenu from "../../components/basic/CustomMenu";
import { useMutation } from "react-query";
import {
  DataProviders,
  getLogs,
} from "../../api/dataProviders/DataProvider.ts";
import NewItemButton from "../../components/basic/NewItemButton";
import * as React from "react";
import { useContext } from "react";
import { APIAlertContext } from "../../providers/alertProvider";
import { ADMIN_ROLE } from "../../api/enums/userRoles";
import { authenticationService } from "../../services/authenticationService";
import { historyColumns, showHistoryButton } from "../history/History";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CustomDialog from "../../components/basic/CustomDialog";
import { HazardStatementsInterface } from "../../api/interfaces/hazardStatements.ts";
import { GridValidRowModel } from "@mui/x-data-grid/models/gridRows";

function HazardStatements(props: { history: boolean; logsPage?: boolean }) {
  const navigate = useNavigate();
  const { addAlert } = useContext(APIAlertContext);

  const { mutate: deleteHazardMutate } = useMutation(
    DataProviders.HAZARD_STATEMENTS.deleteItem,
    {
      onSuccess: () => {
        addAlert(Names.removed, "success");
      },
    },
  );
  const [itemToDelete, setItemToDelete] = React.useState<number>();

  const { currentUserRoles } = authenticationService;
  const adminActions = currentUserRoles.includes(ADMIN_ROLE)
    ? (params: { row: HazardStatementsInterface }) => [
        {
          name: "Edytuj",
          handler: () => {
            navigate("/hazards/" + params.row.id + "/edit");
          },
        },
        {
          name: "Usuń",
          handler: () => {
            setItemToDelete(params.row.id);
          },
        },
      ]
    : () => [];

  const actions = (params: { row: HazardStatementsInterface }) =>
    [...adminActions(params)].filter((item) => item);

  const columns: GridValidRowModel[] = [
    ...(props.history ? historyColumns : []),
    !props.history
      ? {
          field: "id",
          headerName: Names.id,
          width: 100,
          renderCell: renderCellExpand,
          sortable: true,
        }
      : { field: "pk", headerName: Names.object_id, width: 100 },
    {
      field: "code",
      headerName: Names.code,
      width: 100,
      renderCell: renderCellExpand,
      sortable: true,
    },
    {
      field: "phrase",
      headerName: Names.phrase,
      width: 180,
      renderCell: renderCellExpand,
      sortable: true,
    },
    {
      field: "pictogram",
      headerName: Names.pictogram,
      width: 90,
      renderCell: (params: { row: HazardStatementsInterface }) =>
        params.row.pictogram ? (
          <img
            src={params.row.pictogram?.repr}
            alt={params.row.pictogram?.id.toString()}
            style={{
              width: "30px",
              height: "30px",
              boxShadow: "0 0 1px rgba(0, 0, 0, 0.5)",
            }}
          />
        ) : null,
      sortable: false,
    },
    {
      field: "hazard_class",
      headerName: Names.hazard_class,
      width: 170,
      renderCell: renderCellExpand,
      sortable: false,
    },
    {
      field: "hazard_category",
      headerName: Names.hazard_category,
      width: 170,
      renderCell: renderCellExpand,
      sortable: false,
    },
    {
      field: "hazard_and_category_code",
      headerName: Names.hazard_and_category_code,
      width: 200,
      renderCell: renderCellExpand,
      sortable: false,
    },
    {
      field: "signal_word",
      headerName: Names.signal_word,
      width: 170,
      renderCell: renderCellExpand,
      sortable: false,
    },
    {
      field: "clp_classification",
      headerName: Names.clp_classification,
      width: 140,
      renderCell: (params: { row: HazardStatementsInterface }) =>
        params.row.clp_classification?.repr,
      sortable: false,
    },
    {
      field: "is_usage_record_required",
      headerName: Names.is_usage_record_required,
      width: 150,
      sortable: false,
      type: "boolean",
    },
    ...(!props.history
      ? [
          {
            field: "actions",
            headerName: Names.actions,
            width: 55,
            sortable: false,
            renderCell: (params: { row: HazardStatementsInterface }) => (
              <>
                <CustomMenu items={actions({ row: params.row })} />
              </>
            ),
          },
        ]
      : []),
  ].filter((item) => item);

  return DashboardCard({
    title: (
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        {props.history ? (
          <>
            {Names.change_history} - {Names.hazard_statements}
          </>
        ) : (
          <NewItemButton
            textBefore={Names.hazard_statements}
            href={`/${DataProviders.HAZARD_STATEMENTS.endpoint}/new`}
            roles={[ADMIN_ROLE]}
          />
        )}
        {!props.history &&
          showHistoryButton(navigate, DataProviders.HAZARD_STATEMENTS.endpoint)}
      </Box>
    ),
    content: (
      <>
        <DataGridPagination
          columns={columns as GridColDef[]}
          query_key="getHazardsList"
          query_fn={
            (props.history
              ? getLogs(DataProviders.HAZARD_STATEMENTS)
              : DataProviders.HAZARD_STATEMENTS
            ).getItemList
          }
          logsPage={props.logsPage}
          historyData={props.history}
        />
        <CustomDialog
          open={!!itemToDelete}
          content={
            <Typography>
              {Names.delete_confirmation_description} ID: {itemToDelete}
            </Typography>
          }
          title={Names.delete_confirmation_title}
          setDialogOpen={() => setItemToDelete(undefined)}
          firstButtonHandler={() => {
            deleteHazardMutate({ id: itemToDelete });
            setItemToDelete(undefined);
          }}
          firstButtonLabel={Names.delete}
          secondButtonHandler={() => setItemToDelete(undefined)}
          secondButtonLabel={Names.cancel}
        />
      </>
    ),
  });
}

export default HazardStatements;

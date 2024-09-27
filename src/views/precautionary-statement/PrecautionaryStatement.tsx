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
import { PrecautionaryStatementInterface } from "../../api/interfaces/precautionaryStatement.ts";
import { GridValidRowModel } from "@mui/x-data-grid/models/gridRows";
import { GridColDef } from "@mui/x-data-grid";

function PrecautionaryStatement(props: {
  history: boolean;
  logsPage?: boolean;
}) {
  const navigate = useNavigate();
  const { addAlert } = useContext(APIAlertContext);
  const { mutate: deleteMutate } = useMutation(
    DataProviders.PRECAUTIONARY_STATEMENT.deleteItem,
    {
      onSuccess: () => {
        addAlert(Names.removed, "success");
      },
    },
  );
  const [itemToDelete, setItemToDelete] = React.useState<number>();

  const { currentUserRoles } = authenticationService;
  const adminActions = currentUserRoles.includes(ADMIN_ROLE)
    ? (params: { row: PrecautionaryStatementInterface }) => [
        {
          name: Names.edit,
          handler: () => {
            navigate(
              `/${DataProviders.PRECAUTIONARY_STATEMENT.endpoint}/` +
                params.row.id +
                "/edit",
            );
          },
        },
        {
          name: Names.delete,
          handler: () => {
            setItemToDelete(params.row.id);
          },
        },
      ]
    : () => [];

  const actions = (params: { row: PrecautionaryStatementInterface }) =>
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
      ...(!props.history
        ? [
            {
              field: "actions",
              headerName: Names.actions,
              width: 55,
              sortable: false,
              renderCell: (params: { row: PrecautionaryStatementInterface }) => (
                <>
                  <CustomMenu items={actions({ row: params.row })} />
                </>
              ),
            },
          ]
        : []),
    {
      field: "code",
      headerName: Names.code,
      width: 300,
      renderCell: renderCellExpand,
      sortable: true,
    },
    {
      field: "phrase",
      headerName: Names.phrase,
      width: 300,
      renderCell: renderCellExpand,
      sortable: true,
    },
  ].filter((item) => item);

  return DashboardCard({
    title: (
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        {props.history ? (
          <>
            {Names.change_history} - {Names.precautionary_statements}
          </>
        ) : (
          <NewItemButton
            textBefore={Names.precautionary_statements}
            href={`/${DataProviders.PRECAUTIONARY_STATEMENT.endpoint}/new`}
            roles={[ADMIN_ROLE]}
          />
        )}
        {!props.history &&
          showHistoryButton(
            navigate,
            DataProviders.PRECAUTIONARY_STATEMENT.endpoint,
          )}
      </Box>
    ),
    content: (
      <>
        <DataGridPagination
          columns={columns as GridColDef[]}
          query_key={`${DataProviders.PRECAUTIONARY_STATEMENT.endpoint}all`}
          query_fn={
            (props.history
              ? getLogs(DataProviders.PRECAUTIONARY_STATEMENT)
              : DataProviders.PRECAUTIONARY_STATEMENT
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
            deleteMutate({ id: itemToDelete });
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

export default PrecautionaryStatement;

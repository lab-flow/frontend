import DashboardCard from "../../components/basic/DashboardCard.tsx";
import "../../api/dataProviders/dataProviders.ts";
import { Names } from "../../api/common/dataNames.ts";
import DataGridPagination from "../../components/datagrid/DataGridPagination.tsx";
import { renderCellExpand } from "../../components/datagrid/GridCellExpand.tsx";
import CustomMenu from "../../components/basic/CustomMenu.tsx";
import { useMutation } from "react-query";
import {
  DataProviders,
  getLogs,
} from "../../api/dataProviders/DataProvider.ts";
import NewItemButton from "../../components/basic/NewItemButton.tsx";
import * as React from "react";
import { useContext } from "react";
import { APIAlertContext } from "../../providers/alertProvider.tsx";
import { ADMIN_ROLE } from "../../api/enums/userRoles.ts";
import { authenticationService } from "../../services/authenticationService.ts";
import { historyColumns, showHistoryButton } from "../history/History.tsx";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CustomDialog from "../../components/basic/CustomDialog.tsx";
import { GridValidRowModel } from "@mui/x-data-grid/models/gridRows";
import { GridColDef } from "@mui/x-data-grid";
import { LaboratoryInterface } from "../../api/interfaces/laboratory.ts";

function Laboratories(props: {
  history: boolean;
  logsPage?: boolean;
}) {
  const navigate = useNavigate();
  const { addAlert } = useContext(APIAlertContext);
  const { mutate: deleteMutate } = useMutation(
    DataProviders.LABORATORIES.deleteItem,
    {
      onSuccess: () => {
        addAlert(Names.removed, "success");
      },
    },
  );
  const [itemToDelete, setItemToDelete] = React.useState<number>();

  const { currentUserRoles } = authenticationService;
  const adminActions = currentUserRoles.includes(ADMIN_ROLE)
    ? (params: { row: LaboratoryInterface }) => [
        {
          name: Names.edit,
          handler: () => {
            navigate(
              `/${DataProviders.LABORATORIES.endpoint}/` +
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

  const actions = (params: { row: LaboratoryInterface }) =>
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
              renderCell: (params: { row: LaboratoryInterface }) => (
                <>
                  <CustomMenu items={actions({ row: params.row })} />
                </>
              ),
            },
          ]
        : []),
    {
      field: "laboratory",
      headerName: Names.laboratory,
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
            {Names.change_history} - {Names.laboratories}
          </>
        ) : (
          <NewItemButton
            textBefore={Names.laboratories}
            href={`/${DataProviders.LABORATORIES.endpoint}/new`}
            roles={[ADMIN_ROLE]}
          />
        )}
        {!props.history &&
          showHistoryButton(
            navigate,
            DataProviders.LABORATORIES.endpoint,
          )}
      </Box>
    ),
    content: (
      <>
        <DataGridPagination
          columns={columns as GridColDef[]}
          query_key={`${DataProviders.LABORATORIES.endpoint}all`}
          query_fn={
            (props.history
              ? getLogs(DataProviders.LABORATORIES)
              : DataProviders.LABORATORIES
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

export default Laboratories;

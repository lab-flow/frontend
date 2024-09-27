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
import { authenticationService } from "../../services/authenticationService";
import { ADMIN_ROLE } from "../../api/enums/userRoles";
import NewItemButton from "../../components/basic/NewItemButton";
import * as React from "react";
import { useContext } from "react";
import { APIAlertContext } from "../../providers/alertProvider";
import { historyColumns, showHistoryButton } from "../history/History";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CustomDialog from "../../components/basic/CustomDialog";
import { StorageConditionInterface } from "../../api/interfaces/storageCondition.ts";
import { GridValidRowModel } from "@mui/x-data-grid/models/gridRows";

function StorageConditions(props: { history: boolean; logsPage?: boolean }) {
  const navigate = useNavigate();
  const { addAlert } = useContext(APIAlertContext);
  const { currentUserRoles } = authenticationService;
  const [itemToDelete, setItemToDelete] = React.useState<number>();
  const { mutate: deleteMutate } = useMutation(
    DataProviders.STORAGE_CONDITIONS.deleteItem,
    {
      onSuccess: () => {
        addAlert(Names.removed, "success");
      },
    },
  );

  const { mutate: updateMutate } = useMutation(
    DataProviders.STORAGE_CONDITIONS.updateItem,
    {
      onSuccess: () => {
        addAlert(Names.updated, "success");
      },
    },
  );

  const adminActions = currentUserRoles.includes(ADMIN_ROLE)
    ? (params: { row: StorageConditionInterface }) => [
        ...(!params.row.is_validated_by_admin
          ? [
              {
                name: "Zaakceptuj do użytku",
                handler: () => {
                  updateMutate({
                    id: params.row.id,
                    is_validated_by_admin: true,
                  });
                },
              },
            ]
          : []),
        {
          name: Names.edit,
          handler: () => {
            navigate(
              `/${DataProviders.STORAGE_CONDITIONS.endpoint}/` +
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

  const actions = (params: { row: StorageConditionInterface }) =>
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
              renderCell: (params: { row: StorageConditionInterface }) => (
                <>
                  <CustomMenu items={actions({ row: params.row })} />
                </>
              ),
            },
          ]
        : []),
    {
      field: "storage_condition",
      headerName: Names.storage_conditions,
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
            {Names.change_history} - {Names.storage_conditions}
          </>
        ) : (
          <NewItemButton
            textBefore={Names.storage_conditions}
            href={`/${DataProviders.STORAGE_CONDITIONS.endpoint}/new`}
          />
        )}
        {!props.history &&
          showHistoryButton(
            navigate,
            DataProviders.STORAGE_CONDITIONS.endpoint,
          )}
      </Box>
    ),
    content: (
      <>
        <DataGridPagination
          columns={columns as GridColDef[]}
          query_key="getStorageConditions"
          query_fn={
            (props.history
              ? getLogs(DataProviders.STORAGE_CONDITIONS)
              : DataProviders.STORAGE_CONDITIONS
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

export default StorageConditions;

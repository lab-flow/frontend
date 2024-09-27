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
import { PurityQualityInterface } from "../../api/interfaces/purityQuality.ts";
import { GridValidRowModel } from "@mui/x-data-grid/models/gridRows";

function PuritiesQualities(props: { history: boolean; logsPage?: boolean }) {
  const navigate = useNavigate();
  const { currentUserRoles } = authenticationService;
  const { addAlert } = useContext(APIAlertContext);
  const [itemToDelete, setItemToDelete] = React.useState<number>();
  const { mutate: deleteMutate } = useMutation(
    DataProviders.PURITIES_QUALITIES.deleteItem,
    {
      onSuccess: () => {
        addAlert(Names.removed, "success");
      },
    },
  );

  const { mutate: updateMutate } = useMutation(
    DataProviders.PURITIES_QUALITIES.updateItem,
    {
      onSuccess: () => {
        addAlert(Names.updated, "success");
      },
    },
  );

  const adminActions = currentUserRoles.includes(ADMIN_ROLE)
    ? (params: { row: PurityQualityInterface }) => [
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
              `/${DataProviders.PURITIES_QUALITIES.endpoint}/` +
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

  const actions = (params: { row: PurityQualityInterface }) =>
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
              renderCell: (params: { row: PurityQualityInterface }) => (
                <>
                  <CustomMenu items={actions({ row: params.row })} />
                </>
              ),
            },
          ]
        : []),
    {
      field: "purity_quality",
      headerName: Names.purities_qualities,
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
            {Names.change_history} - {Names.purities_qualities}
          </>
        ) : (
          <NewItemButton
            textBefore={Names.purities_qualities}
            href={`/${DataProviders.PURITIES_QUALITIES.endpoint}/new`}
          />
        )}
        {!props.history &&
          showHistoryButton(
            navigate,
            DataProviders.PURITIES_QUALITIES.endpoint,
          )}
      </Box>
    ),
    content: (
      <>
        <DataGridPagination
          columns={columns as GridColDef[]}
          query_key="getPuritiesQualities"
          query_fn={
            (props.history
              ? getLogs(DataProviders.PURITIES_QUALITIES)
              : DataProviders.PURITIES_QUALITIES
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

export default PuritiesQualities;

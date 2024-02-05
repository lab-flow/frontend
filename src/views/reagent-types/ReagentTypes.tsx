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
import { ReagentTypeInterface } from "../../api/interfaces/reagentType.ts";
import { GridValidRowModel } from "@mui/x-data-grid/models/gridRows";

function ReagentTypes(props: { history: boolean; logsPage?: boolean }) {
  const navigate = useNavigate();
  const { currentUserRoles } = authenticationService;
  const { addAlert } = useContext(APIAlertContext);
  const [itemToDelete, setItemToDelete] = React.useState<number>();
  const { mutate: deleteMutate } = useMutation(
    DataProviders.REAGENT_TYPES.deleteItem,
    {
      onSuccess: () => {
        addAlert(Names.removed, "success");
      },
    },
  );

  const { mutate: updateMutate } = useMutation(
    DataProviders.REAGENT_TYPES.updateItem,
    {
      onSuccess: () => {
        addAlert(Names.updated, "success");
      },
    },
  );

  const adminActions = currentUserRoles.includes(ADMIN_ROLE)
    ? (params: { row: ReagentTypeInterface }) => [
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
              `/${DataProviders.REAGENT_TYPES.endpoint}/` +
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

  const actions = (params: { row: ReagentTypeInterface }) =>
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
      field: "type",
      headerName: Names.type,
      width: 300,
      renderCell: renderCellExpand,
      sortable: true,
    },
    ...(!props.history
      ? [
          {
            field: "actions",
            headerName: Names.actions,
            width: 55,
            sortable: false,
            renderCell: (params: { row: ReagentTypeInterface }) => (
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
            {Names.change_history} - {Names.reagent_types}
          </>
        ) : (
          <NewItemButton
            textBefore={Names.reagent_types}
            href={`/${DataProviders.REAGENT_TYPES.endpoint}/new`}
          />
        )}
        {!props.history &&
          showHistoryButton(navigate, DataProviders.REAGENT_TYPES.endpoint)}
      </Box>
    ),
    content: (
      <>
        <DataGridPagination
          columns={columns as GridColDef[]}
          query_key="getReagentTypes"
          query_fn={
            (props.history
              ? getLogs(DataProviders.REAGENT_TYPES)
              : DataProviders.REAGENT_TYPES
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

export default ReagentTypes;

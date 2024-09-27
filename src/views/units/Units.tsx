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
import { UnitInterface } from "../../api/interfaces/unit.ts";
import { GridValidRowModel } from "@mui/x-data-grid/models/gridRows";

function Units(props: { history: boolean; logsPage?: boolean }) {
  const navigate = useNavigate();
  const { addAlert } = useContext(APIAlertContext);
  const [itemToDelete, setItemToDelete] = React.useState<number>();
  const { currentUserRoles } = authenticationService;

  const { mutate: deleteMutate } = useMutation(DataProviders.UNITS.deleteItem, {
    onSuccess: () => {
      addAlert(Names.removed, "success");
    },
  });

  const { mutate: updateMutate } = useMutation(DataProviders.UNITS.updateItem, {
    onSuccess: () => {
      addAlert(Names.updated, "success");
    },
  });

  const adminActions = currentUserRoles.includes(ADMIN_ROLE)
    ? (params: { row: UnitInterface }) => [
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
            navigate(`/${DataProviders.UNITS.endpoint}/${params.row.id}/edit`);
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

  const actions = (params: { row: UnitInterface }) =>
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
              renderCell: (params: { row: UnitInterface }) => (
                <>
                  <CustomMenu items={actions({ row: params.row })} />
                </>
              ),
            },
          ]
        : []),
    {
      field: "unit",
      headerName: Names.unit,
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
            {Names.change_history} - {Names.units}
          </>
        ) : (
          <NewItemButton
            textBefore={Names.units}
            href={`/${DataProviders.UNITS.endpoint}/new`}
          />
        )}
        {!props.history &&
          showHistoryButton(navigate, DataProviders.UNITS.endpoint)}
      </Box>
    ),
    content: (
      <>
        <DataGridPagination
          columns={columns as GridColDef[]}
          query_key="getUnits"
          query_fn={
            (props.history ? getLogs(DataProviders.UNITS) : DataProviders.UNITS)
              .getItemList
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

export default Units;

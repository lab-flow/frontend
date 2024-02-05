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
import { ConcentrationsInterface } from "../../api/interfaces/concentrations.ts";
import { GridValidRowModel } from "@mui/x-data-grid/models/gridRows";
import { GridColDef } from "@mui/x-data-grid";

function Concentrations(props: { history: boolean; logsPage?: boolean }) {
  const navigate = useNavigate();
  const { addAlert } = useContext(APIAlertContext);
  const { mutate: deleteConcentrationMutate } = useMutation(
    DataProviders.CONCENTRATIONS.deleteItem,
    {
      onSuccess: () => {
        addAlert(Names.removed, "success");
      },
    },
  );
  const [itemToDelete, setItemToDelete] = React.useState<number>();

  const { mutate: updateMutate } = useMutation(
    DataProviders.CONCENTRATIONS.updateItem,
    {
      onSuccess: () => {
        addAlert(Names.updated, "success");
      },
    },
  );

  const { currentUserRoles } = authenticationService;
  const adminActions = currentUserRoles.includes(ADMIN_ROLE)
    ? (params: { row: ConcentrationsInterface }) =>
        [
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
                `/${DataProviders.CONCENTRATIONS.endpoint}/` +
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
        ].filter((item) => item)
    : () => [];

  const actions = (params: { row: ConcentrationsInterface }) =>
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
      field: "concentration",
      headerName: Names.concentration,
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
            renderCell: (params: { row: ConcentrationsInterface }) => (
              <>
                <CustomMenu items={actions({ row: params.row })} />
              </>
            ),
          },
        ]
      : []),
  ];

  return DashboardCard({
    title: (
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        {props.history ? (
          <>
            {Names.change_history} - {Names.concentrations}
          </>
        ) : (
          <NewItemButton
            textBefore={Names.concentrations}
            href={`/${DataProviders.CONCENTRATIONS.endpoint}/new`}
          />
        )}
        {!props.history &&
          showHistoryButton(navigate, DataProviders.CONCENTRATIONS.endpoint)}
      </Box>
    ),
    content: (
      <>
        <DataGridPagination
          columns={columns as GridColDef[]}
          query_key="getStorageConditions"
          query_fn={
            (props.history
              ? getLogs(DataProviders.CONCENTRATIONS)
              : DataProviders.CONCENTRATIONS
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
            deleteConcentrationMutate({ id: itemToDelete });
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

export default Concentrations;

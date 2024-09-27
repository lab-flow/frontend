import DashboardCard from "../../components/basic/DashboardCard";
import "../../api/dataProviders/dataProviders";
import { Names } from "../../api/common/dataNames.ts";
import DataGridPagination from "../../components/datagrid/DataGridPagination.tsx";
import { renderCellExpand } from "../../components/datagrid/GridCellExpand.tsx";
import { Box, Typography } from "@mui/material";
import { ADMIN_ROLE, getRoleName } from "../../api/enums/userRoles";
import { useMutation } from "react-query";
import CustomMenu from "../../components/basic/CustomMenu";
import {
  DataProviders,
  getLogs,
} from "../../api/dataProviders/DataProvider.ts";
import * as React from "react";
import { useContext } from "react";
import { APIAlertContext } from "../../providers/alertProvider";
import NewItemButton from "../../components/basic/NewItemButton";
import { authenticationService } from "../../services/authenticationService";
import { historyColumns, showHistoryButton } from "../history/History";
import { useNavigate } from "react-router-dom";
import CustomDialog from "../../components/basic/CustomDialog";
import { UserInterface } from "../../api/interfaces/user.ts";
import { GridValidRowModel } from "@mui/x-data-grid/models/gridRows";
import { GridColDef } from "@mui/x-data-grid";

function UsersList(props: { history: boolean; logsPage?: boolean }) {
  const navigate = useNavigate();
  const { addAlert } = useContext(APIAlertContext);
  const { mutate: removeUserMutate } = useMutation(
    DataProviders.USERS.deleteItem,
    {
      onSuccess: () => {
        addAlert(Names.removed, "success");
      },
    },
  );
  const [itemToDelete, setItemToDelete] = React.useState<number>();

  const { currentUserRoles } = authenticationService;
  const adminActions = currentUserRoles.includes(ADMIN_ROLE)
    ? (params: { row: UserInterface }) => [
        {
          name: Names.edit,
          handler: () => {
            navigate(`/${DataProviders.USERS.endpoint}/${params.row.id}/edit`);
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

  const actions = (params: { row: UserInterface }) =>
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
              renderCell: (params: { row: UserInterface }) => (
                <>
                  <CustomMenu items={actions({ row: params.row })} />
                </>
              ),
            },
          ]
        : []),
    {
      field: "username",
      headerName: Names.username,
      width: 200,
      renderCell: renderCellExpand,
      sortable: true,
    },
    {
      field: "email",
      headerName: Names.email,
      width: 320,
      renderCell: renderCellExpand,
      sortable: true,
    },
    {
      field: "first_name",
      headerName: Names.first_name,
      width: 175,
      renderCell: renderCellExpand,
      sortable: true,
    },
    {
      field: "last_name",
      headerName: Names.last_name,
      width: 175,
      renderCell: renderCellExpand,
      sortable: true,
    },
    {
      field: "last_login",
      headerName: Names.last_login,
      width: 175,
      renderCell: renderCellExpand,
      sortable: false,
    },
    {
      field: "lab_roles",
      headerName: Names.lab_roles,
      width: 600,
      renderCell: (params: { row: UserInterface }) =>
        params.row.lab_roles
          ?.map((role: string) => getRoleName(role))
          .join(", ") ?? null,
      sortable: false,
    },
    {
      field: "is_staff",
      headerName: Names.is_staff,
      width: 175,
      sortable: false,
      type: "boolean",
    },
  ];

  return (
    <>
      {DashboardCard({
        title: (
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            {props.history ? (
              <>
                {Names.change_history} - {Names.users}
              </>
            ) : (
              <NewItemButton
                textBefore={Names.users}
                href={`/${DataProviders.USERS.endpoint}/new`}
                roles={[ADMIN_ROLE]}
              />
            )}
            {!props.history &&
              showHistoryButton(navigate, DataProviders.USERS.endpoint)}
          </Box>
        ),
        content: (
          <>
            <DataGridPagination
              columns={columns as GridColDef[]}
              query_key="getUsers"
              query_fn={
                (props.history
                  ? getLogs(DataProviders.USERS)
                  : DataProviders.USERS
                ).getItemList
              }
              logsPage={props.logsPage}
              historyData={props.history}
              sortType="users"
            />
            <CustomDialog
              open={itemToDelete != undefined}
              content={
                <Typography>
                  {Names.delete_confirmation_description} ID: {itemToDelete}
                </Typography>
              }
              title={Names.delete_confirmation_title}
              setDialogOpen={() => setItemToDelete(undefined)}
              firstButtonHandler={() => {
                removeUserMutate({ id: itemToDelete });
                setItemToDelete(undefined);
              }}
              firstButtonLabel={Names.delete}
              secondButtonHandler={() => setItemToDelete(undefined)}
              secondButtonLabel={Names.cancel}
            />
          </>
        ),
      })}
    </>
  );
}

export default UsersList;

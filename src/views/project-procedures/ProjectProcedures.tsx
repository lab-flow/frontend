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
import { ADMIN_ROLE, ROLE } from "../../api/enums/userRoles";
import NewItemButton from "../../components/basic/NewItemButton";
import * as React from "react";
import { useContext } from "react";
import { APIAlertContext } from "../../providers/alertProvider";
import { historyColumns, showHistoryButton } from "../history/History";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CustomDialog from "../../components/basic/CustomDialog";
import { ProjectProcedureInterface } from "../../api/interfaces/projectProcedure.ts";
import { GridValidRowModel } from "@mui/x-data-grid/models/gridRows";
import { GridColDef } from "@mui/x-data-grid";

function ProjectProcedures(props: { history: boolean; logsPage?: boolean }) {
  const navigate = useNavigate();
  const { currentUserRoles } = authenticationService;
  const { addAlert } = useContext(APIAlertContext);
  const [itemToDelete, setItemToDelete] = React.useState<number>();
  const { mutate: deleteMutate } = useMutation(
    DataProviders.PROJECT_PROCEDURES.deleteItem,
    {
      onSuccess: () => {
        addAlert(Names.removed, "success");
      },
    },
  );

  const { mutate: updateMutate } = useMutation(
    DataProviders.PROJECT_PROCEDURES.updateItem,
    {
      onSuccess: () => {
        addAlert(Names.updated, "success");
      },
    },
  );

  const adminActions = currentUserRoles.some((r) =>
    [ADMIN_ROLE, ROLE.LAB_MANAGER].includes(r),
  )
    ? (params: { row: ProjectProcedureInterface }) => [
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
              `/${DataProviders.PROJECT_PROCEDURES.endpoint}/` +
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

  const actions = (params: { row: ProjectProcedureInterface }) =>
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
      field: "name",
      headerName: Names.name,
      width: 300,
      renderCell: renderCellExpand,
      sortable: true,
    },
    {
      field: "manager",
      headerName: Names.manager,
      width: 170,
      renderCell: (params: { row: ProjectProcedureInterface }) =>
        params.row.manager?.repr,
      sortable: false,
    },
    {
      field: "workers",
      headerName: Names.workers,
      width: 700,
      renderCell: (params: { row: ProjectProcedureInterface }) =>
        params.row.workers?.map((worker: any) => worker.repr).join(", "),
      sortable: false,
    },
    ...(!props.history
      ? [
          {
            field: "actions",
            headerName: Names.actions,
            width: 55,
            sortable: false,
            renderCell: (params: { row: ProjectProcedureInterface }) => (
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
            {Names.change_history} - {Names.project_procedures}
          </>
        ) : (
          <NewItemButton
            textBefore={Names.project_procedures}
            href={`/${DataProviders.PROJECT_PROCEDURES.endpoint}/new`}
            roles={[ADMIN_ROLE, ROLE.LAB_MANAGER, ROLE.PROCEDURE_MANAGER]}
          />
        )}
        {!props.history &&
          showHistoryButton(
            navigate,
            DataProviders.PROJECT_PROCEDURES.endpoint,
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
              ? getLogs(DataProviders.PROJECT_PROCEDURES)
              : DataProviders.PROJECT_PROCEDURES
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

export default ProjectProcedures;

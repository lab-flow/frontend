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
import { getHazardGroupName } from "../../api/enums/hazardGroups";
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
import { ClpClassificationInterface } from "../../api/interfaces/clpClassification.ts";
import { GridValidRowModel } from "@mui/x-data-grid/models/gridRows";
import { GridColDef } from "@mui/x-data-grid";

function ClpClassifications(props: { history: boolean; logsPage?: boolean }) {
  const navigate = useNavigate();
  const { addAlert } = useContext(APIAlertContext);
  const { mutate: deleteUnitMutate } = useMutation(
    DataProviders.CLP_CLASSIFICATIONS.deleteItem,
    {
      onSuccess: () => {
        addAlert(Names.removed, "success");
      },
    },
  );
  const [itemToDelete, setItemToDelete] = React.useState<number>();

  const { currentUserRoles } = authenticationService;
  const adminActions = currentUserRoles.includes(ADMIN_ROLE)
    ? (params: { row: ClpClassificationInterface }) => [
        {
          name: Names.edit,
          handler: () => {
            navigate(
              `/${DataProviders.CLP_CLASSIFICATIONS.endpoint}/` +
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

  const actions = (params: { row: ClpClassificationInterface }) =>
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
              renderCell: (params: { row: ClpClassificationInterface }) => (
                <>
                  <CustomMenu items={actions({ row: params.row })} />
                </>
              ),
            },
          ]
        : []),
    {
      field: "classification",
      headerName: Names.classification,
      width: 300,
      renderCell: renderCellExpand,
      sortable: false,
    },
    {
      field: "clp_classification",
      headerName: Names.clp_classification,
      width: 300,
      renderCell: renderCellExpand,
      sortable: true,
    },
    {
      field: "hazard_group",
      headerName: Names.hazard_group,
      width: 200,
      sortable: false,
      renderCell: (params: { row: ClpClassificationInterface }) =>
        params.row.hazard_group
          ? getHazardGroupName(params.row.hazard_group)
          : null,
    },
  ];

  return DashboardCard({
    title: (
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        {props.history ? (
          <>
            {Names.change_history} - {Names.clp_classification}
          </>
        ) : (
          <NewItemButton
            textBefore={Names.clp_classifications}
            href={`/${DataProviders.CLP_CLASSIFICATIONS.endpoint}/new`}
            roles={[ADMIN_ROLE]}
          />
        )}
        {!props.history &&
          showHistoryButton(
            navigate,
            DataProviders.CLP_CLASSIFICATIONS.endpoint,
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
              ? getLogs(DataProviders.CLP_CLASSIFICATIONS)
              : DataProviders.CLP_CLASSIFICATIONS
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
            deleteUnitMutate({ id: itemToDelete });
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

export default ClpClassifications;

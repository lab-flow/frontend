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
import { GridValidRowModel } from "@mui/x-data-grid/models/gridRows";
import { PictogramsInterface } from "../../api/interfaces/pictograms.ts";

function Pictograms(props: { history: boolean; logsPage?: boolean }) {
  const { addAlert } = useContext(APIAlertContext);
  const navigate = useNavigate();
  const [itemToDelete, setItemToDelete] = React.useState<number>();

  const { mutate: deletePictogramMutate } = useMutation(
    DataProviders.PICTOGRAMS.deleteItem,
    {
      onSuccess: () => {
        addAlert(Names.removed, "success");
      },
    },
  );

  const { currentUserRoles } = authenticationService;
  const adminActions = currentUserRoles.includes(ADMIN_ROLE)
    ? (params: { row: PictogramsInterface }) => [
        {
          name: Names.edit,
          handler: () => {
            navigate(
              `/${DataProviders.PICTOGRAMS.endpoint}/` +
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

  const actions = (params: { row: PictogramsInterface }) =>
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
      field: "pictogram",
      headerName: Names.pictogram,
      sortable: false,
      width: 120,
      renderCell: (params: { row: PictogramsInterface }) =>
        params.row.pictogram ? (
          <img
            src={params.row.pictogram}
            alt={params.row.pictogram}
            style={{
              width: "50px",
              height: "50px",
              boxShadow: "0 0 1px rgba(0, 0, 0, 0.5)",
            }}
          />
        ) : null,
    },
    ...(!props.history
      ? [
          {
            field: "actions",
            headerName: Names.actions,
            width: 55,
            sortable: false,
            renderCell: (params: { row: PictogramsInterface }) => (
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
            {Names.change_history} - {Names.pictograms}
          </>
        ) : (
          <NewItemButton
            textBefore={Names.pictograms}
            href={`/${DataProviders.PICTOGRAMS.endpoint}/new`}
            roles={[ADMIN_ROLE]}
          />
        )}
        {!props.history &&
          showHistoryButton(navigate, DataProviders.PICTOGRAMS.endpoint)}
      </Box>
    ),
    content: (
      <>
        <DataGridPagination
          columns={columns as GridColDef[]}
          query_key="getPictogramsAll"
          query_fn={
            (props.history
              ? getLogs(DataProviders.PICTOGRAMS)
              : DataProviders.PICTOGRAMS
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
            deletePictogramMutate({ id: itemToDelete });
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

export default Pictograms;

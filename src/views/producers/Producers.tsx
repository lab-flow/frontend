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
import { ProducerInterface } from "../../api/interfaces/producer.ts";
import { GridValidRowModel } from "@mui/x-data-grid/models/gridRows";
import { GridColDef } from "@mui/x-data-grid";

function Producers(props: { history: boolean; logsPage?: boolean }) {
  const navigate = useNavigate();
  const { currentUserRoles } = authenticationService;
  const { addAlert } = useContext(APIAlertContext);
  const [itemToDelete, setItemToDelete] = React.useState<number>();

  const { mutate: deleteMutate } = useMutation(
    DataProviders.PRODUCERS.deleteItem,
    {
      onSuccess: () => {
        addAlert(Names.removed, "success");
      },
    },
  );

  const { mutate: updateMutate } = useMutation(
    DataProviders.PRODUCERS.updateItem,
    {
      onSuccess: () => {
        addAlert(Names.updated, "success");
      },
    },
  );

  const adminActions = currentUserRoles.includes(ADMIN_ROLE)
    ? (params: { row: ProducerInterface }) => [
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
              `/${DataProviders.PRODUCERS.endpoint}/` + params.row.id + "/edit",
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
  const actions = (params: { row: ProducerInterface }) =>
    [...adminActions(params)].filter((item) => item);

  const columns: GridValidRowModel[] = [
    ...(props.history ? historyColumns : []),
    !props.history
      ? {
          field: "id",
          headerName: Names.id,
          width: 70,
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
              renderCell: (params: { row: ProducerInterface }) => (
                <>
                  <CustomMenu items={actions({ row: params.row })} />
                </>
              ),
            },
          ]
        : []),
    {
      field: "abbreviation",
      headerName: Names.abbreviation,
      width: 250,
      renderCell: renderCellExpand,
      sortable: true,
    },
    {
      field: "producer_name",
      headerName: Names.producer_name,
      width: 250,
      renderCell: renderCellExpand,
      sortable: true,
    },
    {
      field: "brand_name",
      headerName: Names.brand_name,
      width: 250,
      renderCell: renderCellExpand,
      sortable: true,
    },
  ].filter((item) => item);

  return (
    <>
      {DashboardCard({
        title: (
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            {props.history ? (
              <>
                {Names.change_history} - {Names.producers}
              </>
            ) : (
              <NewItemButton
                textBefore={Names.producers}
                href={`/${DataProviders.PRODUCERS.endpoint}/new`}
              />
            )}
            {!props.history &&
              showHistoryButton(navigate, DataProviders.PRODUCERS.endpoint)}
          </Box>
        ),
        content: (
          <>
            <DataGridPagination
              columns={columns as GridColDef[]}
              query_key="getProducers"
              query_fn={
                (props.history
                  ? getLogs(DataProviders.PRODUCERS)
                  : DataProviders.PRODUCERS
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
      })}
    </>
  );
}

export default Producers;

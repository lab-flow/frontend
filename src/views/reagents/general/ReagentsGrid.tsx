import * as React from "react";
import { useContext } from "react";
import DashboardCard from "../../../components/basic/DashboardCard.tsx";
import "../../../api/dataProviders/dataProviders.ts";
import { Names } from "../../../api/common/dataNames.ts";
import DataGridPagination from "../../../components/datagrid/DataGridPagination.tsx";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, Grid, Tooltip, Typography, useTheme } from "@mui/material";
import { useMutation } from "react-query";
import CustomMenu from "../../../components/basic/CustomMenu.tsx";
import { authenticationService } from "../../../services/authenticationService";
import { ADMIN_ROLE } from "../../../api/enums/userRoles";
import CustomReagentTooltip from "../../../components/basic/HtmlTooltip";
import {
  DataProviders,
  getLogs,
} from "../../../api/dataProviders/DataProvider.ts";
import { renderCellDetailsFromEndpoint } from "../../../components/datagrid/RenderCellDetailsFromEndpoint";
import NewItemButton from "../../../components/basic/NewItemButton";
import { APIAlertContext } from "../../../providers/alertProvider";
import { historyColumns, showHistoryButton } from "../../history/History";
import { renderCellExpand } from "../../../components/datagrid/GridCellExpand";
import { useNavigate } from "react-router-dom";
import CustomDialog from "../../../components/basic/CustomDialog";
import { ReagentInterface } from "../../../api/interfaces/reagent.ts";
import { GridValidRowModel } from "@mui/x-data-grid/models/gridRows";
import { GridColDef } from "@mui/x-data-grid";
import { getSafetyDataSheet, getSafetyInstruction } from "../../../api/dataProviders/dataProviders.ts";

const ReagentsGrid = (props: { history: boolean; logsPage?: boolean }) => {
  const navigate = useNavigate();
  const { currentUserRoles } = authenticationService;
  const { addAlert } = useContext(APIAlertContext);
  const theme = useTheme();
  const [itemToDelete, setItemToDelete] = React.useState<number>();

  const { mutate: deleteMutate } = useMutation(
    DataProviders.REAGENTS.deleteItem,
    {
      onSuccess: () => {
        addAlert(Names.removed, "success");
      },
    },
  );

  const { mutate: updateMutate } = useMutation(
    DataProviders.REAGENTS.updateItem,
    {
      onSuccess: () => {
        addAlert(Names.updated, "success");
      },
    },
  );

  const adminActions = currentUserRoles.includes(ADMIN_ROLE)
    ? (params: { row: ReagentInterface }) => [
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
              `/${DataProviders.REAGENTS.endpoint}/` + params.row.id + "/edit",
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

  const actions = (params: { row: ReagentInterface }) =>
    [
      {
        name: Names.details,
        handler: () => navigate("/reagents/" + params.row.id),
      },
      ...adminActions(params),
    ].filter((item) => item);

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
              sortable: false,
              width: 55,
              renderCell: (params: { row: ReagentInterface }) => (
                <>
                  <CustomMenu items={actions({ row: params.row })} />
                </>
              ),
            },
          ]
        : []),
    {
      field: "name",
      headerName: Names.name,
      width: 150,
      align: "left",
      sortable: true,
    },
    {
      field: "type",
      headerName: Names.type,
      width: 125,
      renderCell: (params: { row: ReagentInterface }) => params.row.type?.repr,
      sortable: false,
    },
    {
      field: "producer",
      headerName: Names.producer,
      width: 125,
      renderCell: (params: {
        value: { id: number; repr: string };
        colDef: { computedWidth: number };
      }) =>
        renderCellDetailsFromEndpoint({
          getDetails: DataProviders.PRODUCERS.getItem,
          ...params,
        }),
      sortable: true,
    },
    {
      field: "catalog_no",
      headerName: Names.catalog_no,
      width: 140,
      align: "left",
      sortable: true,
    },
    {
      field: "purity_quality",
      headerName: Names.purity_quality,
      width: 125,
      renderCell: (params: { row: ReagentInterface }) =>
        params.row.purity_quality?.repr,
      sortable: false,
    },
    {
      field: "concentration",
      headerName: Names.concentration,
      width: 125,
      renderCell: (params: { row: ReagentInterface }) =>
        params.row.concentration?.repr,
      sortable: false,
    },
    {
      field: "volume",
      headerName: Names.volume,
      width: 100,
      align: "left",
      sortable: false,
    },
    {
      field: "unit",
      headerName: Names.unit,
      width: 125,
      renderCell: (params: { row: ReagentInterface }) => params.row.unit?.repr,
      sortable: false,
    },
    {
      field: "cas_no",
      headerName: Names.cas_no,
      width: 140,
      align: "left",
      sortable: false,
    },
    {
      field: "other_info",
      headerName: Names.other_info,
      width: 140,
      align: "left",
      sortable: false,
    },
    {
      field: "storage_conditions",
      headerName: Names.storage_conditions,
      width: 220,
      renderCell: (params: { row: ReagentInterface }) =>
        params.row.storage_conditions
          ?.map((item: { repr: string }) => item.repr)
          .join(", "),
      sortable: false,
    },
    {
      field: "hazard_statements",
      headerName: Names.hazard_statements,
      width: 220,
      renderCell: (params: { row: ReagentInterface }) => (
        <Grid container spacing={0.25}>
          {params.row.hazard_statements?.map(
            (item: { id: number; repr: string }) =>
              item && (
                <Grid item key={item?.id} style={{ cursor: "pointer" }}>
                  <CustomReagentTooltip
                    type="H"
                    size={10}
                    item={item}
                    getDetails={DataProviders.HAZARD_STATEMENTS.getItem}
                  />
                </Grid>
              ),
          )}
        </Grid>
      ),
      sortable: false,
    },
    {
      field: "precautionary_statements",
      headerName: Names.precautionary_statements,
      width: 220,
      renderCell: (params: { row: ReagentInterface }) => (
        <Grid container spacing={0.25}>
          {params.row.precautionary_statements?.map(
            (item: { id: number; repr: string }) =>
              item && (
                <Grid item key={item?.id} style={{ cursor: "pointer" }}>
                  <CustomReagentTooltip
                    type="P"
                    size={10}
                    item={item}
                    getDetails={DataProviders.PRECAUTIONARY_STATEMENT.getItem}
                  />
                </Grid>
              ),
          )}
        </Grid>
      ),
      sortable: false,
    },
    {
      field: "safety_data_sheet",
      headerName: Names.safety_data_sheet,
      width: 220,
      sortable: false,
      align: "center",
      renderCell: (params: { row: ReagentInterface }) => (
        <>
        {params.row.safety_data_sheet?.repr}
        <Tooltip title={`${Names.safety_data_sheet} - ${Names.preview}`}
          onClick={async () => {
            window.open(
              (await getSafetyDataSheet(params.row.safety_data_sheet?.id)).safety_data_sheet,
              "_blank",
            );
          }}>
            <VisibilityIcon style={{ color: theme.palette.info.main, marginLeft: "10px" }} />
          </Tooltip>    
        </>
      ),
    },
    {
      field: "safety_instruction",
      headerName: Names.safety_instruction,
      width: 220,
      sortable: false,
      align: "center",
      renderCell: (params: { row: ReagentInterface }) => (
        <>
        {params.row.safety_instruction?.repr}
        <Tooltip title={`${Names.safety_instruction} - ${Names.preview}`}
        onClick={async () => {
          window.open(
            (await getSafetyInstruction
              (params.row.safety_instruction?.id)).safety_instruction
              ,
            "_blank",
          );
        }}>
          <VisibilityIcon style={{ color: theme.palette.info.main, marginLeft: "10px"  }} />
        </Tooltip>
        </>
      ),
    },
    {
      field: "is_usage_record_required",
      headerName: Names.is_usage_record_required,
      width: 150,
      sortable: false,
      type: "boolean",
    },
    {
      field: "kit_contents",
      headerName: Names.kit_contents,
      width: 190,
      align: "left",
      sortable: false,
    },
  ];

  return DashboardCard({
    title: (
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        {props.history ? (
          <>
            {Names.change_history} - {Names.title_reagents_grid}
          </>
        ) : (
          <NewItemButton
            textBefore={Names.title_reagents_grid}
            href={`/${DataProviders.REAGENTS.endpoint}/new`}
          />
        )}
        {!props.history &&
          showHistoryButton(navigate, DataProviders.REAGENTS.endpoint)}
      </Box>
    ),
    content: (
      <>
        <DataGridPagination
          columns={columns as GridColDef[]}
          query_key="getReagents"
          query_fn={
            (props.history
              ? getLogs(DataProviders.REAGENTS)
              : DataProviders.REAGENTS
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
};

export default ReagentsGrid;

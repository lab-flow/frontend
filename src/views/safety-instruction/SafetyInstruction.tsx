import DashboardCard from "../../components/basic/DashboardCard.tsx";
import "../../api/dataProviders/dataProviders.ts";
import { Names } from "../../api/common/dataNames.ts";
import DataGridPagination from "../../components/datagrid/DataGridPagination.tsx";
import { renderCellExpand } from "../../components/datagrid/GridCellExpand.tsx";
import CustomMenu from "../../components/basic/CustomMenu.tsx";
import { useMutation } from "react-query";
import {
  DataProviders,
  getLogs,
} from "../../api/dataProviders/DataProvider.ts";
import { authenticationService } from "../../services/authenticationService.ts";
import { ADMIN_ROLE } from "../../api/enums/userRoles.ts";
import NewItemButton from "../../components/basic/NewItemButton.tsx";
import * as React from "react";
import { useContext } from "react";
import { APIAlertContext } from "../../providers/alertProvider.tsx";
import { historyColumns, showHistoryButton } from "../history/History.tsx";
import { Box, Tooltip, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CustomDialog from "../../components/basic/CustomDialog.tsx";
import { GridValidRowModel } from "@mui/x-data-grid/models/gridRows";
import { GridColDef } from "@mui/x-data-grid";
import { SafetyInstructionInterface } from "../../api/interfaces/safety_instruction.ts";
import theme from "../../theme.ts";
import VisibilityIcon from "@mui/icons-material/Visibility";

function SafetyInstruction(props: { history: boolean; logsPage?: boolean }) {
  const navigate = useNavigate();
  const { currentUserRoles } = authenticationService;
  const { addAlert } = useContext(APIAlertContext);
  const [itemToDelete, setItemToDelete] = React.useState<number>();

  const { mutate: deleteMutate } = useMutation(
    DataProviders.SAFETY_INSTRUCTIONS.deleteItem,
    {
      onSuccess: () => {
        addAlert(Names.removed, "success");
      },
    },
  );

  const { mutate: updateMutate } = useMutation(
    DataProviders.SAFETY_INSTRUCTIONS.updateItem,
    {
      onSuccess: () => {
        addAlert(Names.updated, "success");
      },
    },
  );

  const adminActions = currentUserRoles.includes(ADMIN_ROLE)
    ? (params: { row: SafetyInstructionInterface }) => [
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
              `/${DataProviders.SAFETY_INSTRUCTIONS.endpoint}/` + params.row.id + "/edit",
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
  const actions = (params: { row: SafetyInstructionInterface }) =>
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
              renderCell: (params: { row: SafetyInstructionInterface }) => (
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
      width: 250,
      renderCell: renderCellExpand,
      sortable: true,
    },
    {
      field: "reagent_name",
      headerName: Names.reagent_name,
      width: 250,
      renderCell: renderCellExpand,
      sortable: true,
    },
    {
      field: "safety_instruction",
      headerName: Names.safety_instruction,
      width: 250,
      sortable: false,
      align: "center",
      renderCell: (params: { row: SafetyInstructionInterface
       }) => (
        <a
          href={params.row.safety_instruction}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Tooltip title={`${Names.safety_instruction} - ${Names.preview}`}>
            <VisibilityIcon style={{ color: theme.palette.info.main }} />
          </Tooltip>
        </a>
      ),
    },


  ].filter((item) => item);

  return (
    <>
      {DashboardCard({
        title: (
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            {props.history ? (
              <>
                {Names.change_history} - {Names.safety_instruction}
              </>
            ) : (
              <NewItemButton
                textBefore={Names.safety_instructions}
                href={`/${DataProviders.SAFETY_INSTRUCTIONS.endpoint}/new`}
              />
            )}
            {!props.history &&
              showHistoryButton(navigate, DataProviders.SAFETY_INSTRUCTIONS.endpoint)}
          </Box>
        ),
        content: (
          <>
            <DataGridPagination
              columns={columns as GridColDef[]}
              query_key="getSafetyInstructions"
              query_fn={
                (props.history
                  ? getLogs(DataProviders.SAFETY_INSTRUCTIONS)
                  : DataProviders.SAFETY_INSTRUCTIONS
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

export default SafetyInstruction;

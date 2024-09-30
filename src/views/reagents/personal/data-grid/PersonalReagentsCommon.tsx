import * as React from "react";
import { useContext, useState } from "react";
import { GridColDef, GridColumnVisibilityModel } from "@mui/x-data-grid";

import DashboardCard from "../../../../components/basic/DashboardCard.tsx";
import { Names } from "../../../../api/common/dataNames.ts";
import DataGridPagination from "../../../../components/datagrid/DataGridPagination.tsx";
import CustomMenu from "../../../../components/basic/CustomMenu.tsx";
import { renderCellExpand } from "../../../../components/datagrid/GridCellExpand.tsx";
import { Box, Divider, Grid, TextField, Typography } from "@mui/material";
import { generateAndShowUsageRecord } from "../../common/GenerateUsageRecordPanel.tsx";
import CustomReagentTooltip from "../../../../components/basic/HtmlTooltip";
import { DataProviders } from "../../../../api/dataProviders/DataProvider.ts";
import { renderCellDetailsFromEndpoint } from "../../../../components/datagrid/RenderCellDetailsFromEndpoint";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import RemoveIcon from "@mui/icons-material/Remove";
import theme from "../../../../theme";
import { getSignalWordComponent } from "../../../../api/enums/signalWords";
import CustomDialog from "../../../../components/basic/CustomDialog";
import { useMutation, useQuery } from "react-query";
import { APIAlertContext } from "../../../../providers/alertProvider";
import { ADMIN_ROLE, ROLE } from "../../../../api/enums/userRoles";
import { authenticationService } from "../../../../services/authenticationService";
import Dropdown from "../../../../components/basic/Dropdown";
import { useForm } from "react-hook-form";
import PersonalReagentsFilter from "./PersonalReagentFilters";
import DownloadPdfButton from "../../../reports/DownloadPdfButton";
import { historyColumns } from "../../../history/History";
import { useNavigate } from "react-router-dom";
import { PersonalReagentInterface } from "../../../../api/interfaces/personalReagent.ts";
import { GridValidRowModel } from "@mui/x-data-grid/models/gridRows";
import { AxiosResponse } from "axios";
import { UserInterface } from "../../../../api/interfaces/user.ts";
import { GetWithPaginationResponse } from "../../../../api/interfaces/getWithPaginationResponse.ts";
import { LaboratoryInterface } from "../../../../api/interfaces/laboratory.ts";

interface PersonalReagentsCommonProps {
  query_key: string;
  query_fn: (
    limit?: number,
    page?: number,
    noPagination?: boolean,
    additionalParams?: string,
  ) => Promise<AxiosResponse | GetWithPaginationResponse>;
  title: string | JSX.Element;
  archived?: boolean;
  report_getter: (params: string) => Promise<AxiosResponse<any, any>>;
  disableChips?: boolean;
  meReagents?: boolean;
  visible: {
    id: boolean;
    reagent: boolean;
    producer: boolean;
    project_procedure: boolean;
    is_critical: boolean;
    main_owner: boolean;
    catalog_no: boolean;
    clp_classifications: boolean;
    is_usage_record_generated: boolean;
    lot_no: boolean;
    receipt_purchase_date: boolean;
    opening_date: boolean;
    expiration_date: boolean;
    disposal_utilization_date: boolean;
    laboratory: boolean;
    room: boolean;
    detailed_location: boolean;
    user_comment: boolean;
    signal_word: boolean;
    precautionary_statements: boolean;
    hazard_statements: boolean;
    concentration: boolean;
    purity_quality: boolean;
    actions: boolean;
  };
  actions: {
    details: boolean;
    edit: boolean;
    restore_archive: boolean;
    generate_usage_record: boolean;
    reagent_request: boolean;
    change_main_owner: boolean;
    delete: boolean;
  };
  filters?: {
    laboratory: boolean;
    project_procedure: boolean;
    reagent_type: boolean;
    is_critical: boolean;
    user: boolean;
    expiration_date: boolean;
    opening_date: boolean;
    receipt_purchase_date: boolean;
    reagent: boolean;
    producer: boolean;
    room: boolean;
    detailed_location: boolean;
    clp_classification: boolean;
    cas_no: boolean;
    is_usage_record_required: boolean;
    is_usage_record_generated: boolean;
  };
  history?: boolean;
  logsPage?: boolean;
}

function PersonalReagentsCommon(props: PersonalReagentsCommonProps) {
  const navigate = useNavigate();
  const { addAlert } = useContext(APIAlertContext);
  const [selectedReagent, setSelectedReagent] =
    useState<PersonalReagentInterface>();
  const [requestComment, setRequestComment] = useState("");
  const [mainOwnerChanged, setMainOwnerChanged] = useState<string>();
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [isChangeUserDialogOpen, setIsChangeUserDialogOpen] = useState(false);
  const handleOpenRequestDialog = (reagent: PersonalReagentInterface) => {
    setSelectedReagent(reagent);
    setIsRequestDialogOpen(true);
  };
  const handleOpenChangeUserDialog = (reagent: PersonalReagentInterface) => {
    setSelectedReagent(reagent);
    setIsChangeUserDialogOpen(true);
  };
  const [itemToDelete, setItemToDelete] = React.useState<number>();
  const { control, watch, setValue, reset, handleSubmit } = useForm({
    defaultValues: { is_archived: props.archived },
  });

  const { mutate: sendReagentRequestMutate } = useMutation(
    DataProviders.REAGENT_REQUESTS.createItem,
    {
      onSuccess: () => {
        addAlert("Zapytanie zostało wysłane", "success");
        navigate("/user-panel/reagents-passing");
      },
    },
  );

  const { mutate: deletePersonalReagentMutate } = useMutation(
    DataProviders.PERSONAL_REAGENTS.deleteItem,
    {
      onSuccess: () => {
        addAlert(Names.removed, "success");
      },
    },
  );

  const { mutate: updatePersonalReagentMutate } = useMutation(
    DataProviders.PERSONAL_REAGENTS.updateItem,
    {
      onSuccess: () => {
        addAlert(Names.updated_reagent, "success");
      },
    },
  );
  const { currentUserRoles, currentUserData } = authenticationService;

  const { data: usersData } = useQuery("getUsersData", () =>
    currentUserRoles.some((r) =>
      [ADMIN_ROLE, ROLE.LAB_MANAGER, ROLE.PROCEDURE_MANAGER].includes(r),
    )
      ? DataProviders.USERS.getItemList(0, 0, true)
      : null,
  );

  const handleRequestSubmit = async () => {
    sendReagentRequestMutate({
      personal_reagent: selectedReagent?.id,
      requester_comment: requestComment,
    });

    setIsRequestDialogOpen(false);
  };

  const handleChangeUserSubmit = async () => {
    updatePersonalReagentMutate({
      id: selectedReagent?.id,
      main_owner: mainOwnerChanged as unknown as number,
    });

    setIsChangeUserDialogOpen(false);
  };

  const possibleAdminAction = (reagent: PersonalReagentInterface) => {
    return (
      currentUserRoles.some((r) =>
        [ADMIN_ROLE, ROLE.LAB_MANAGER].includes(r),
      ) ||
      (currentUserRoles?.includes(ROLE.PROCEDURE_MANAGER) &&
        reagent?.project_procedure_manager_id === currentUserData?.id)
    );
  };

  const [columnVisibilityModel, setColumnVisibilityModel] =
    React.useState<GridColumnVisibilityModel>({
      precautionary_statements: false,
      hazard_statements: false,
    });

  const actions = (params: { row: PersonalReagentInterface }) =>
    [
      {
        id: "details",
        name: Names.details,
        handler: () => {
          navigate("/personal-reagents/" + params.row.id);
        },
      },
      ...(possibleAdminAction(params.row)
        ? [
            {
              id: "change_main_owner",
              name: "Zmień głównego użytkownika",
              handler: () => handleOpenChangeUserDialog(params.row),
            },
          ]
        : []),
      ...(possibleAdminAction(params.row) || props.meReagents
        ? [
            {
              id: "generate_usage_record",
              name: Names.generate_usage_record,
              handler: () => {
                addAlert("Generowanie karty rozchodu...", "info");
                generateAndShowUsageRecord(params.row.id)
                  .then(() => {
                    addAlert(
                      "Karta rozchodu została pomyślnie wygenerowana",
                      "success",
                    );
                  })
                  .catch(() => {
                    addAlert(
                      "Wystąpił błąd podczas generowania karty rozchodu",
                      "error",
                    );
                  });
              },
            },
            {
              id: "edit",
              name: "Edytuj",
              handler: () => {
                navigate("/personal-reagents/" + params.row.id + "/edit");
              },
            },

            params.row.is_archived
              ? {
                  id: "restore_archive",
                  name: "Przywróć",
                  handler: () => {
                    updatePersonalReagentMutate({
                      id: params.row.id,
                      is_archived: false,
                    });
                  },
                }
              : {
                  id: "restore_archive",
                  name: "Zarchiwizuj",
                  handler: () => {
                    updatePersonalReagentMutate({
                      id: params.row.id,
                      is_archived: true,
                    });
                  },
                },
          ]
        : []),
      {
        id: "reagent_request",
        name: "Wyślij prośbę o przekazanie",
        handler: () => handleOpenRequestDialog(params.row),
      },
      {
        id: "delete",
        name: Names.delete,
        handler: () => {
          setItemToDelete(params.row.id);
        },
      },
    ].filter(
      (item) => item && props.actions[item.id as keyof typeof props.actions],
    );

  const columns: GridValidRowModel[] = [
    ...(!props.history
      ? [
          {
            field: "actions",
            headerName: Names.actions,
            width: 55,
            sortable: false,
            renderCell: (params: { row: PersonalReagentInterface }) => (
              <>
                <CustomMenu items={actions({ row: params.row })} />
              </>
            ),
          },
        ]
      : []),
    {
      field: "reagent",
      headerName: Names.reagent,
      width: 250,
      renderCell: (params: {
        value: { id: number; repr: string };
        colDef: { computedWidth: number };
      }) =>
        renderCellDetailsFromEndpoint({
          getDetails: DataProviders.REAGENTS.getItem,
          ...params,
        }),
      sortable: true,
    },
    {
      field: "is_usage_record_generated",
      headerName: Names.is_usage_record_generated,
      width: 190,
      sortable: false,
      renderCell: (params: { row: PersonalReagentInterface }) => (
        <>
          {params.row.is_usage_record_generated ? (
            <DoneIcon style={{ color: theme.palette.success.main }} />
          ) : !params.row.is_usage_record_required ? (
            <RemoveIcon />
          ) : (
            <>
              <CloseIcon style={{ color: theme.palette.error.main }} />
              <Typography style={{ color: theme.palette.error.main }}>
                <strong>Nie wygenerowano karty rozchodu!</strong>
              </Typography>
            </>
          )}
        </>
      ),
    },
    ...(!props.history
      ? [
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
        ]
      : []),
    {
      field: "concentration",
      headerName: Names.concentration,
      width: 100,
      renderCell: (params: { row: PersonalReagentInterface }) =>
        params.row.concentration?.repr,
      sortable: false,
    },
    {
      field: "purity_quality",
      headerName: Names.purity_quality,
      width: 100,
      renderCell: (params: { row: PersonalReagentInterface }) =>
        params.row.purity_quality?.repr,
      sortable: false,
    },
    {
      field: "project_procedure",
      headerName: Names.project_procedure,
      width: 160,
      renderCell: (params: {
        value: { id: number; repr: string };
        colDef: { computedWidth: number };
      }) =>
        renderCellDetailsFromEndpoint({
          getDetails: DataProviders.PROJECT_PROCEDURES.getItem,
          ...params,
        }),
      sortable: false,
    },
    {
      field: "is_critical",
      headerName: Names.is_critical,
      width: 125,
      type: "boolean",
      sortable: false,
    },
    {
      field: "main_owner",
      headerName: Names.main_owner,
      width: 150,
      renderCell: (params: { row: PersonalReagentInterface }) =>
        params.row.main_owner?.repr,
      sortable: true,
    },
    {
      field: "signal_word",
      headerName: Names.signal_word,
      width: 250,
      renderCell: (params: { row: PersonalReagentInterface }) =>
        getSignalWordComponent(params.row.signal_word),
      sortable: false,
    },
    ...(!props.history
      ? [
          {
            field: "clp_classifications",
            headerName: Names.clp_classifications,
            width: 280,
            renderCell: (params: { row: PersonalReagentInterface }) => (
              <Grid container spacing={0.25}>
                {params.row.clp_classifications?.map(
                  (item: { id: number; repr: string }) =>
                    item && (
                      <CustomReagentTooltip
                        type="clp"
                        size={10}
                        item={item}
                        getDetails={DataProviders.CLP_CLASSIFICATIONS.getItem}
                      />
                    ),
                )}
              </Grid>
            ),
            sortable: false,
          },
        ]
      : []),
    {
      field: "precautionary_statements",
      headerName: Names.precautionary_statements,
      width: 220,
      visible: false,
      renderCell: (params: { row: PersonalReagentInterface }) => (
        <Grid container spacing={0.25}>
          {params.row.precautionary_statements?.map(
            (item: { id: number; repr: string }) =>
              item && (
                <CustomReagentTooltip
                  type="P"
                  size={10}
                  item={item}
                  getDetails={DataProviders.PRECAUTIONARY_STATEMENT.getItem}
                />
              ),
          )}
        </Grid>
      ),
      sortable: false,
    },
    {
      field: "hazard_statements",
      headerName: Names.hazard_statements,
      width: 220,
      renderCell: (params: { row: PersonalReagentInterface }) => (
        <Grid container spacing={0.25}>
          {params.row.hazard_statements?.map(
            (hazard: { id: number; repr: string }) =>
              hazard && (
                <CustomReagentTooltip
                  type="H"
                  size={10}
                  item={hazard}
                  getDetails={DataProviders.HAZARD_STATEMENTS.getItem}
                />
              ),
          )}
        </Grid>
      ),
      sortable: false,
    },
    ...(!props.history
      ? [
          {
            field: "catalog_no",
            headerName: Names.catalog_no,
            width: 125,
            renderCell: renderCellExpand,
            sortable: true,
          },
        ]
      : []),

    {
      field: "lot_no",
      headerName: Names.lot_no,
      width: 125,
      renderCell: renderCellExpand,
      sortable: true,
    },
    {
      field: "receipt_purchase_date",
      headerName: Names.receipt_purchase_date,
      width: 125,
      renderCell: renderCellExpand,
      sortable: true,
    },
    {
      field: "opening_date",
      headerName: Names.opening_date,
      width: 125,
      renderCell: renderCellExpand,
      sortable: true,
    },
    {
      field: "expiration_date",
      headerName: Names.expiration_date,
      width: 125,
      renderCell: renderCellExpand,
      sortable: true,
    },
    {
      field: "disposal_utilization_date",
      headerName: Names.disposal_utilization_date,
      width: 125,
      renderCell: renderCellExpand,
      sortable: true,
    },
    {
      field: "laboratory",
      headerName: Names.laboratory,
      width: 125,
      renderCell: (params: { row: PersonalReagentInterface }) =>
        params.row.laboratory?.repr,
      sortable: false,
    },
    {
      field: "room",
      headerName: Names.room,
      width: 125,
      renderCell: renderCellExpand,
      sortable: true,
    },
    {
      field: "detailed_location",
      headerName: Names.detailed_location,
      width: 125,
      renderCell: renderCellExpand,
      sortable: true,
    },
    {
      field: "user_comment",
      headerName: Names.user_comment,
      width: 125,
      renderCell: renderCellExpand,
      sortable: false,
    },
  ].filter((item) => item);
  const exportButton = (
    <DownloadPdfButton
      report_getter={props.report_getter}
      report_file_name={Names.personal_reagents_report_name}
      handleSubmit={handleSubmit}
      buttonLabel="Eksportuj do PDF"
      buttonLoadingLabel="Trwa eksportowanie do PDF ..."
    />
  );

  const columnsToShow = [
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
    ...columns.filter(
      (item) => props.visible[item.field as keyof typeof props.visible],
    ),
  ];

  return (
    <>
      {DashboardCard({
        title: props.title,
        content: (
          <>
            {!props.history && (
              <PersonalReagentsFilter
                control={control}
                setValue={setValue}
                reset={reset}
                filters={props.filters}
              />
            )}

            <DataGridPagination
              columns={columnsToShow as GridColDef[]}
              query_key={props.query_key}
              query_fn={props.query_fn}
              queryParams={
                watch() as { [key: string]: string | string[] | undefined }
              }
              logsPage={props.logsPage}
              historyData={props.history}
              columnVisibilityModel={columnVisibilityModel}
              onColumnVisibilityModelChange={(
                newModel: React.SetStateAction<GridColumnVisibilityModel>,
              ) => setColumnVisibilityModel(newModel)}
              beforeDataGrid={
                !props.history && (
                  <Box sx={{ paddingBottom: "20px" }}>{exportButton}</Box>
                )
              }
            />
          </>
        ),
      })}
      {
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
            deletePersonalReagentMutate({ id: itemToDelete });
            setItemToDelete(undefined);
          }}
          firstButtonLabel={Names.delete}
          secondButtonHandler={() => setItemToDelete(undefined)}
          secondButtonLabel={Names.cancel}
        />
      }
      {props.actions.reagent_request && (
        <>
          <CustomDialog
            open={isRequestDialogOpen}
            setDialogOpen={setIsRequestDialogOpen}
            title="Prośba o przekazanie odczynnika"
            content={
              <>
                <Typography variant="h6" gutterBottom component="div">
                  <b>{Names.reagent}: </b>
                  <CustomReagentTooltip
                    type="reagent"
                    item={
                      selectedReagent?.reagent as { id: number; repr: string }
                    }
                    getDetails={DataProviders.REAGENTS.getItem}
                  />
                </Typography>
                <Typography variant="h6" gutterBottom component="div">
                  <b>{Names.producer}: </b>
                  <CustomReagentTooltip
                    type="producer"
                    item={
                      selectedReagent?.producer as { id: number; repr: string }
                    }
                    getDetails={DataProviders.PRODUCERS.getItem}
                  />
                </Typography>
                <Typography variant="h6">
                  <strong>{Names.main_owner}:</strong>{" "}
                  {selectedReagent ? selectedReagent.main_owner?.repr : ""}
                </Typography>
                <Typography variant="h6">
                  <strong>{Names.laboratory}:</strong>{" "}
                  {selectedReagent ? selectedReagent.laboratory.repr : ""}
                </Typography>
                <Typography variant="h6">
                  <strong>{Names.room}:</strong>{" "}
                  {selectedReagent ? selectedReagent.room : ""}
                </Typography>
                <Typography variant="h6">
                  <strong>{Names.detailed_location}:</strong>{" "}
                  {selectedReagent ? selectedReagent.detailed_location : ""}
                </Typography>
                <Divider style={{ margin: "20px 0" }} />

                <Typography variant="body1">
                  <strong>{Names.comment}:</strong>
                </Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  value={requestComment}
                  onChange={(e) => setRequestComment(e.target.value)}
                />
              </>
            }
            firstButtonLabel="Wyślij"
            firstButtonHandler={handleRequestSubmit}
            secondButtonLabel="Anuluj"
            secondButtonHandler={() => setIsRequestDialogOpen(false)}
          />
          <CustomDialog
            open={isChangeUserDialogOpen}
            setDialogOpen={setIsChangeUserDialogOpen}
            title="Zmiana głównego użytkownika odczynnika"
            content={
              <>
                <Typography variant="h6" gutterBottom component="div">
                  <b>{Names.reagent}: </b>
                  <CustomReagentTooltip
                    type="reagent"
                    item={selectedReagent?.reagent}
                    getDetails={DataProviders.REAGENTS.getItem}
                  />
                </Typography>
                <Typography variant="h6">
                  <strong>Obecny {Names.main_owner}:</strong>{" "}
                  {selectedReagent ? selectedReagent.main_owner?.repr : ""}
                </Typography>
                <Box sx={{ height: "20px" }} />
                <Typography variant="h6">
                  Wybierz nowego głównego użytkownika z listy:
                </Typography>

                <Dropdown
                  label={`${Names.main_owner} (${Names.id} - ${Names.username})`}
                  value={mainOwnerChanged}
                  onChange={(e) => {
                    setMainOwnerChanged(e.target.value);
                  }}
                  id="main_owner"
                  items={
                    (usersData as AxiosResponse)?.data?.map(
                      (item: UserInterface) => ({
                        name: `${item.id} - ${item.username}`,
                        value: item.id,
                      }),
                    ) || []
                  }
                />
              </>
            }
            firstButtonLabel="Wyślij"
            firstButtonHandler={handleChangeUserSubmit}
            secondButtonLabel="Anuluj"
            secondButtonHandler={() => setIsChangeUserDialogOpen(false)}
          />
        </>
      )}
    </>
  );
}

export default PersonalReagentsCommon;

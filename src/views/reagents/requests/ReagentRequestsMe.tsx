import { useContext, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";

import DashboardCard from "../../../components/basic/DashboardCard.tsx";
import { deleteReagentRequest } from "../../../api/dataProviders/dataProviders.ts";
import { Names } from "../../../api/common/dataNames.ts";
import DataGridPagination from "../../../components/datagrid/DataGridPagination.tsx";
import CustomMenu from "../../../components/basic/CustomMenu.tsx";
import { renderCellExpand } from "../../../components/datagrid/GridCellExpand.tsx";
import { useMutation } from "react-query";
import {
  getReagentRequestStatusName,
  REAGENT_REQUEST_STATUS,
} from "../../../api/enums/reagentRequestStatus";
import Dropdown from "../../../components/basic/Dropdown";
import { Typography } from "@mui/material";
import { DataProviders } from "../../../api/dataProviders/DataProvider.ts";
import { APIAlertContext } from "../../../providers/alertProvider";
import { GridValidRowModel } from "@mui/x-data-grid/models/gridRows";

function ReagentRequestsMe() {
  const { addAlert } = useContext(APIAlertContext);

  const { mutate: deleteReagentRequestMutate } = useMutation(
    deleteReagentRequest,
    {
      onSuccess: () => {
        addAlert(Names.removed, "success");
      },
    },
  );

  const actions = (params: { row: { id: number } }) => [
    {
      name: "Usuń",
      handler: () => {
        deleteReagentRequestMutate({ id: params.row.id });
      },
    },
  ];

  const columns: GridValidRowModel[] = [
    { field: "id", headerName: "ID", width: 70, sortable: true },
    {
      field: "change_status_date",
      headerName: Names.change_status_date,
      width: 260,
      renderCell: renderCellExpand,
      sortable: true,
    },
    {
      field: "personal_reagent",
      headerName: Names.reagent + " " + Names.id,
      width: 150,
      renderCell: renderCellExpand,
      sortable: false,
    },
    {
      field: "reagent_name",
      headerName: Names.reagent_name,
      width: 200,
      renderCell: renderCellExpand,
      sortable: false,
    },
    {
      field: "requester_comment",
      headerName: Names.requester_comment,
      width: 190,
      renderCell: renderCellExpand,
      sortable: false,
    },
    {
      field: "responder_comment",
      headerName: Names.responder_comment,
      width: 190,
      renderCell: renderCellExpand,
      sortable: false,
    },
    {
      field: "status",
      headerName: Names.status,
      width: 200,
      renderCell: (params: { row: { status: string } }) =>
        getReagentRequestStatusName(params.row.status),
      sortable: false,
    },
    {
      field: "actions",
      headerName: Names.actions,
      width: 55,
      sortable: false,
      renderCell: (params: { row: { id: number } }) => (
        <>
          <CustomMenu items={actions({ row: params.row })} />
        </>
      ),
    },
  ];
  const [statusFilter, setStatusFilter] = useState<string>(
    REAGENT_REQUEST_STATUS.AWAITING_APPROVAL,
  );
  const statusList = Object.keys(REAGENT_REQUEST_STATUS).map((key) => ({
    name:
      getReagentRequestStatusName(
        REAGENT_REQUEST_STATUS[key as keyof typeof REAGENT_REQUEST_STATUS],
      ) || "",
    value:
      REAGENT_REQUEST_STATUS[
        key as keyof typeof REAGENT_REQUEST_STATUS
      ].toString(),
  }));

  const content = (
    <>
      <Typography
        variant="body1"
        gutterBottom
        component="div"
        sx={{ margin: "5px 0 30px 0" }}
      >
        {Names.reagent_requests_description}
      </Typography>
      <Dropdown
        sx={{ width: "30%", marginBottom: "20px" }}
        label={Names.status}
        value={statusFilter}
        onChange={(e) => {
          if (e.target.value !== statusFilter)
            setStatusFilter(e.target.value as unknown as string);
        }}
        id="status"
        items={statusList}
      />
      <DataGridPagination
        columns={columns as GridColDef[]}
        query_key={`getPersonalReagentsRequestMeMutate`}
        query_fn={DataProviders.REAGENT_REQUESTS_ME.getItemList}
        queryParams={{ status: statusFilter }}
      />
    </>
  );

  return DashboardCard({ title: "Wysłane prośby", content: content });
}

export default ReagentRequestsMe;

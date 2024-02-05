import * as React from "react";
import { useContext } from "react";
import { Typography } from "@mui/material";

import DashboardCard from "../../components/basic/DashboardCard.tsx";
import { Names } from "../../api/common/dataNames";
import {
  DataProviders,
  getDataProviderByName,
} from "../../api/dataProviders/DataProvider.ts";
import DataGridPagination from "../../components/datagrid/DataGridPagination";
import { renderCellExpand } from "../../components/datagrid/GridCellExpand";
import CustomMenu from "../../components/basic/CustomMenu";
import { GridColDef } from "@mui/x-data-grid";
import { APIAlertContext } from "../../providers/alertProvider";
import { useNavigate } from "react-router-dom";
import { ReagentsWaitingForApprovalNotificationsInterface } from "../../api/interfaces/reagentsWaitingForApprovalNotifications.ts";
import { GridValidRowModel } from "@mui/x-data-grid/models/gridRows";

function ReagentsWaitingForApprovalNotifications(props: {
  style?: React.CSSProperties;
}) {
  const navigate = useNavigate();
  const { addAlert } = useContext(APIAlertContext);
  const actions = (params: {
    row: ReagentsWaitingForApprovalNotificationsInterface;
  }) => [
    {
      name: "Zaakceptuj do użytku",
      handler: () => {
        getDataProviderByName(params.row.table_name)
          ?.updateItem({
            id: params.row.pk,
            is_validated_by_admin: true,
          })
          .then(() => addAlert(Names.updated, "success"))
          .catch(() => addAlert(Names.error_occurred, "error"));
      },
    },
    {
      name: Names.edit,
      handler: () => {
        navigate(
          `/${getDataProviderByName(params.row.table_name)?.endpoint}/` +
            params.row.id +
            "/edit",
        );
      },
    },
  ];

  const columns: GridValidRowModel[] = [
    {
      field: "table_name",
      headerName: Names.table_name,
      width: 300,
      renderCell: (params: {
        row: ReagentsWaitingForApprovalNotificationsInterface;
      }) =>
        Names[params.row.table_name as keyof typeof Names] ||
        params.row.table_name,
      sortable: false,
    },
    {
      field: "pk",
      headerName: Names.id,
      width: 300,
      renderCell: renderCellExpand,
      sortable: false,
    },
    {
      field: "value",
      headerName: Names.name,
      width: 300,
      renderCell: renderCellExpand,
      sortable: false,
    },
    {
      field: "actions",
      headerName: Names.actions,
      width: 55,
      sortable: false,
      renderCell: (params: {
        row: ReagentsWaitingForApprovalNotificationsInterface;
      }) => (
        <>
          <CustomMenu items={actions({ row: params.row })} />
        </>
      ),
    },
  ];

  return DashboardCard({
    title: Names.fields_awaiting_for_approval,
    content: (
      <DataGridPagination
        disableSearchBar
        columns={columns as GridColDef[]}
        query_key="getReagentsWaitingForApprovalNotifications"
        query_fn={DataProviders.REAGENTS_PENDING_VALIDATION_FIELDS.getItemList}
        minHeight="350px"
        pageSize={5}
        noDataContent={<Typography>{Names.all_fields_verified}</Typography>}
      />
    ),
    ...props,
  });
}

export default ReagentsWaitingForApprovalNotifications;

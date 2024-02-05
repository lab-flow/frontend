import React, { useState } from "react";
import { useQuery } from "react-query";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Pagination,
  Typography,
} from "@mui/material";

import DashboardCard from "../../components/basic/DashboardCard.tsx";
import "../../api/dataProviders/dataProviders.ts";
import { Names } from "../../api/common/dataNames.ts";
import { DataProviders } from "../../api/dataProviders/DataProvider.ts";
import NotificationListItem from "./NotificationListItem";
import { useNavigate } from "react-router-dom";
import { GetWithPaginationResponse } from "../../api/interfaces/getWithPaginationResponse.ts";
import { FewCriticalNotificationsInterface } from "../../api/interfaces/fewCriticalNotifications.ts";

function FewCriticalNotifications(props: { style?: React.CSSProperties }) {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const maxItemsPerPage = 8;
  const { data, refetch, isFetching } = useQuery(
    "getFewCriticalNotifications",
    () =>
      DataProviders.FEW_CRITICAL_NOTIFICATIONS.getItemList(
        maxItemsPerPage,
        page - 1,
      ) as unknown as GetWithPaginationResponse,
  );
  const pagesCount = data?.pagesCount || 1;
  return DashboardCard({
    title: Names.few_critical_notifications,
    refreshEnabled: true,
    refreshData: refetch,
    isLoading: isFetching,
    content: (
      <>
        <Box sx={{ minHeight: "80%" }}>
          <List sx={{ width: "100%", bgcolor: "background.paper" }}>
            {data?.results?.map((item: FewCriticalNotificationsInterface) => (
              <NotificationListItem
                key={item.reagent_id.toString()}
                onClick={() => {
                  navigate("/personal-reagents/" + item.reagent_id);
                }}
                content={
                  <ListItem key={item.reagent_id}>
                    <ListItemText
                      primary={item.reagent_name}
                      secondary={`${Names.left}: ${item.count}`}
                    />
                  </ListItem>
                }
              />
            ))}
          </List>
        </Box>
        {pagesCount > 1 && (
          <Pagination
            count={data?.pagesCount}
            page={page}
            onChange={(_event, value) => setPage(value)}
          />
        )}
        {data?.results?.length === 0 && (
          <Typography variant="subtitle1">{Names.no_data_to_show}</Typography>
        )}
      </>
    ),
    ...props,
  });
}

export default FewCriticalNotifications;

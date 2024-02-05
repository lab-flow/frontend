import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import {
  Box,
  CardContent,
  Pagination,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";

import DashboardCard from "../../components/basic/DashboardCard.tsx";
import "../../api/dataProviders/dataProviders.ts";
import { Names } from "../../api/common/dataNames.ts";
import { DataProviders } from "../../api/dataProviders/DataProvider.ts";
import NotificationListItem from "./NotificationListItem";
import { useNavigate } from "react-router-dom";
import { GetWithPaginationResponse } from "../../api/interfaces/getWithPaginationResponse.ts";
import { GenerateUsageRecordNotification } from "../../api/interfaces/generateUsageRecordNotification.ts";

function UsageRecordNotifications(props: { style?: React.CSSProperties }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const [content, setContent] = useState(<></>);
  const [page, setPage] = useState(1);
  const maxItemsPerPage = 8;
  const { data, refetch, isFetching, isLoading } = useQuery(
    "getGenerateUsageRecordNotifications",
    () =>
      DataProviders.GENERATE_USAGE_RECORD_NOTIFICATIONS.getItemList(
        maxItemsPerPage,
        page - 1,
      ) as unknown as GetWithPaginationResponse,
  );

  const prepareUsageRecordNotifications = (
    notifications: Array<GenerateUsageRecordNotification>,
  ) => {
    return notifications.map((notification) => ({
      reagent_id: notification.id,
      id: `${notification.id}-usage-record`,
      reagent_name: notification.reagent_name,
    }));
  };

  useEffect(() => {
    refetch();
  }, [page]);

  useEffect(() => {
    if (data?.results && data?.results?.length > 0) {
      setContent(
        <>
          <Typography variant="h6">
            <b>{Names.generate_usage_record_for_reagents}:</b>
          </Typography>
          <Box sx={{ minHeight: "555px" }}>
            {prepareUsageRecordNotifications(data?.results).map(
              (notification) => (
                <NotificationListItem
                  key={notification?.id}
                  onClick={() => {
                    navigate("/personal-reagents/" + notification.reagent_id);
                  }}
                  content={
                    <>
                      <ErrorIcon
                        style={{
                          color: theme.palette.error.main,
                          margin: "0 0 10px 0",
                        }}
                      />
                      <CardContent>
                        <Stack>
                          <Typography variant="h6">
                            {notification?.reagent_name}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </>
                  }
                />
              ),
            )}
          </Box>
          {data?.pagesCount > 1 && (
            <Pagination
              count={data?.pagesCount}
              page={page}
              onChange={(_event, value) => setPage(value)}
            />
          )}
        </>,
      );
    } else {
      setContent(
        <Typography lineHeight={2}>
          {Names.all_reagents_have_generated_usage_record}
        </Typography>,
      );
    }
  }, [
    data,
    navigate,
    page,
    theme.palette.error.main,
    theme.palette.info.main,
    theme.palette.warning.main,
  ]);

  return DashboardCard({
    title: Names.title_usage_record_notifications,
    isLoading: isFetching || isLoading,
    content,
    refreshEnabled: true,
    refreshData: () => {
      refetch();
    },
    ...props,
  });
}

export default UsageRecordNotifications;

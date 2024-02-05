import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Badge, Box, CardContent, Typography, useTheme } from "@mui/material";

import DashboardCard from "../../components/basic/DashboardCard.tsx";
import { Names } from "../../api/common/dataNames.ts";
import { DataProviders } from "../../api/dataProviders/DataProvider.ts";
import {
  DateCalendar,
  DayCalendarSkeleton,
  LocalizationProvider,
  PickersDay,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/pl";
import { useNavigate } from "react-router-dom";
import { AxiosResponse } from "axios";
import { ExpirationDateNotificationsInterface } from "../../api/interfaces/expirationDateNotifications.ts";

function ServerDay(props: {
  highlightedDays?: object;
  day: Dayjs;
  outsideCurrentMonth: never;
  onDaySelect: (date: Dayjs) => void;
  isFirstVisibleCell: boolean;
  isLastVisibleCell: boolean;
}) {
  const {
    highlightedDays = {},
    day,
    outsideCurrentMonth,
    onDaySelect,
    isFirstVisibleCell,
    isLastVisibleCell,
    ...other
  } = props;
  const currentDayReagents = !outsideCurrentMonth
    ? highlightedDays[day.format("YYYY-MM-DD") as keyof typeof highlightedDays]
    : [];
  return (
    <Badge
      key={props.day.toString()}
      color="info"
      badgeContent={currentDayReagents?.length}
      invisible={!currentDayReagents?.length}
    >
      <PickersDay
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
        onDaySelect={onDaySelect}
        isFirstVisibleCell={isFirstVisibleCell}
        isLastVisibleCell={isLastVisibleCell}
        {...other}
      />
    </Badge>
  );
}

function ExpirationDateNotifications(props: { style?: React.CSSProperties }) {
  const navigate = useNavigate();
  const requestAbortController = React.useRef<AbortController | null>(null);
  const [highlightedDays, setHighlightedDays] = React.useState<{
    [key: string]: object[];
  }>({});
  const [date, setDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const { data, refetch, isFetching } = useQuery(
    "getCloseExpirationDateNotifications",
    () =>
      DataProviders.CLOSE_EXPIRATION_DATE_NOTIFICATIONS.getItemList(
        0,
        0,
        true,
        `year=${date.year()}&month=${date.month() + 1}`,
      ),
  );

  useEffect(() => {
    refetch();
  }, [date, refetch]);

  useEffect(() => {
    const highlightedDays: { [key: string]: Array<object> } = {};

    data &&
      Object.values((data as AxiosResponse)?.data)?.forEach((item) => {
        const { expiration_date, reagent_name, id } =
          item as ExpirationDateNotificationsInterface;

        if (expiration_date) {
          const expirationDate = dayjs(expiration_date);
          const highlightedKey = expirationDate.format("YYYY-MM-DD");

          highlightedDays[highlightedKey] ||= [];
          highlightedDays[highlightedKey].push({ reagent_name, id });
        }
      });

    setHighlightedDays(highlightedDays);
  }, [data]);

  const onDateChange = (date: Dayjs) => {
    if (requestAbortController.current) {
      requestAbortController.current.abort();
    }
    setDate(date);
    setHighlightedDays({});
  };

  const theme = useTheme();
  const content = useMemo(
    () => (
      <>
        <LocalizationProvider
          adapterLocale="pl"
          {...theme}
          dateAdapter={AdapterDayjs}
        >
          <DateCalendar
            maxDate={dayjs().add(10, "year")}
            minDate={dayjs("1900-01-01")}
            loading={isFetching}
            onMonthChange={onDateChange}
            onYearChange={onDateChange}
            renderLoading={() => <DayCalendarSkeleton />}
            slots={
              {
                day: ServerDay,
              } as any
            }
            onChange={(date) => {
              setSelectedDate(date ? date : dayjs());
            }}
            slotProps={{
              day: {
                highlightedDays,
              } as any,
            }}
          />
        </LocalizationProvider>
        <Typography variant="h6" sx={{ margin: "10px 0 0 0" }}>
          Odczynniki z datą ważności <b>{selectedDate.format("YYYY-MM-DD")}:</b>
        </Typography>

        <Box sx={{ maxHeight: "225px", overflowY: "auto" }}>
          {highlightedDays[
            selectedDate.format("YYYY-MM-DD") as keyof typeof highlightedDays
          ] ? (
            highlightedDays[
              selectedDate.format("YYYY-MM-DD") as keyof typeof highlightedDays
            ].map((data) => (
              <Box
                key={(data as ExpirationDateNotificationsInterface)?.id}
                sx={{
                  padding: "0 20px",
                  display: "flex",
                  alignItems: "center",
                  transition: "background-color 0.3s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f0f2f5";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "inherit";
                }}
                onClick={() => {
                  navigate(
                    "/personal-reagents/" +
                      (data as ExpirationDateNotificationsInterface)?.id,
                  );
                }}
              >
                <CardContent>
                  <Typography variant="h6">
                    {
                      (data as ExpirationDateNotificationsInterface)
                        ?.reagent_name
                    }
                  </Typography>
                </CardContent>
              </Box>
            ))
          ) : (
            <Typography variant="h6" sx={{ margin: "15px 0 0 30px" }}>
              <i>Brak odczynników z podaną datą ważności.</i>
            </Typography>
          )}
        </Box>
      </>
    ),
    [theme, isFetching, highlightedDays, selectedDate, navigate],
  );

  return DashboardCard({
    title: Names.title_expiration_date,
    content,
    refreshEnabled: false,
    ...props,
  });
}

export default ExpirationDateNotifications;

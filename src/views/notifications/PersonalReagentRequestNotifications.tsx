import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import {
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Pagination,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import DashboardCard from "../../components/basic/DashboardCard.tsx";
import { updateReagentRequestByResponder } from "../../api/dataProviders/dataProviders.ts";
import { Names } from "../../api/common/dataNames.ts";
import { REAGENT_REQUEST_STATUS } from "../../api/enums/reagentRequestStatus.ts";
import CustomDialog from "../../components/basic/CustomDialog.tsx";
import { DataProviders } from "../../api/dataProviders/DataProvider.ts";
import { APIAlertContext } from "../../providers/alertProvider";
import { PersonalReagentRequestNotificationsInterface } from "../../api/interfaces/personalReagentRequestNotifications.ts";
import { GetWithPaginationResponse } from "../../api/interfaces/getWithPaginationResponse.ts";

function PersonalReagentRequestNotifications(props: {
  style?: React.CSSProperties;
}) {
  const [content, setContent] = useState(<></>);
  const [selectedRequest, setSelectedRequest] =
    useState<PersonalReagentRequestNotificationsInterface>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { addAlert } = useContext(APIAlertContext);
  const maxItemsPerPage = 4;
  const [page, setPage] = useState(1);

  const { data, refetch, isFetching, isLoading } = useQuery(
    "getPersonalReagentsRequestNotification",
    () =>
      DataProviders.PERSONAL_REAGENT_REQUEST_NOTIFICATIONS.getItemList(
        maxItemsPerPage,
        page - 1,
        false,
        `status=AA`,
      ) as unknown as GetWithPaginationResponse,
  );
  const handleAccept = async () => {
    if (selectedRequest) {
      await updateReagentRequestByResponder({
        id: selectedRequest.id,
        status: REAGENT_REQUEST_STATUS.APPROVED,
        responder_comment: selectedRequest.responder_comment || "",
      });
      await refetch();
      setIsDialogOpen(false);
      addAlert(Names.reagent_request_accepted, "success");
    }
  };

  const handleReject = async () => {
    if (selectedRequest) {
      await updateReagentRequestByResponder({
        id: selectedRequest.id,
        status: REAGENT_REQUEST_STATUS.REJECTED,
        responder_comment: selectedRequest.responder_comment || "",
      });
      await refetch();
      setIsDialogOpen(false);
      addAlert(Names.reagent_request_rejected, "success");
    }
  };

  useEffect(() => {
    refetch();
  }, [page, refetch]);

  useEffect(() => {
    if (data?.results && data?.results?.length > 0) {
      setContent(
        <Stack>
          <Stack spacing={2} sx={{ minHeight: "580px" }}>
            {data?.results.map(
              (el: PersonalReagentRequestNotificationsInterface) => (
                <Card
                  key={el.id}
                  onClick={() => {
                    setSelectedRequest(el);
                    setIsDialogOpen(true);
                  }}
                  variant="outlined"
                >
                  <CardActionArea>
                    <CardContent>
                      <Stack>
                        <Typography>
                          <b>
                            {Names.reagent_name}: {el.reagent_name}
                          </b>
                        </Typography>
                        <Typography>
                          {Names.requester}: {el.requester_name}
                        </Typography>
                        <Typography>
                          {Names.comment}: {el.requester_comment}
                        </Typography>
                        <Typography>
                          {Names.change_status_date}: {el.change_status_date}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ),
            )}
          </Stack>
          {data?.pagesCount > 1 && (
            <Pagination
              count={data?.pagesCount}
              page={page}
              onChange={(_event, value) => setPage(value)}
            />
          )}
        </Stack>,
      );
    } else {
      setContent(
        <Stack spacing={2}>
          <Typography variant="body1" lineHeight={2}>
            Brak nowych powiadomień.
          </Typography>
        </Stack>,
      );
    }
  }, [data]);

  return (
    <>
      {DashboardCard({
        title: "Prośby o przekazanie odczynników",
        isLoading: isFetching || isLoading,
        content,
        refreshEnabled: true,
        refreshData: () => {
          refetch();
        },
        ...props,
      })}
      {selectedRequest && (
        <CustomDialog
          open={isDialogOpen}
          setDialogOpen={setIsDialogOpen}
          title="Prośba o przekazanie odczynnika"
          content={
            <>
              <Typography>
                <b>
                  {Names.reagent_name}: {selectedRequest.reagent_name}
                </b>
              </Typography>
              <Typography>
                {Names.requester}: {selectedRequest.requester_name}
              </Typography>
              <Typography>
                {Names.requester_comment}: {selectedRequest.requester_comment}
              </Typography>
              <Typography>
                {Names.change_status_date}: {selectedRequest.change_status_date}
              </Typography>
              <Divider style={{ margin: "20px 0" }} />

              <Typography variant="body1">{Names.comment}:</Typography>
              <TextField
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={selectedRequest.responder_comment}
                onChange={(e) =>
                  setSelectedRequest({
                    ...selectedRequest,
                    responder_comment: e.target.value,
                  })
                }
              />
            </>
          }
          firstButtonLabel={Names.accept}
          firstButtonHandler={handleAccept}
          secondButtonLabel={Names.reject}
          secondButtonHandler={handleReject}
        />
      )}
    </>
  );
}

export default PersonalReagentRequestNotifications;

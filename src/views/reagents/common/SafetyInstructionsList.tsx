import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Box, CardContent, Pagination, Stack, Typography } from "@mui/material";

import DashboardCard from "../../../components/basic/DashboardCard.tsx";
import { getSafetyInstruction } from "../../../api/dataProviders/dataProviders.ts";
import { SafetyInstruction } from "../../../api/interfaces/safetyInstructionInterface.ts";
import { Names } from "../../../api/common/dataNames.ts";
import { DataProviders } from "../../../api/dataProviders/DataProvider.ts";
import { GetWithPaginationResponse } from "../../../api/interfaces/getWithPaginationResponse.ts";

function SafetyInstructionsList() {
  const [content, setContent] = useState(<></>);

  const maxItemsPerPage = 10;
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { data, refetch, isFetching, isLoading } = useQuery(
    "getSafetyInstructions",
    () =>
      DataProviders.SAFETY_INSTRUCTIONS.getItemList(
        maxItemsPerPage,
        page - 1,
        false,
        `&search=${searchTerm}`,
      ),
  );

  useEffect(() => {
    refetch();
  }, [page, refetch, searchTerm]);

  useEffect(() => {
    if (
      (data as GetWithPaginationResponse)?.results &&
      (data as GetWithPaginationResponse)?.results?.length > 0
    ) {
      setContent(
        <Stack>
          {(data as GetWithPaginationResponse)?.results.map(
            (el: SafetyInstruction) => (
              <>
                <Box
                  key={el.id}
                  sx={{
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
                  onClick={async () => {
                    window.open(
                      (await getSafetyInstruction(el.id)).safety_instruction,
                      "_blank",
                    );
                  }}
                >
                  <CardContent>
                    <Stack>
                      <Typography variant="h6">
                        <b>{el.reagent_name}</b>
                      </Typography>
                      <Typography variant="h6">{el.producer}</Typography>
                    </Stack>
                  </CardContent>
                </Box>
              </>
            ),
          )}
          {(data as GetWithPaginationResponse)?.pagesCount > 1 && (
            <Pagination
              count={(data as GetWithPaginationResponse)?.pagesCount}
              page={page}
              onChange={(_event, value) => setPage(value)}
            />
          )}
        </Stack>,
      );
    } else {
      setContent(
        <Typography lineHeight={2}>
          Nie znaleziono żadnych instrukcji bezpieczeństwa.
        </Typography>,
      );
    }
  }, [data]);

  return DashboardCard({
    title: Names.title_safety_instructions,
    isLoading: isLoading || isFetching,
    content,
    searchEnabled: true,
    handleSearchChange: (searchTerm: string) => {
      setPage(1);
      setSearchTerm(searchTerm);
    },
  });
}

export default SafetyInstructionsList;

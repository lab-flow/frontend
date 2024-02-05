import { Names } from "../../api/common/dataNames";
import { Box, TextField, Typography } from "@mui/material";
import DashboardCard from "../../components/basic/DashboardCard";
import { Controller, useForm } from "react-hook-form";
import { StyledForm } from "../../components/basic/StyledForm";
import PersonalReagentFilters from "../reagents/personal/data-grid/PersonalReagentFilters";
import DownloadPdfButton from "./DownloadPdfButton";
import { AxiosResponse } from "axios";

interface ReportBasicProps {
  report_title: string;
  report_getter: (params: string) => Promise<AxiosResponse<any, any>>;
  report_file_name: string;
}

function ReportBasic(props: ReportBasicProps) {
  const { control, handleSubmit, setValue, reset } = useForm<{
    report_header: string;
  }>({
    defaultValues: {},
  });

  const content = (
    <StyledForm>
      <Box sx={{ margin: "20px 0" }}>
        <Typography variant="h6">{Names.report_name_desc_field}</Typography>
        <Controller
          control={control}
          name="report_header"
          render={({ field }) => (
            <TextField
              sx={{ width: "100%" }}
              label={Names.report_header}
              {...field}
            />
          )}
        />
      </Box>
      <Box sx={{ margin: "20px 0" }}>
        <Typography variant="h6">{Names.report_filters_description}</Typography>
        <PersonalReagentFilters
          control={control}
          setValue={setValue}
          reset={reset}
          filters={{
            laboratory: true,
            project_procedure: true,
            reagent_type: true,
            is_critical: true,
            user: false,
            expiration_date: true,
            receipt_purchase_date: true,
            reagent: true,
            producer: true,
            room: true,
            detailed_location: true,
            clp_classification: true,
            cas_no: true,
            is_usage_record_required: true,
            is_usage_record_generated: true,
          }}
        />
      </Box>
      <DownloadPdfButton
        handleSubmit={handleSubmit}
        report_getter={props.report_getter}
        report_file_name={props.report_file_name}
        buttonLabel="Generuj"
        buttonLoadingLabel="Generowanie raportu ..."
      />
    </StyledForm>
  );
  return <DashboardCard title={props.report_title} content={content} />;
}

export default ReportBasic;

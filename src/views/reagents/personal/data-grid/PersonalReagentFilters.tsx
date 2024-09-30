import { useState } from "react";
import { Names } from "../../../../api/common/dataNames.ts";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import { StyledForm } from "../../../../components/basic/StyledForm";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  BooleanFilter,
  ClpClassificationFilter,
  DateFilter,
  LaboratoryFilterBase,
  MultiplyChipsFilterField,
  ProducerFilter,
  ProjectProcedureFilter,
  ReagentFilter,
  ReagentTypeFilter,
  UsersFilter,
} from "../../../../components/filters/Filters";

interface PersonalReagentsFilterProps {
  control: any;
  setValue: any;
  reset: () => void;
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
}

function PersonalReagentsFilter(props: PersonalReagentsFilterProps) {
  const [expanded, setExpanded] = useState(false);

  const handleAccordionChange = () => {
    setExpanded(true);
  };

  return (
    <Accordion variant="outlined" onChange={handleAccordionChange}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} id="filters">
        <Typography>Filtry</Typography>
      </AccordionSummary>
      {expanded && (
        <AccordionDetails>
          <Button
            variant="contained"
            onClick={() => {
              props.reset();
              setExpanded(false);
            }}
          >
            Przywróć domyślne
          </Button>
          <Box sx={{ height: "20px" }}></Box>
          <StyledForm>
            <Grid container spacing={1}>
              {props.filters?.laboratory && (
                <Grid item xs={12} sm={6} md={6} xl={2}>
                  <LaboratoryFilterBase
                    control={props.control}
                    multiple
                    disableDefault
                  />
                </Grid>
              )}
              {props.filters?.project_procedure && (
                <Grid item xs={12} sm={6} md={6} xl={2}>
                  <ProjectProcedureFilter
                    control={props.control}
                    multiple
                    disableDefault
                  />
                </Grid>
              )}
              {props.filters?.reagent_type && (
                <Grid item xs={12} sm={6} md={6} xl={2}>
                  <ReagentTypeFilter
                    control={props.control}
                    multiple
                    disableDefault
                  />
                </Grid>
              )}
              {props.filters?.is_critical && (
                <Grid item xs={12} sm={6} md={6} xl={2}>
                  <BooleanFilter
                    control={props.control}
                    disableDefault
                    field_name="is_critical"
                  />
                </Grid>
              )}
              {props.filters?.user && (
                <Grid item xs={12} sm={6} md={6} xl={2}>
                  <UsersFilter
                    control={props.control}
                    multiple
                    disableDefault
                  />
                </Grid>
              )}
              {props.filters?.expiration_date && (
                <Grid item xs={12} sm={6} md={6} xl={2}>
                  <DateFilter
                    control={props.control}
                    disableDefault
                    setValue={props.setValue}
                    field_name={"expiration_date"}
                  />
                </Grid>
              )}
              {props.filters?.opening_date && (
                <Grid item xs={12} sm={6} md={6} xl={2}>
                  <DateFilter
                    control={props.control}
                    disableDefault
                    setValue={props.setValue}
                    field_name={"opening_date"}
                  />
                </Grid>
              )}
              {props.filters?.receipt_purchase_date && (
                <Grid item xs={12} sm={6} md={6} xl={2}>
                  <DateFilter
                    control={props.control}
                    disableDefault
                    setValue={props.setValue}
                    field_name={"receipt_purchase_date"}
                  />
                </Grid>
              )}
              {props.filters?.reagent && (
                <Grid item xs={12} sm={6} md={6} xl={2}>
                  <ReagentFilter
                    control={props.control}
                    disableDefault
                    multiple
                  />
                </Grid>
              )}
              {props.filters?.producer && (
                <Grid item xs={12} sm={6} md={6} xl={2}>
                  <ProducerFilter
                    control={props.control}
                    disableDefault
                    multiple
                  />
                </Grid>
              )}
              {props.filters?.room && (
                <Grid item xs={12} sm={6} md={6} xl={2}>
                  <MultiplyChipsFilterField
                    control={props.control}
                    name="room"
                    label={Names.room}
                    setValue={props.setValue}
                  />
                </Grid>
              )}
              {props.filters?.detailed_location && (
                <Grid item xs={12} sm={6} md={6} xl={2}>
                  <MultiplyChipsFilterField
                    control={props.control}
                    name="detailed_location"
                    label={Names.detailed_location}
                    setValue={props.setValue}
                  />
                </Grid>
              )}
              {props.filters?.clp_classification && (
                <Grid item xs={12} sm={6} md={6} xl={2}>
                  <ClpClassificationFilter
                    control={props.control}
                    disableDefault
                    multiple
                  />
                </Grid>
              )}
              {props.filters?.cas_no && (
                <Grid item xs={12} sm={6} md={6} xl={2}>
                  <MultiplyChipsFilterField
                    control={props.control}
                    name="cas_no"
                    label={Names.cas_no}
                    setValue={props.setValue}
                  />
                </Grid>
              )}
              {props.filters?.is_usage_record_required && (
                <Grid item xs={12} sm={6} md={6} xl={2}>
                  <BooleanFilter
                    control={props.control}
                    disableDefault
                    field_name="is_usage_record_required"
                  />
                </Grid>
              )}
              {props.filters?.is_usage_record_generated && (
                <Grid item xs={12} sm={6} md={6} xl={2}>
                  <BooleanFilter
                    control={props.control}
                    disableDefault
                    field_name="is_usage_record_generated"
                  />
                </Grid>
              )}
            </Grid>
          </StyledForm>
        </AccordionDetails>
      )}
    </Accordion>
  );
}

export default PersonalReagentsFilter;

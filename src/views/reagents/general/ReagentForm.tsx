import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useQuery } from "react-query";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import Dropdown from "../../../components/basic/Dropdown.tsx";
import { useState } from "react";
import { Names } from "../../../api/common/dataNames.ts";
import { authenticationService } from "../../../services/authenticationService";
import { ADMIN_ROLE } from "../../../api/enums/userRoles";
import { DataProviders } from "../../../api/dataProviders/DataProvider.ts";
import { StyledForm } from "../../../components/basic/StyledForm.tsx";
import NewItemPopup from "../../../components/basic/NewItemPopup";
import AddReagentType from "../../reagent-types/AddReagentType";
import AddProducer from "../../producers/AddProducer";
import AddConcentrations from "../../concentrations/AddConcentrations";
import AddPurityQuality from "../../purities-qualities/AddPurityQuality";
import AddStorageConditions from "../../storage-conditions/AddStorageConditions";
import AddHazardStatement from "../../hazard-statements/AddHazardStatement";
import AddPrecautionaryStatement from "../../precautionary-statement/AddPrecautionaryStatement";
import AddUnit from "../../units/AddUnit";
import { PrivateComponent } from "../../../components/PrivateComponent";
import InfoIcon from "@mui/icons-material/Info";
import { HtmlTooltip } from "../../../components/basic/HtmlTooltip";
import { ReagentFormInterface } from "../../../api/interfaces/reagent.ts";
import { ReagentTypeInterface } from "../../../api/interfaces/reagentType.ts";
import { AxiosResponse } from "axios";
import { ProducerInterface } from "../../../api/interfaces/producer.ts";
import { ConcentrationsInterface } from "../../../api/interfaces/concentrations.ts";
import { UnitInterface } from "../../../api/interfaces/unit.ts";
import { PurityQualityInterface } from "../../../api/interfaces/purityQuality.ts";
import { StorageConditionInterface } from "../../../api/interfaces/storageCondition.ts";
import { HazardStatementsInterface } from "../../../api/interfaces/hazardStatements.ts";
import { PrecautionaryStatementInterface } from "../../../api/interfaces/precautionaryStatement.ts";

interface ReagentFormProps {
  onSubmit: SubmitHandler<ReagentFormInterface>;
  defaultValues?: ReagentFormInterface;
  edit?: boolean;
}

function ReagentForm(props: ReagentFormProps) {
  const { control, register, handleSubmit } = useForm<ReagentFormInterface>({
    defaultValues: { ...props.defaultValues },
  });
  const { currentUserRoles } = authenticationService;
  const { data: reagentTypesData, refetch: reagentTypesRefetch } = useQuery(
    "getReagentTypesData",
    () => DataProviders.REAGENT_TYPES.getItemList(0, 0, true),
  );
  const [reagentType, setReagentType] = useState(
    props.defaultValues?.type?.toString(),
  );
  const { data: producersData, refetch: producersDataRefetch } = useQuery(
    "getProducersWithAbbreviation",
    () => DataProviders.PRODUCERS.getItemList(0, 0, true),
  );
  const [producer, setProducer] = useState(
    props.defaultValues?.producer?.toString(),
  );

  const { data: concentrationsData, refetch: concentrationsDataRefetch } =
    useQuery("getConcentrationData", () =>
      DataProviders.CONCENTRATIONS.getItemList(0, 0, true),
    );
  const [concentration, setConcentration] = useState(
    props.defaultValues?.concentration?.toString(),
  );

  const { data: unitsData, refetch: unitsDataRefetch } = useQuery(
    "getUnitNames",
    () => DataProviders.UNITS.getItemList(0, 0, true),
  );
  const [unit, setUnit] = useState(props.defaultValues?.unit?.toString());

  const { data: puritiesQualitiesData, refetch: puritiesQualitiesRefetch } =
    useQuery("getPuritiesQualities", () =>
      DataProviders.PURITIES_QUALITIES.getItemList(0, 0, true),
    );
  const [purityQuality, setPurityQuality] = useState(
    props.defaultValues?.purity_quality?.toString(),
  );

  const { data: storageConditionsData, refetch: storageConditionsRefetch } =
    useQuery("getStorageConditions", () =>
      DataProviders.STORAGE_CONDITIONS.getItemList(0, 0, true),
    );
  const [storageCondition, setStorageCondition] = useState(
    (props.defaultValues?.storage_conditions as unknown as string[]) || [],
  );

  const { data: hazardsStatementsData, refetch: hazardsStatementRefetch } =
    useQuery("getHazardStatementsData", () =>
      DataProviders.HAZARD_STATEMENTS.getItemList(0, 0, true),
    );
  const [hazardStatement, setHazardStatement] = useState(
    (props.defaultValues?.hazard_statements as unknown as string[]) || [],
  );

  const {
    data: precautionaryStatementsData,
    refetch: precautionaryStatementRefetch,
  } = useQuery("getPrecautionaryStatements", () =>
    DataProviders.PRECAUTIONARY_STATEMENT.getItemList(0, 0, true),
  );
  const [precautionaryStatement, setPrecautionaryStatement] = useState(
    (props.defaultValues?.precautionary_statements as unknown as string[]) ||
      [],
  );

  return (
    <StyledForm>
      <Box sx={{ display: "flex" }}>
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <Dropdown
              label={Names.type}
              value={reagentType}
              required
              onChange={(e) => {
                setReagentType(e.target.value);
                field.onChange(e);
              }}
              id="type"
              items={
                (reagentTypesData as AxiosResponse)?.data?.map(
                  (item: ReagentTypeInterface) => ({
                    name: item.type,
                    value: item.id,
                  }),
                ) || []
              }
            />
          )}
        />
        <NewItemPopup
          formComponent={(setOpen) => (
            <AddReagentType setOpen={setOpen} refetch={reagentTypesRefetch} />
          )}
        />
      </Box>
      <Box sx={{ display: "flex" }}>
        <Controller
          control={control}
          name="producer"
          render={({ field }) => (
            <Dropdown
              label={`${Names.producer} (${Names.abbreviation} - ${Names.producer_name} - ${Names.brand_name})`}
              value={producer}
              onChange={(e) => {
                setProducer(e.target.value);
                field.onChange(e);
              }}
              required
              id="producer"
              items={
                (producersData as AxiosResponse)?.data?.map(
                  (item: ProducerInterface) => ({
                    name: `${item.abbreviation} - ${item.producer_name} - ${item.brand_name}`,
                    value: item.id,
                  }),
                ) || []
              }
            />
          )}
        />
        <NewItemPopup
          formComponent={(setOpen) => (
            <AddProducer setOpen={setOpen} refetch={producersDataRefetch} />
          )}
        />
      </Box>
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <TextField
            sx={{ width: "100%" }}
            label={Names.name}
            required
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="catalog_no"
        render={({ field }) => (
          <TextField
            sx={{ width: "100%" }}
            label={Names.catalog_no}
            required
            {...field}
          />
        )}
      />
      <Box sx={{ display: "flex" }}>
        <Controller
          control={control}
          name="concentration"
          render={({ field }) => (
            <Dropdown
              label={Names.concentration}
              value={concentration}
              onChange={(e) => {
                setConcentration(e.target.value);
                field.onChange(e);
              }}
              id="concentration"
              items={
                (concentrationsData as AxiosResponse)?.data?.map(
                  (item: ConcentrationsInterface) => ({
                    name: item.concentration,
                    value: item.id,
                  }),
                ) || []
              }
            />
          )}
        />
        <NewItemPopup
          formComponent={(setOpen) => (
            <AddConcentrations
              setOpen={setOpen}
              refetch={concentrationsDataRefetch}
            />
          )}
        />
      </Box>
      <Controller
        control={control}
        name="volume"
        render={({ field }) => (
          <TextField
            sx={{ width: "100%" }}
            label={Names.volume}
            type="number"
            required
            {...field}
          />
        )}
      />
      <Box sx={{ display: "flex" }}>
        <Controller
          control={control}
          name="unit"
          render={({ field }) => (
            <Dropdown
              label={Names.unit}
              value={unit}
              onChange={(e) => {
                setUnit(e.target.value);
                field.onChange(e);
              }}
              id="unit"
              required
              items={
                (unitsData as AxiosResponse)?.data?.map(
                  (item: UnitInterface) => ({
                    name: item.unit,
                    value: item.id,
                  }),
                ) || []
              }
            />
          )}
        />
        <NewItemPopup
          formComponent={(setOpen) => (
            <AddUnit setOpen={setOpen} refetch={unitsDataRefetch} />
          )}
        />
      </Box>
      <Box sx={{ display: "flex" }}>
        <Controller
          control={control}
          name="purity_quality"
          render={({ field }) => (
            <Dropdown
              label={Names.purity_quality}
              value={purityQuality}
              onChange={(e) => {
                setPurityQuality(e.target.value);
                field.onChange(e);
              }}
              id="purity_quality"
              items={
                (puritiesQualitiesData as AxiosResponse)?.data?.map(
                  (item: PurityQualityInterface) => ({
                    name: item.purity_quality,
                    value: item.id,
                  }),
                ) || []
              }
            />
          )}
        />
        <NewItemPopup
          formComponent={(setOpen) => (
            <AddPurityQuality
              setOpen={setOpen}
              refetch={puritiesQualitiesRefetch}
            />
          )}
        />
      </Box>
      <Box sx={{ display: "flex" }}>
        <Controller
          control={control}
          name="storage_conditions"
          render={({ field }) => (
            <Dropdown
              label={Names.storage_conditions}
              value={storageCondition}
              onChange={(e) => {
                setStorageCondition(e.target.value as unknown as string[]);
                field.onChange(e);
              }}
              id="storage_conditions"
              items={
                (storageConditionsData as AxiosResponse)?.data?.map(
                  (item: StorageConditionInterface) => ({
                    name: item.storage_condition,
                    value: item.id,
                  }),
                ) || []
              }
              multiple
            />
          )}
        />
        <NewItemPopup
          formComponent={(setOpen) => (
            <AddStorageConditions
              setOpen={setOpen}
              refetch={storageConditionsRefetch}
            />
          )}
        />
      </Box>
      <Box sx={{ display: "flex" }}>
        <Controller
          control={control}
          name="hazard_statements"
          render={({ field }) => (
            <Dropdown
              label={Names.hazard_statements}
              value={hazardStatement}
              onChange={(e) => {
                setHazardStatement(e.target.value as unknown as string[]);
                field.onChange(e);
              }}
              id="hazard_statements"
              items={
                (hazardsStatementsData as AxiosResponse)?.data?.map(
                  (item: HazardStatementsInterface) => ({
                    name: item.code + " - " + item.phrase,
                    value: item.id,
                  }),
                ) || []
              }
              multiple
            />
          )}
        />
        <PrivateComponent
          roles={[ADMIN_ROLE]}
          component={() => (
            <NewItemPopup
              formComponent={(setOpen) => (
                <AddHazardStatement
                  setOpen={setOpen}
                  refetch={hazardsStatementRefetch}
                />
              )}
            />
          )}
        />
      </Box>
      <Box sx={{ display: "flex" }}>
        <Controller
          control={control}
          name="precautionary_statements"
          render={({ field }) => (
            <Dropdown
              label={Names.precautionary_statements}
              value={precautionaryStatement}
              onChange={(e) => {
                setPrecautionaryStatement(
                  e.target.value as unknown as string[],
                );
                field.onChange(e);
              }}
              id="precautionary_statements"
              items={
                (precautionaryStatementsData as AxiosResponse)?.data?.map(
                  (item: PrecautionaryStatementInterface) => ({
                    name: item.code + " - " + item.phrase,
                    shortName: item.code,
                    value: item.id,
                  }),
                ) || []
              }
              multiple
            />
          )}
        />
        <PrivateComponent
          roles={[ADMIN_ROLE]}
          component={() => (
            <NewItemPopup
              formComponent={(setOpen) => (
                <AddPrecautionaryStatement
                  setOpen={setOpen}
                  refetch={precautionaryStatementRefetch}
                />
              )}
            />
          )}
        />
      </Box>
      <Typography>{Names.safety_data_sheet}</Typography>
      <Controller
        control={control}
        name="safety_data_sheet_name"
        render={({ field }) => (
          <TextField
            sx={{ width: "100%" }}
            label={Names.safety_data_sheet_name}
            {...field}
          />
        )}
      />
      <input
        {...register("safety_data_sheet")}
        accept=".pdf"
        multiple={false}
        type="file"
        name="safety_data_sheet"
        required={!props.edit}
      />

      <Typography>{Names.safety_instruction}</Typography>
      <Controller
        control={control}
        name="safety_instruction_name"
        render={({ field }) => (
          <TextField
            sx={{ width: "100%" }}
            label={Names.safety_instruction_name}
            required
            {...field}
          />
        )}
      />
      <input
        {...register("safety_instruction")}
        accept=".pdf"
        multiple={false}
        type="file"
        name="safety_instruction"
        required={!props.edit}
      />
      <Controller
        control={control}
        name="cas_no"
        render={({ field }) => (
          <TextField sx={{ width: "100%" }} label={Names.cas_no} {...field} />
        )}
      />
      <Controller
        control={control}
        name="other_info"
        render={({ field }) => (
          <TextField
            sx={{ width: "100%" }}
            label={Names.other_info}
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="kit_contents"
        render={({ field }) => (
          <TextField
            sx={{ width: "100%" }}
            label={Names.kit_contents}
            {...field}
          />
        )}
      />
      <Box sx={{ display: "flex" }}>
        <Controller
          control={control}
          name="is_usage_record_required"
          render={({ field }) => (
            <FormControlLabel
              sx={{ width: "100%" }}
              control={
                <Checkbox
                  defaultChecked={props.defaultValues?.is_usage_record_required}
                  {...field}
                />
              }
              label={
                <Typography>
                  {Names.is_usage_record_required}
                  <HtmlTooltip
                    title={
                      <div style={{ whiteSpace: "pre-line" }}>
                        {Names.is_usage_record_required_tooltip}
                      </div>
                    }
                  >
                    <InfoIcon sx={{ margin: "0 10px" }} />
                  </HtmlTooltip>
                </Typography>
              }
            />
          )}
        />
      </Box>

      {props.edit && (
        <Controller
          control={control}
          name="is_validated_by_admin"
          render={({ field }) => (
            <FormControlLabel
              sx={{ width: "100%" }}
              control={
                <Checkbox
                  disabled={!currentUserRoles.includes(ADMIN_ROLE)}
                  defaultChecked={props.defaultValues?.is_validated_by_admin}
                  {...field}
                />
              }
              label={Names.is_validated_by_admin}
            />
          )}
        />
      )}
      <Button
        onClick={handleSubmit(props.onSubmit)}
        variant="contained"
        type="submit"
      >
        {Names.send}
      </Button>
    </StyledForm>
  );
}

export default ReagentForm;

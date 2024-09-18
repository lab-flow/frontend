import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  styled,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import Dropdown from "../../../../components/basic/Dropdown.tsx";
import React, { useState } from "react";
import CustomDatePicker from "../../../../components/basic/CustomDatePicker.tsx";
import { Names } from "../../../../api/common/dataNames.ts";
import { useQuery } from "react-query";
import ReagentGeneralInfo from "../../general/ReagentGeneralInfo";
import { DataProviders } from "../../../../api/dataProviders/DataProvider.ts";
import { authenticationService } from "../../../../services/authenticationService";
import { ADMIN_ROLE } from "../../../../api/enums/userRoles";
import NewItemButton from "../../../../components/basic/NewItemButton";
import { PrivateComponent } from "../../../../components/PrivateComponent";
import { PersonalReagentFormInterface } from "../../../../api/interfaces/personalReagent.ts";
import { ReagentInterface } from "../../../../api/interfaces/reagent.ts";
import { AxiosResponse } from "axios";
import { ProjectProcedureInterface } from "../../../../api/interfaces/projectProcedure.ts";
import { UserInterface } from "../../../../api/interfaces/user.ts";
import { LaboratoryInterface } from "../../../../api/interfaces/laboratory.ts";

const StyledForm = styled("form")(({ theme }) => ({
  "& *": {
    marginBottom: theme.spacing(1),
  },
}));

interface AddPersonalReagentFormProps {
  onSubmit: SubmitHandler<PersonalReagentFormInterface>;
  defaultValues?: PersonalReagentFormInterface;
  edit?: boolean;
}

function PersonalReagentForm(props: AddPersonalReagentFormProps) {
  const { currentUserRoles } = authenticationService;

  const { control, handleSubmit } = useForm<PersonalReagentFormInterface>({
    defaultValues: {
      is_critical: !!props.defaultValues?.is_critical,
      ...props.defaultValues,
    },
  });
  const [isMultiply, setIsMultiply] = useState(false); // COUNT

  const [reagent, setReagent] = useState(
    props.defaultValues?.reagent?.toString(),
  );

  const { data: reagentsData } = useQuery("getReagentsData", () =>
    DataProviders.REAGENTS.getItemList(0, 0, true),
  );
  const reagentView = (reagent_id: number) => {
    const currentReagentData = (reagentsData as AxiosResponse)?.data?.find(
      (item: ReagentInterface) => item.id == reagent_id,
    );
    return ReagentGeneralInfo(currentReagentData, false);
  };
  const { data: laboratoriesData } = useQuery(
    "getLaboratoriesData",
    () => DataProviders.LABORATORIES.getItemList(0, 0, true),
  );
  const { data: projectProceduresData } = useQuery(
    "getProjectProceduresData",
    () => DataProviders.PROJECT_PROCEDURES.getItemList(0, 0, true),
  );
  const [projectProcedure, setProjectProcedure] = useState(
    props.defaultValues?.project_procedure?.toString(),
  );

  const { data: usersData } = useQuery("getUsersData", () =>
    currentUserRoles.some((r) => [ADMIN_ROLE].includes(r))
      ? DataProviders.USERS.getItemList(0, 0, true)
      : null,
  );

  const [mainOwner, setMainOwner] = useState(
    props.defaultValues?.main_owner?.toString(),
  );
  const [laboratory, setLaboratory] = useState(props.defaultValues?.laboratory);

  const handleToggleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    newAlignment ? setIsMultiply(newAlignment === "multiply") : null;
  };

  const count_step = (
    <>
      <Typography id={`count-label`}>
        Wybierz ilość wprowadzanych odczynników:
      </Typography>
      <Box sx={{ height: "10px" }} />
      <ToggleButtonGroup
        color="primary"
        value={isMultiply ? "multiply" : "single"}
        exclusive
        onChange={handleToggleChange}
        aria-label="Platform"
      >
        <ToggleButton value="single">Jeden</ToggleButton>
        <ToggleButton value="multiply">Wiele</ToggleButton>
      </ToggleButtonGroup>
      {isMultiply ? (
        <Controller
          control={control}
          name="count"
          render={({ field }) => (
            <TextField
              sx={{ width: "100%" }}
              label={Names.count}
              type="number"
              {...field}
              required
            />
          )}
        />
      ) : null}
    </>
  );

  const reagent_step = (
    <>
      <Typography id={`count-label`}>Wybierz odczynnik z listy</Typography>
      <Box sx={{ height: "10px" }} />
      <Box sx={{ display: "flex" }}>
        <Controller
          control={control}
          name="reagent"
          render={({ field }) => (
            <Dropdown
              required
              label={`${Names.reagent} (${Names.id} - ${Names.name} - ${Names.producer})`}
              value={reagent}
              onChange={(e) => {
                setReagent(e.target.value);
                field.onChange(e);
              }}
              id="reagent"
              items={
                (reagentsData as AxiosResponse)?.data?.map(
                  (item: ReagentInterface) => ({
                    name: `${item.id} - ${item.name} - ${item.producer?.repr}`,
                    value: item.id,
                  }),
                ) || []
              }
            />
          )}
        />
        <NewItemButton href={`/${DataProviders.REAGENTS.endpoint}/new`} />
      </Box>
      {reagent && reagentView(reagent as unknown as number)}
    </>
  );

  const details_step = (
    <>
      <Typography id={`count-label`}>Podaj dodatkowe informacje:</Typography>
      <Box sx={{ height: "10px" }} />
      <Controller
        control={control}
        name="is_critical"
        render={({ field }) => (
          <FormControlLabel
            sx={{ width: "100%" }}
            control={
              <Checkbox
                defaultChecked={props.defaultValues?.is_critical}
                {...field}
              />
            }
            label={Names.is_critical}
          />
        )}
      />
      <Controller
        control={control}
        name="project_procedure"
        render={({ field }) => (
          <Dropdown
            label={`${Names.project_procedure} (${Names.id} - ${Names.name})`}
            value={projectProcedure}
            onChange={(e) => {
              setProjectProcedure(e.target.value);
              field.onChange(e);
            }}
            id="project_procedure"
            items={
              (projectProceduresData as AxiosResponse)?.data?.map(
                (item: ProjectProcedureInterface) => ({
                  name: `${item.id} - ${item.name}`,
                  value: item.id,
                }),
              ) || []
            }
          />
        )}
      />
      <PrivateComponent
        component={() => (
          <Controller
            control={control}
            name="main_owner"
            render={({ field }) => (
              <Dropdown
                label={`${Names.main_owner} (${Names.id} - ${Names.username})`}
                value={mainOwner}
                onChange={(e) => {
                  setMainOwner(e.target.value);
                  field.onChange(e);
                }}
                id="main_owner"
                items={
                  (usersData as AxiosResponse)?.data?.map(
                    (item: UserInterface) => ({
                      name: `${item.id} - ${item.username}`,
                      value: item.id,
                    }),
                  ) || []
                }
              />
            )}
          />
        )}
        roles={[ADMIN_ROLE]}
      />

      <Controller
        control={control}
        name="lot_no"
        render={({ field }) => (
          <TextField
            sx={{ width: "100%" }}
            label={Names.lot_no}
            required
            {...field}
          />
        )}
      />

      <>
        <Controller
          control={control}
          name="receipt_purchase_date"
          render={({ field }) => (
            <div>
              <CustomDatePicker
                label={Names.receipt_purchase_date}
                required
                {...field}
              />
            </div>
          )}
        />
        <Controller
          control={control}
          name="expiration_date"
          render={({ field }) => (
            <CustomDatePicker label="Data ważności" required {...field} />
          )}
        />
      </>
      <Controller
        control={control}
        name="laboratory"
        render={({ field }) => (
          <Dropdown
            label={Names.laboratory}
            value={laboratory}
            onChange={(e) => {
              setLaboratory(e.target.value);
              field.onChange(e);
            }}
            id="laboratory"
            items={
              (laboratoriesData as AxiosResponse)?.data?.map(
                (item: LaboratoryInterface) => ({
                  name: `${item.id} - ${item.laboratory}`,
                  value: item.id,
                }),
              ) || []
            }
          />
        )}
      />
      <Controller
        control={control}
        name="room"
        render={({ field }) => (
          <TextField
            sx={{ width: "100%" }}
            label={Names.room}
            required
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="detailed_location"
        render={({ field }) => (
          <TextField
            sx={{ width: "100%" }}
            label={Names.detailed_location}
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="user_comment"
        render={({ field }) => (
          <TextField
            sx={{ width: "100%" }}
            label={Names.user_comment}
            {...field}
          />
        )}
      />
    </>
  );

  const add_reagent_form = (
    <StyledForm>
      <Box sx={{ height: "20px" }} />
      {count_step}
      <Box sx={{ height: "20px" }} />
      {reagent_step}
      <Box sx={{ height: "20px" }} />
      {details_step}
      <Box sx={{ height: "20px" }} />
      <Button
        onClick={handleSubmit(props.onSubmit)}
        variant="contained"
        type="submit"
      >
        {Names.send}
      </Button>
    </StyledForm>
  );

  const edit_reagent_form = (
    <StyledForm>
      {reagent_step}
      <Box sx={{ height: "20px" }} />
      {details_step}
      <Box sx={{ height: "20px" }} />
      <Button
        onClick={handleSubmit(props.onSubmit)}
        variant="contained"
        type="submit"
      >
        {Names.send}
      </Button>
    </StyledForm>
  );

  return props.edit ? edit_reagent_form : add_reagent_form;
}

export default PersonalReagentForm;

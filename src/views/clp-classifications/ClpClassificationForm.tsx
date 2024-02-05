import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import "../../api/dataProviders/dataProviders";
import { Names } from "../../api/common/dataNames";
import Button from "@mui/material/Button";
import { StyledForm } from "../../components/basic/StyledForm";
import Dropdown from "../../components/basic/Dropdown";
import { getHazardGroupName, HazardGroup } from "../../api/enums/hazardGroups";
import { useState } from "react";
import { ClpClassificationInterface } from "../../api/interfaces/clpClassification.ts";

interface ClpClassificationFormProps {
  onSubmit: SubmitHandler<ClpClassificationInterface>;
  defaultValues?: ClpClassificationInterface;
}

function ClpClassificationForm(props: ClpClassificationFormProps) {
  const { control, handleSubmit } = useForm<ClpClassificationInterface>({
    defaultValues: props.defaultValues || {},
  });

  const hazardGroups = Object.keys(HazardGroup).map((key) => ({
    name: getHazardGroupName(HazardGroup[key as keyof typeof HazardGroup]),
    value: HazardGroup[key as keyof typeof HazardGroup]?.toString(),
  }));

  const [hazardGroup, setHazardGroup] = useState(
    props.defaultValues?.hazard_group,
  );

  return (
    <StyledForm>
      <Controller
        control={control}
        name="classification"
        render={({ field }) => (
          <TextField
            sx={{ width: "100%" }}
            label={Names.classification}
            required
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="clp_classification"
        render={({ field }) => (
          <TextField
            sx={{ width: "100%" }}
            label={Names.clp_classification}
            required
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="hazard_group"
        render={({ field }) => (
          <Dropdown
            label={Names.hazard_group}
            value={hazardGroup}
            onChange={(e) => {
              setHazardGroup(e.target.value);
              field.onChange(e);
            }}
            id="group"
            items={hazardGroups}
          />
        )}
      />
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

export default ClpClassificationForm;

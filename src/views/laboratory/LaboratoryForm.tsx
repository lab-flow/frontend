import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { TextField } from "@mui/material";

import "../../api/dataProviders/dataProviders.ts";
import { Names } from "../../api/common/dataNames.ts";
import Button from "@mui/material/Button";
import { StyledForm } from "../../components/basic/StyledForm.tsx";
import { LaboratoryInterface } from "../../api/interfaces/laboratory.ts";

interface LaboratoryFormProps {
  onSubmit: SubmitHandler<LaboratoryInterface>;
  defaultValues?: LaboratoryInterface;
}

function LaboratoryForm(props: LaboratoryFormProps) {
  const { control, handleSubmit } = useForm({
    defaultValues: props.defaultValues || {},
  });

  return (
    <StyledForm>
      <Controller
        control={control}
        name="laboratory"
        render={({ field }) => (
          <TextField
            sx={{ width: "100%" }}
            label={Names.laboratory}
            required
            {...field}
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

export default LaboratoryForm;

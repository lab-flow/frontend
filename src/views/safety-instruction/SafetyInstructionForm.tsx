import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import { StyledForm } from "../../components/basic/StyledForm.tsx";

import "../../api/dataProviders/dataProviders.ts";
import { Names } from "../../api/common/dataNames.ts";
import Button from "@mui/material/Button";
import { ADMIN_ROLE } from "../../api/enums/userRoles.ts";
import { authenticationService } from "../../services/authenticationService.ts";
import { SafetyInstructionInterface
 } from "../../api/interfaces/safety_instruction.ts";

interface SafetyDataSheetFormProps {
  onSubmit: SubmitHandler<SafetyInstructionInterface>;
  defaultValues?: SafetyInstructionInterface;
  edit?: boolean;
}

function SafetyInstructionForm(props: SafetyDataSheetFormProps) {
  const { currentUserRoles } = authenticationService;
  const { control, register, handleSubmit } = useForm<SafetyInstructionInterface>({
    defaultValues: props.defaultValues ? props.defaultValues : {},
  });

  return (
    <StyledForm>
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
        name="reagent_name"
        render={({ field }) => (
          <TextField
            sx={{ width: "100%" }}
            label={Names.reagent_name}
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

export default SafetyInstructionForm;

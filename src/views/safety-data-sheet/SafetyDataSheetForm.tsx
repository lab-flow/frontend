import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import { StyledForm } from "../../components/basic/StyledForm";

import "../../api/dataProviders/dataProviders";
import { Names } from "../../api/common/dataNames";
import Button from "@mui/material/Button";
import { ADMIN_ROLE } from "../../api/enums/userRoles";
import { authenticationService } from "../../services/authenticationService";
import { SafetyDataSheetInterface } from "../../api/interfaces/safety_data_sheet.ts";

interface SafetyDataSheetFormProps {
  onSubmit: SubmitHandler<SafetyDataSheetInterface>;
  defaultValues?: SafetyDataSheetInterface;
  edit?: boolean;
}

function SafetyDataSheetForm(props: SafetyDataSheetFormProps) {
  const { currentUserRoles } = authenticationService;
  const { control, register, handleSubmit } = useForm<SafetyDataSheetInterface>({
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
        {...register("safety_data_sheet")}
        accept=".pdf"
        multiple={false}
        type="file"
        name="safety_data_sheet"
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

export default SafetyDataSheetForm;

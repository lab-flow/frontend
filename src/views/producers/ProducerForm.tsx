import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import { StyledForm } from "../../components/basic/StyledForm";

import "../../api/dataProviders/dataProviders";
import { Names } from "../../api/common/dataNames";
import Button from "@mui/material/Button";
import { ADMIN_ROLE } from "../../api/enums/userRoles";
import { authenticationService } from "../../services/authenticationService";
import { ProducerInterface } from "../../api/interfaces/producer.ts";

interface ProducerFormProps {
  onSubmit: SubmitHandler<ProducerInterface>;
  defaultValues?: ProducerInterface;
  edit?: boolean;
}

function ProducerForm(props: ProducerFormProps) {
  const { currentUserRoles } = authenticationService;
  const { control, handleSubmit } = useForm<ProducerInterface>({
    defaultValues: props.defaultValues ? props.defaultValues : {},
  });

  return (
    <StyledForm>
      <Controller
        control={control}
        name="producer_name"
        render={({ field }) => (
          <TextField
            sx={{ width: "100%" }}
            label={Names.producer_name}
            required
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="brand_name"
        render={({ field }) => (
          <TextField
            sx={{ width: "100%" }}
            label={Names.brand_name}
            required
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="abbreviation"
        render={({ field }) => (
          <TextField
            sx={{ width: "100%" }}
            label={Names.producer_abbreviation}
            required
            {...field}
          />
        )}
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

export default ProducerForm;

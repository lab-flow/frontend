import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { TextField } from "@mui/material";

import "../../api/dataProviders/dataProviders";
import { Names } from "../../api/common/dataNames";
import Button from "@mui/material/Button";
import { StyledForm } from "../../components/basic/StyledForm";
import { PrecautionaryStatementInterface } from "../../api/interfaces/precautionaryStatement.ts";

interface PrecautionaryStatementFormProps {
  onSubmit: SubmitHandler<PrecautionaryStatementInterface>;
  defaultValues?: PrecautionaryStatementInterface;
}

function PrecautionaryStatementForm(props: PrecautionaryStatementFormProps) {
  const { control, handleSubmit } = useForm({
    defaultValues: props.defaultValues || {},
  });

  return (
    <StyledForm>
      <Controller
        control={control}
        name="code"
        render={({ field }) => (
          <TextField
            sx={{ width: "100%" }}
            label={Names.code}
            required
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="phrase"
        render={({ field }) => (
          <TextField
            sx={{ width: "100%" }}
            label={Names.phrase}
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

export default PrecautionaryStatementForm;

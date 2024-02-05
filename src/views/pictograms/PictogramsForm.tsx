import { SubmitHandler, useForm } from "react-hook-form";
import { Typography } from "@mui/material";
import "../../api/dataProviders/dataProviders";
import { Names } from "../../api/common/dataNames";
import Button from "@mui/material/Button";
import { StyledForm } from "../../components/basic/StyledForm";
import { PictogramsInterface } from "../../api/interfaces/pictograms.ts";

interface PictogramsFormProps {
  onSubmit: SubmitHandler<PictogramsInterface>;
  defaultValues?: PictogramsInterface;
}

function PictogramsForm(props: PictogramsFormProps) {
  const { register, handleSubmit } = useForm<PictogramsInterface>({
    defaultValues: props.defaultValues || {},
  });

  return (
    <StyledForm>
      {props.defaultValues?.id && (
        <Typography>
          {Names.id}: {props.defaultValues?.id}
        </Typography>
      )}
      <Typography>{Names.pictogram}</Typography>
      <input
        {...register("pictogram", {})}
        multiple={false}
        type="file"
        name="pictogram"
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

export default PictogramsForm;

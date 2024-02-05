import CustomDialog from "./CustomDialog.tsx";
import { getName, Names } from "../../api/common/dataNames.ts";
import { useContext } from "react";
import { APIErrorContext } from "../../providers/errorProvider.tsx";
import { Typography } from "@mui/material";
import { ErrorType } from "../../api/enums/errorType";
import { useNavigate } from "react-router-dom";

export default function ErrorNotification() {
  const { error, removeError } = useContext(APIErrorContext);
  const navigate = useNavigate();

  const formatErrorMessages = () => {
    if (
      [ErrorType.VALIDATION_ERROR, ErrorType.CLIENT_ERROR].includes(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        error?.type as ErrorType,
      )
    ) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return error?.errors?.map(
        (err: { attr: string; detail: string }, index: number) => (
          <Typography key={index}>
            • {err.attr && <b>({getName(err.attr as keyof typeof Names)})</b>}{" "}
            {err.detail}
          </Typography>
        ),
      );
    } else if (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      JSON.stringify(error?.errors || error?.error);
    }
    return null;
  };

  return (
    <CustomDialog
      open={!!error}
      setDialogOpen={removeError as (val: boolean) => void}
      title={Names.error_occurred}
      content={<>{formatErrorMessages()}</>}
      firstButtonLabel={Names.ok}
      firstButtonHandler={removeError}
      secondButtonLabel={Names.home_page}
      secondButtonHandler={() => navigate("/")}
    />
  );
}

import { Names } from "../../api/common/dataNames";
import { Button, CircularProgress } from "@mui/material";
import { useContext, useState } from "react";
import { downloadPDF } from "../../api/common/downloadPDF";
import { useMutation } from "react-query";
import { objectToQueryString } from "../../api/common/utils";
import { APIAlertContext } from "../../providers/alertProvider";
import { AxiosResponse } from "axios";
import { UseFormHandleSubmit } from "react-hook-form";

interface DownloadPdfButtonProps {
  report_getter: (params: string) => Promise<AxiosResponse<any, any>>;
  report_file_name: string;
  handleSubmit: UseFormHandleSubmit<
    { report_header?: string; is_archived?: boolean },
    undefined
  >;
  buttonLabel?: string;
  buttonLoadingLabel?: string;
}

function DownloadPdfButton(props: DownloadPdfButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const { addAlert } = useContext(APIAlertContext);

  const { mutate: getRaportMutate } = useMutation(props.report_getter, {
    onSuccess: (data) => {
      setIsLoading(false);
      addAlert(Names.successfully_generated_report, "success");
      const name =
        (data as AxiosResponse)?.headers["content-disposition"]
          ?.split("filename=")[1]
          .split(".")[0] || props.report_file_name;
      downloadPDF((data as AxiosResponse)?.data, name);
    },
    onError: () => {
      setIsLoading(false);
    },
  });

  async function handleDownload(data: { [key: string]: any }) {
    const notNullData = Object.keys(data).reduce(
      (acc: { [key: string]: any }, key) => {
        if (
          data[key] !== undefined &&
          data[key] !== "" &&
          (Array.isArray(data[key]) ? data[key].length > 0 : true)
        ) {
          acc[key] = data[key];
        }
        return acc;
      },
      {},
    );

    const params = objectToQueryString(notNullData);
    setIsLoading(true);
    getRaportMutate(params ? `?${params}` : "");
  }

  return (
    <Button
      variant="contained"
      disabled={isLoading}
      onClick={props.handleSubmit(handleDownload)}
    >
      {isLoading ? props.buttonLoadingLabel : props.buttonLabel}{" "}
      {isLoading && (
        <CircularProgress
          size={25}
          sx={{
            position: "absolute",
            top: "10%",
            left: "45%",
            zIndex: 1,
          }}
        />
      )}
    </Button>
  );
}

export default DownloadPdfButton;

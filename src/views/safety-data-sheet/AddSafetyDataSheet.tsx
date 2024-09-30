import { useMutation } from "react-query";
import "../../api/dataProviders/dataProviders";
import { Names } from "../../api/common/dataNames";
import SafetyDataSheetForm from "./SafetyDataSheetForm";
import { DataProviders } from "../../api/dataProviders/DataProvider.ts";
import FormPage from "../../components/basic/FormPage";
import { useContext } from "react";
import { APIAlertContext } from "../../providers/alertProvider";
import { useNavigate } from "react-router-dom";

function AddSafetyDataSheet({
  setOpen,
  refetch,
}: {
  setOpen: (value: boolean) => void;
  refetch: () => void;
}) {
  const navigate = useNavigate();
  const { addAlert } = useContext(APIAlertContext);
  const { mutate: createSafetyDataSheetMutate } = useMutation(
    DataProviders.SAFETY_DATA_SHEETS.createMultipartItem,
    {
      onSuccess: (data) => {
        addAlert(Names.added_new_object_id + data?.data?.id, "success");
        if (setOpen) {
          refetch();
          setOpen(false);
        } else navigate(`/user-panel/${DataProviders.SAFETY_DATA_SHEETS.endpoint}`);
      },
    },
  );

  const onSubmit = async (data: object) => {
    createSafetyDataSheetMutate(data);
  };

  return FormPage({
    title: Names.safety_data_sheets + " - " + Names.new_item,
    content: <SafetyDataSheetForm onSubmit={onSubmit} />,
    setDialogOpen: setOpen,
  });
}

export default AddSafetyDataSheet;

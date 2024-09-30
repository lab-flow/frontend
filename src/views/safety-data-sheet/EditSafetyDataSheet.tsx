import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import "../../api/dataProviders/dataProviders";
import { Names } from "../../api/common/dataNames";
import SafetyDataSheetForm from "./SafetyDataSheetForm";
import { DataProviders } from "../../api/dataProviders/DataProvider.ts";
import { useContext } from "react";
import { APIAlertContext } from "../../providers/alertProvider";
import FormPage from "../../components/basic/FormPage.tsx";

function EditSafetyDataSheet() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addAlert } = useContext(APIAlertContext);

  const { mutate: updateSafetyDataSheetMutate } = useMutation(
    DataProviders.SAFETY_DATA_SHEETS.updateMultipartItem,
    {
      onSuccess: (data) => {
        addAlert(`${Names.updated_object_id} ${data?.data?.id}`, "success");
        navigate(`/user-panel/${DataProviders.SAFETY_DATA_SHEETS.endpoint}`);
        remove();
      },
    },
  );

  const onSubmit = async (data: { id: number }) => {
    updateSafetyDataSheetMutate(data);
  };

  const { data, isLoading, remove } = useQuery("safetyDataSheetInfo" + id, () =>
    DataProviders.SAFETY_DATA_SHEETS.getItem(Number(id)).then((res) => {
      const { safety_data_sheet, ...data } = res.data;
      return data;
    }),
  );

  return FormPage({
    title: Names.safety_data_sheets + " - " + Names.edit,
    isLoading: isLoading,
    content: <SafetyDataSheetForm onSubmit={onSubmit} defaultValues={data} edit />,
  });
}

export default EditSafetyDataSheet;

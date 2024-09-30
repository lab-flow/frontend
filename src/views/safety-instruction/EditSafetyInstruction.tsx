import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import "../../api/dataProviders/dataProviders.ts";
import { Names } from "../../api/common/dataNames.ts";
import SafetyInstructionForm from "./SafetyInstructionForm.tsx";
import { DataProviders } from "../../api/dataProviders/DataProvider.ts";
import { useContext } from "react";
import { APIAlertContext } from "../../providers/alertProvider.tsx";
import FormPage from "../../components/basic/FormPage.tsx";

function EditSafetyInstruction() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addAlert } = useContext(APIAlertContext);

  const { mutate: updateSafetyInstructionMutate } = useMutation(
    DataProviders.SAFETY_INSTRUCTIONS.updateMultipartItem,
    {
      onSuccess: (data) => {
        addAlert(`${Names.updated_object_id} ${data?.data?.id}`, "success");
        navigate(`/user-panel/${DataProviders.SAFETY_INSTRUCTIONS.endpoint}`);
        remove();
      },
    },
  );

  const onSubmit = async (data: { id: number }) => {
    updateSafetyInstructionMutate(data);
  };

  const { data, isLoading, remove } = useQuery("safetyInstructionInfo" + id, () =>
    DataProviders.SAFETY_INSTRUCTIONS.getItem(Number(id)).then((res) => {
      const { safety_instruction, ...data } = res.data;
      return data;
    }),
  );

  return FormPage({
    title: Names.safety_instructions + " - " + Names.edit,
    isLoading: isLoading,
    content: <SafetyInstructionForm onSubmit={onSubmit} defaultValues={data} edit />,
  });
}

export default EditSafetyInstruction;

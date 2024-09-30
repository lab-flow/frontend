import { useMutation } from "react-query";
import "../../api/dataProviders/dataProviders.ts";
import { Names } from "../../api/common/dataNames.ts";
import SafetyInstructionForm from "./SafetyInstructionForm.tsx";
import { DataProviders } from "../../api/dataProviders/DataProvider.ts";
import FormPage from "../../components/basic/FormPage.tsx";
import { useContext } from "react";
import { APIAlertContext } from "../../providers/alertProvider.tsx";
import { useNavigate } from "react-router-dom";

function AddSafetyInstruction({
  setOpen,
  refetch,
}: {
  setOpen: (value: boolean) => void;
  refetch: () => void;
}) {
  const navigate = useNavigate();
  const { addAlert } = useContext(APIAlertContext);
  const { mutate: createSafetyInstructionMutate } = useMutation(
    DataProviders.SAFETY_INSTRUCTIONS.createMultipartItem,
    {
      onSuccess: (data) => {
        addAlert(Names.added_new_object_id + data?.data?.id, "success");
        if (setOpen) {
          setOpen(false);
          refetch();
        } else navigate(`/user-panel/${DataProviders.SAFETY_INSTRUCTIONS.endpoint}`);
      },
    },
  );

  const onSubmit = async (data: object) => {
    createSafetyInstructionMutate(data);
  };

  return FormPage({
    title: Names.safety_instructions + " - " + Names.new_item,
    content: <SafetyInstructionForm onSubmit={onSubmit} />,
    setDialogOpen: setOpen,
  });
}

export default AddSafetyInstruction;

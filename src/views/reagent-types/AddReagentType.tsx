import { useMutation } from "react-query";
import "../../api/dataProviders/dataProviders";
import { Names } from "../../api/common/dataNames";
import { DataProviders } from "../../api/dataProviders/DataProvider.ts";
import FormPage from "../../components/basic/FormPage";
import ReagentTypeForm from "./ReagentTypeForm";
import { useContext } from "react";
import { APIAlertContext } from "../../providers/alertProvider";
import { useNavigate } from "react-router-dom";
import { ReagentTypeInterface } from "../../api/interfaces/reagentType.ts";

function AddReagentType({
  setOpen,
  refetch,
}: {
  setOpen: (value: boolean) => void;
  refetch: () => void;
}) {
  const navigate = useNavigate();
  const { addAlert } = useContext(APIAlertContext);
  const { mutate: createReagentTypeMutate } = useMutation(
    DataProviders.REAGENT_TYPES.createItem,
    {
      onSuccess: (data) => {
        addAlert(`${Names.added_new_object_id} ${data?.data?.id}`, "success");
        if (setOpen && refetch) {
          setOpen(false);
          refetch();
        } else navigate(`/user-panel/${DataProviders.REAGENT_TYPES.endpoint}`);
      },
    },
  );

  const onSubmit = async (data: ReagentTypeInterface) => {
    createReagentTypeMutate(data);
  };

  return FormPage({
    title: Names.reagent_types + " - " + Names.add_new,
    content: <ReagentTypeForm onSubmit={onSubmit} />,
    setDialogOpen: setOpen,
  });
}

export default AddReagentType;

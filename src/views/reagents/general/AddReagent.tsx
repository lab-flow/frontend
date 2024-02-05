import { useMutation } from "react-query";
import { Names } from "../../../api/common/dataNames.ts";
import ReagentForm from "./ReagentForm";
import { DataProviders } from "../../../api/dataProviders/DataProvider.ts";
import FormPage from "../../../components/basic/FormPage";
import { useContext } from "react";
import { APIAlertContext } from "../../../providers/alertProvider";
import { useNavigate } from "react-router-dom";
import { ReagentFormInterface } from "../../../api/interfaces/reagent.ts";

function AddReagent({ setOpen }: { setOpen: (value: boolean) => void }) {
  const navigate = useNavigate();
  const { addAlert } = useContext(APIAlertContext);

  const { mutate: addReagentMutate } = useMutation(
    DataProviders.REAGENTS.createMultipartItem,
    {
      onSuccess: (data) => {
        addAlert(`${Names.added_new_object_id} ${data?.data?.id}`, "success");
        if (setOpen) {
          setOpen(false);
        } else navigate(`/reagents/${data?.data?.id}`);
      },
    },
  );

  const onSubmit = async (data: ReagentFormInterface) => {
    addReagentMutate(data);
  };

  const defaultValues = {
    is_usage_record_required: true,
  };

  return FormPage({
    title: Names.reagents + " - " + Names.new_item,
    content: (
      <ReagentForm
        onSubmit={onSubmit}
        defaultValues={defaultValues as ReagentFormInterface}
      />
    ),
    setDialogOpen: setOpen,
  });
}

export default AddReagent;

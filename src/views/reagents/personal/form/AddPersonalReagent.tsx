import { Names } from "../../../../api/common/dataNames.ts";
import PersonalReagentForm from "./PersonalReagentForm.tsx";
import { useMutation } from "react-query";
import { DataProviders } from "../../../../api/dataProviders/DataProvider.ts";
import FormPage from "../../../../components/basic/FormPage";
import { useContext } from "react";
import { APIAlertContext } from "../../../../providers/alertProvider";
import { useNavigate } from "react-router-dom";

function AddPersonalReagent({
  setOpen,
}: {
  setOpen: (value: boolean) => void;
}) {
  const navigate = useNavigate();
  const { addAlert } = useContext(APIAlertContext);

  const { mutate: addPersonalReagentMutate } = useMutation(
    DataProviders.PERSONAL_REAGENTS.createItem,
    {
      onSuccess: (data) => {
        const id = data.data[0].id || data.data.id;
        if (setOpen) {
          setOpen(false);
        } else navigate(`/${DataProviders.PERSONAL_REAGENTS.endpoint}/${id}`);
        const items_count = Array.isArray(data.data) ? data.data.length : 1;
        addAlert(`${Names.count_entered_reagents}: ${items_count}`, "success");
      },
    },
  );

  const onSubmit = async (form_data: { count: number }) => {
    const { count, ...data } = form_data;

    const data_array = [];
    const items_count = count || 1;
    for (let i = 0; i < items_count; i++) {
      data_array.push(data);
    }
    addPersonalReagentMutate(data_array);
  };

  return FormPage({
    title: Names.personal_reagents + " - " + Names.add_new,
    content: <PersonalReagentForm onSubmit={onSubmit} />,
    setDialogOpen: setOpen,
  });
}

export default AddPersonalReagent;

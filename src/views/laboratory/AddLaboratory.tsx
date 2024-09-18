import { useMutation } from "react-query";

import "../../api/dataProviders/dataProviders";
import { Names } from "../../api/common/dataNames";
import { DataProviders } from "../../api/dataProviders/DataProvider.ts";
import FormPage from "../../components/basic/FormPage";
import LaboratoryForm from "./LaboratoryForm.tsx";
import { useContext } from "react";
import { APIAlertContext } from "../../providers/alertProvider";
import { useNavigate } from "react-router-dom";
import { LaboratoryInterface } from "../../api/interfaces/laboratory.ts";

function AddLaboratory({
  setOpen,
  refetch,
}: {
  setOpen: (value: boolean) => void;
  refetch: () => void;
}) {
  const navigate = useNavigate();
  const { addAlert } = useContext(APIAlertContext);

  const { mutate: createMutate } = useMutation(
    DataProviders.LABORATORIES.createItem,
    {
      onSuccess: (data) => {
        addAlert(Names.added_new_object_id + data?.data?.id, "success");
        if (setOpen && refetch) {
          setOpen(false);
          refetch();
        } else
          navigate(
            `/user-panel/${DataProviders.LABORATORIES.endpoint}`,
          );
      },
    },
  );

  const onSubmit = async (data: LaboratoryInterface) => {
    createMutate(data);
  };

  return FormPage({
    title: Names.laboratory + " - " + Names.new_item,
    content: <LaboratoryForm onSubmit={onSubmit} />,
    setDialogOpen: setOpen,
  });
}

export default AddLaboratory;

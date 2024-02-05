import { useMutation } from "react-query";
import "../../api/dataProviders/dataProviders";
import { Names } from "../../api/common/dataNames";
import { DataProviders } from "../../api/dataProviders/DataProvider.ts";
import FormPage from "../../components/basic/FormPage";
import ClpClassificationForm from "./ClpClassificationForm";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { APIAlertContext } from "../../providers/alertProvider";
import { ClpClassificationInterface } from "../../api/interfaces/clpClassification.ts";

function AddClpClassification({
  setOpen,
  refetch,
}: {
  setOpen: (value: boolean) => void;
  refetch: () => void;
}) {
  const navigate = useNavigate();
  const { addAlert } = useContext(APIAlertContext);
  const { mutate: createClPClassificationMutate } = useMutation(
    DataProviders.CLP_CLASSIFICATIONS.createItem,
    {
      onSuccess: (data) => {
        addAlert(`${Names.added_new_object_id} ${data?.data?.id}`, "success");
        if (setOpen && refetch) {
          setOpen(false);
          refetch();
        } else
          navigate(`/user-panel/${DataProviders.CLP_CLASSIFICATIONS.endpoint}`);
      },
    },
  );

  const onSubmit = async (data: ClpClassificationInterface) => {
    createClPClassificationMutate(data);
  };

  return FormPage({
    title: Names.clp_classification + " - " + Names.new_item,
    content: <ClpClassificationForm onSubmit={onSubmit} />,
    setDialogOpen: setOpen,
  });
}

export default AddClpClassification;

import { useMutation } from "react-query";
import "../../api/dataProviders/dataProviders";
import { Names } from "../../api/common/dataNames";
import { DataProviders } from "../../api/dataProviders/DataProvider.ts";
import FormPage from "../../components/basic/FormPage";
import StorageConditionsForm from "./StorageConditionsForm";
import { useContext } from "react";
import { APIAlertContext } from "../../providers/alertProvider";
import { useNavigate } from "react-router-dom";
import { StorageConditionInterface } from "../../api/interfaces/storageCondition.ts";

function AddStorageConditions({
  setOpen,
  refetch,
}: {
  setOpen: (value: boolean) => void;
  refetch: () => void;
}) {
  const navigate = useNavigate();
  const { addAlert } = useContext(APIAlertContext);

  const { mutate: createStorageConditionMutate } = useMutation(
    DataProviders.STORAGE_CONDITIONS.createItem,
    {
      onSuccess: (data) => {
        addAlert(Names.added_new_object_id + data?.data?.id, "success");
        if (setOpen && refetch) {
          setOpen(false);
          refetch();
        } else
          navigate(`/user-panel/${DataProviders.STORAGE_CONDITIONS.endpoint}`);
      },
    },
  );

  const onSubmit = async (data: StorageConditionInterface) => {
    createStorageConditionMutate(data);
  };

  return FormPage({
    title: Names.storage_conditions + " - " + Names.new_item,
    content: <StorageConditionsForm onSubmit={onSubmit} />,
    setDialogOpen: setOpen,
  });
}

export default AddStorageConditions;

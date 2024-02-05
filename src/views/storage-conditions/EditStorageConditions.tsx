import { useMutation, useQuery } from "react-query";
import "../../api/dataProviders/dataProviders";
import { Names } from "../../api/common/dataNames";
import { DataProviders } from "../../api/dataProviders/DataProvider.ts";
import StorageConditionsForm from "./StorageConditionsForm";
import { useNavigate, useParams } from "react-router-dom";
import { unpackDataIdValuesFromDict } from "../../components/datagrid/DataUnpackUtils";
import { useContext } from "react";
import { APIAlertContext } from "../../providers/alertProvider";
import { StorageConditionInterface } from "../../api/interfaces/storageCondition.ts";
import FormPage from "../../components/basic/FormPage.tsx";

function AddStorageConditions() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addAlert } = useContext(APIAlertContext);

  const { mutate: updateStorageConditionMutate } = useMutation(
    DataProviders.STORAGE_CONDITIONS.updateAllItem,
    {
      onSuccess: (data) => {
        addAlert(`${Names.updated_object_id} ${data?.data?.id}`, "success");
        navigate(`/user-panel/${DataProviders.STORAGE_CONDITIONS.endpoint}`);
        remove();
      },
    },
  );

  const onSubmit = async (data: StorageConditionInterface) => {
    updateStorageConditionMutate(data);
  };

  const { data, isLoading, remove } = useQuery(
    "storageConditionInfo" + id,
    () =>
      DataProviders.STORAGE_CONDITIONS.getItem(Number(id)).then(
        (res) =>
          unpackDataIdValuesFromDict(
            res.data,
            false,
          ) as unknown as StorageConditionInterface,
      ),
  );

  return FormPage({
    title: Names.storage_conditions + " - " + Names.edit,
    isLoading: isLoading,
    content: (
      <StorageConditionsForm onSubmit={onSubmit} defaultValues={data} edit />
    ),
  });
}

export default AddStorageConditions;

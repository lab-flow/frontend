import { useMutation, useQuery } from "react-query";
import "../../api/dataProviders/dataProviders";
import { Names } from "../../api/common/dataNames";
import { DataProviders } from "../../api/dataProviders/DataProvider.ts";
import ReagentTypeForm from "./ReagentTypeForm";
import { unpackDataIdValuesFromDict } from "../../components/datagrid/DataUnpackUtils";
import { useNavigate, useParams } from "react-router-dom";
import { useContext } from "react";
import { APIAlertContext } from "../../providers/alertProvider";
import { ReagentTypeInterface } from "../../api/interfaces/reagentType.ts";
import FormPage from "../../components/basic/FormPage.tsx";

function EditReagentType() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addAlert } = useContext(APIAlertContext);

  const { mutate: createReagentTypeMutate } = useMutation(
    DataProviders.REAGENT_TYPES.updateAllItem,
    {
      onSuccess: (data) => {
        addAlert(`${Names.updated_object_id} ${data?.data?.id}`, "success");
        navigate(`/user-panel/${DataProviders.REAGENT_TYPES.endpoint}`);
        remove();
      },
    },
  );

  const onSubmit = async (data: { id: number }) => {
    createReagentTypeMutate(data);
  };

  const { data, isLoading, remove } = useQuery("reagentTypeInfo" + id, () =>
    DataProviders.REAGENT_TYPES.getItem(Number(id)).then(
      (res) =>
        unpackDataIdValuesFromDict(
          res.data,
          false,
        ) as unknown as ReagentTypeInterface,
    ),
  );

  return FormPage({
    title: Names.reagent_types + " - " + Names.edit,
    isLoading: isLoading,
    content: <ReagentTypeForm onSubmit={onSubmit} defaultValues={data} edit />,
  });
}

export default EditReagentType;

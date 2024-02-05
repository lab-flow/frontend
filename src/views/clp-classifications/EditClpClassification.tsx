import { useMutation, useQuery } from "react-query";
import "../../api/dataProviders/dataProviders";
import { Names } from "../../api/common/dataNames";
import { DataProviders } from "../../api/dataProviders/DataProvider.ts";
import ClpClassificationForm from "./ClpClassificationForm";
import { useNavigate, useParams } from "react-router-dom";
import { unpackDataIdValuesFromDict } from "../../components/datagrid/DataUnpackUtils";
import { useContext } from "react";
import { APIAlertContext } from "../../providers/alertProvider";
import { ClpClassificationInterface } from "../../api/interfaces/clpClassification.ts";
import FormPage from "../../components/basic/FormPage.tsx";

function EditClpClassification() {
  const { id } = useParams();
  const { addAlert } = useContext(APIAlertContext);
  const navigate = useNavigate();

  const { mutate: updateClPClassificationMutate } = useMutation(
    DataProviders.CLP_CLASSIFICATIONS.updateAllItem,
    {
      onSuccess: (data) => {
        addAlert(`${Names.updated_object_id} ${data?.data?.id}`, "success");
        navigate(`/user-panel/${DataProviders.CLP_CLASSIFICATIONS.endpoint}`);
        remove();
      },
    },
  );

  const onSubmit = async (data: { id: number }) => {
    updateClPClassificationMutate(data);
  };

  const { data, isLoading, remove } = useQuery(
    "clpClassificationInfo" + id,
    () =>
      DataProviders.CLP_CLASSIFICATIONS.getItem(Number(id)).then(
        (res) =>
          unpackDataIdValuesFromDict(
            res.data,
            false,
          ) as unknown as ClpClassificationInterface,
      ),
  );

  return FormPage({
    title: Names.clp_classification + " - " + Names.edit,
    isLoading: isLoading,
    content: <ClpClassificationForm onSubmit={onSubmit} defaultValues={data} />,
  });
}

export default EditClpClassification;

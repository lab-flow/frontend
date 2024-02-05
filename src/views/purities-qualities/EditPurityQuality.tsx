import { useMutation, useQuery } from "react-query";
import "../../api/dataProviders/dataProviders";
import { Names } from "../../api/common/dataNames";
import { DataProviders } from "../../api/dataProviders/DataProvider.ts";
import PurityQualityForm from "./PurityQualityForm";
import { useNavigate, useParams } from "react-router-dom";
import { unpackDataIdValuesFromDict } from "../../components/datagrid/DataUnpackUtils";
import { useContext } from "react";
import { APIAlertContext } from "../../providers/alertProvider";
import { PurityQualityInterface } from "../../api/interfaces/purityQuality.ts";
import FormPage from "../../components/basic/FormPage.tsx";

function EditPurityQuality() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addAlert } = useContext(APIAlertContext);

  const { mutate: updatePurityQuality } = useMutation(
    DataProviders.PURITIES_QUALITIES.updateAllItem,
    {
      onSuccess: (data) => {
        addAlert(`${Names.updated_object_id} ${data?.data?.id}`, "success");
        navigate(`/user-panel/${DataProviders.PURITIES_QUALITIES.endpoint}`);
        remove();
      },
    },
  );

  const onSubmit = async (data: { id: number }) => {
    updatePurityQuality(data);
  };

  const { data, isLoading, remove } = useQuery("purityQualityInfo" + id, () =>
    DataProviders.PURITIES_QUALITIES.getItem(Number(id)).then(
      (res) =>
        unpackDataIdValuesFromDict(
          res.data,
          false,
        ) as unknown as PurityQualityInterface,
    ),
  );

  return FormPage({
    title: Names.purities_qualities + " - " + Names.edit,
    isLoading: isLoading,
    content: (
      <PurityQualityForm onSubmit={onSubmit} defaultValues={data} edit />
    ),
  });
}

export default EditPurityQuality;

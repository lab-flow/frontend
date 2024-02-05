import { useMutation, useQuery } from "react-query";

import "../../api/dataProviders/dataProviders";
import { Names } from "../../api/common/dataNames";
import { DataProviders } from "../../api/dataProviders/DataProvider.ts";
import ConcentrationsForm from "./ConcentrationsForm";
import { useNavigate, useParams } from "react-router-dom";
import { unpackDataIdValuesFromDict } from "../../components/datagrid/DataUnpackUtils";
import { useContext } from "react";
import { APIAlertContext } from "../../providers/alertProvider";
import { ConcentrationsInterface } from "../../api/interfaces/concentrations.ts";
import FormPage from "../../components/basic/FormPage.tsx";

function EditConcentrations() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addAlert } = useContext(APIAlertContext);

  const { mutate: updateConcentrationsMutate } = useMutation(
    DataProviders.CONCENTRATIONS.updateAllItem,
    {
      onSuccess: (data) => {
        addAlert(`${Names.updated_object_id} ${data?.data?.id}`, "success");
        navigate(`/user-panel/${DataProviders.CONCENTRATIONS.endpoint}`);
        remove();
      },
    },
  );

  const onSubmit = async (data: { id: number }) => {
    updateConcentrationsMutate(data);
  };

  const { data, isLoading, remove } = useQuery("concentrationsInfo" + id, () =>
    DataProviders.CONCENTRATIONS.getItem(Number(id)).then(
      (res) =>
        unpackDataIdValuesFromDict(
          res.data,
          false,
        ) as unknown as ConcentrationsInterface,
    ),
  );

  return FormPage({
    title: Names.concentrations + " - " + Names.edit,
    isLoading: isLoading,
    content: (
      <ConcentrationsForm onSubmit={onSubmit} defaultValues={data} edit />
    ),
  });
}

export default EditConcentrations;

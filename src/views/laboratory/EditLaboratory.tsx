import { useMutation, useQuery } from "react-query";

import "../../api/dataProviders/dataProviders.ts";
import { Names } from "../../api/common/dataNames.ts";
import { DataProviders } from "../../api/dataProviders/DataProvider.ts";
import LaboratoryForm from "./LaboratoryForm.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { unpackDataIdValuesFromDict } from "../../components/datagrid/DataUnpackUtils.tsx";
import { useContext } from "react";
import { APIAlertContext } from "../../providers/alertProvider.tsx";
import FormPage from "../../components/basic/FormPage.tsx";
import { LaboratoryInterface } from "../../api/interfaces/laboratory.ts";

function EditLaboratory() {
  const { id } = useParams();
  const { addAlert } = useContext(APIAlertContext);
  const navigate = useNavigate();

  const { mutate: updatePrecautionaryStatementMutate } = useMutation(
    DataProviders.LABORATORIES.updateAllItem,
    {
      onSuccess: (data) => {
        addAlert(`${Names.updated_object_id} ${data?.data?.id}`, "success");
        navigate(
          `/user-panel/${DataProviders.LABORATORIES.endpoint}`,
        );
        remove();
      },
    },
  );

  const onSubmit = async (data: { id: number }) => {
    updatePrecautionaryStatementMutate(data);
  };

  const { data, isLoading, remove } = useQuery(
    "laboratories" + id,
    () =>
      DataProviders.LABORATORIES.getItem(Number(id)).then(
        (res) =>
          unpackDataIdValuesFromDict(
            res.data,
            false,
          ) as unknown as LaboratoryInterface,
      ),
  );

  return FormPage({
    title: Names.laboratory + " - " + Names.edit,
    isLoading: isLoading,
    content: (
      <LaboratoryForm onSubmit={onSubmit} defaultValues={data} />
    ),
  });
}

export default EditLaboratory;

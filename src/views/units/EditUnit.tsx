import { useMutation, useQuery } from "react-query";

import "../../api/dataProviders/dataProviders";
import { Names } from "../../api/common/dataNames";
import { DataProviders } from "../../api/dataProviders/DataProvider.ts";
import UnitsForm from "./UnitsForm";
import { useNavigate, useParams } from "react-router-dom";
import { unpackDataIdValuesFromDict } from "../../components/datagrid/DataUnpackUtils";
import { useContext } from "react";
import { APIAlertContext } from "../../providers/alertProvider";
import { UnitInterface } from "../../api/interfaces/unit.ts";
import FormPage from "../../components/basic/FormPage.tsx";

function EditUnit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addAlert } = useContext(APIAlertContext);

  const { mutate: createUnitMutate } = useMutation(
    DataProviders.UNITS.updateAllItem,
    {
      onSuccess: (data) => {
        addAlert(`${Names.updated_object_id} ${data?.data?.id}`, "success");
        navigate(`/user-panel/${DataProviders.UNITS.endpoint}`);
        remove();
      },
    },
  );

  const onSubmit = async (data: UnitInterface) => {
    createUnitMutate(data);
  };

  const { data, isLoading, remove } = useQuery("unitInfo" + id, () =>
    DataProviders.UNITS.getItem(Number(id)).then(
      (res) =>
        unpackDataIdValuesFromDict(res.data, false) as unknown as UnitInterface,
    ),
  );

  return FormPage({
    title: Names.units + " - " + Names.edit,
    isLoading: isLoading,
    content: <UnitsForm onSubmit={onSubmit} defaultValues={data} edit />,
  });
}

export default EditUnit;

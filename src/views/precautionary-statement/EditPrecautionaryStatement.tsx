import { useMutation, useQuery } from "react-query";

import "../../api/dataProviders/dataProviders";
import { Names } from "../../api/common/dataNames";
import { DataProviders } from "../../api/dataProviders/DataProvider.ts";
import PrecautionaryStatementForm from "./PrecautionaryStatementForm";
import { useNavigate, useParams } from "react-router-dom";
import { unpackDataIdValuesFromDict } from "../../components/datagrid/DataUnpackUtils";
import { useContext } from "react";
import { APIAlertContext } from "../../providers/alertProvider";
import { PrecautionaryStatementInterface } from "../../api/interfaces/precautionaryStatement.ts";
import FormPage from "../../components/basic/FormPage.tsx";

function EditPrecautionaryStatement() {
  const { id } = useParams();
  const { addAlert } = useContext(APIAlertContext);
  const navigate = useNavigate();

  const { mutate: updatePrecautionaryStatementMutate } = useMutation(
    DataProviders.PRECAUTIONARY_STATEMENT.updateAllItem,
    {
      onSuccess: (data) => {
        addAlert(`${Names.updated_object_id} ${data?.data?.id}`, "success");
        navigate(
          `/user-panel/${DataProviders.PRECAUTIONARY_STATEMENT.endpoint}`,
        );
        remove();
      },
    },
  );

  const onSubmit = async (data: { id: number }) => {
    updatePrecautionaryStatementMutate(data);
  };

  const { data, isLoading, remove } = useQuery(
    "precautionaryStatementInfo" + id,
    () =>
      DataProviders.PRECAUTIONARY_STATEMENT.getItem(Number(id)).then(
        (res) =>
          unpackDataIdValuesFromDict(
            res.data,
            false,
          ) as unknown as PrecautionaryStatementInterface,
      ),
  );

  return FormPage({
    title: Names.precautionary_statements + " - " + Names.edit,
    isLoading: isLoading,
    content: (
      <PrecautionaryStatementForm onSubmit={onSubmit} defaultValues={data} />
    ),
  });
}

export default EditPrecautionaryStatement;

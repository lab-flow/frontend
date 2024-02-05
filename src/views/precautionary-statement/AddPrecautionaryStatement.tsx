import { useMutation } from "react-query";

import "../../api/dataProviders/dataProviders";
import { Names } from "../../api/common/dataNames";
import { DataProviders } from "../../api/dataProviders/DataProvider.ts";
import FormPage from "../../components/basic/FormPage";
import PrecautionaryStatementForm from "./PrecautionaryStatementForm";
import { useContext } from "react";
import { APIAlertContext } from "../../providers/alertProvider";
import { useNavigate } from "react-router-dom";
import { PrecautionaryStatementInterface } from "../../api/interfaces/precautionaryStatement.ts";

function AddPrecautionaryStatement({
  setOpen,
  refetch,
}: {
  setOpen: (value: boolean) => void;
  refetch: () => void;
}) {
  const navigate = useNavigate();
  const { addAlert } = useContext(APIAlertContext);

  const { mutate: createMutate } = useMutation(
    DataProviders.PRECAUTIONARY_STATEMENT.createItem,
    {
      onSuccess: (data) => {
        addAlert(Names.added_new_object_id + data?.data?.id, "success");
        if (setOpen && refetch) {
          setOpen(false);
          refetch();
        } else
          navigate(
            `/user-panel/${DataProviders.PRECAUTIONARY_STATEMENT.endpoint}`,
          );
      },
    },
  );

  const onSubmit = async (data: PrecautionaryStatementInterface) => {
    createMutate(data);
  };

  return FormPage({
    title: Names.precautionary_statements + " - " + Names.new_item,
    content: <PrecautionaryStatementForm onSubmit={onSubmit} />,
    setDialogOpen: setOpen,
  });
}

export default AddPrecautionaryStatement;

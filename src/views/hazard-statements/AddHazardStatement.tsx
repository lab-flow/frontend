import { useMutation } from "react-query";
import "../../api/dataProviders/dataProviders";
import { Names } from "../../api/common/dataNames";
import HazardStatementForm from "./HazardStatementForm";
import { DataProviders } from "../../api/dataProviders/DataProvider.ts";
import FormPage from "../../components/basic/FormPage";
import { useContext } from "react";
import { APIAlertContext } from "../../providers/alertProvider";
import { useNavigate } from "react-router-dom";
import { HazardStatementsFormInterface } from "../../api/interfaces/hazardStatements.ts";

function AddHazardStatement({
  setOpen,
  refetch,
}: {
  setOpen: (value: boolean) => void;
  refetch: () => void;
}) {
  const navigate = useNavigate();
  const { addAlert } = useContext(APIAlertContext);

  const { mutate: createMutate } = useMutation(
    DataProviders.HAZARD_STATEMENTS.createItem,
    {
      onSuccess: (data) => {
        addAlert(Names.added_new_object_id + data?.data?.id, "success");
        if (setOpen && refetch) {
          setOpen(false);
          refetch();
        } else
          navigate(`/user-panel/${DataProviders.HAZARD_STATEMENTS.endpoint}`);
      },
    },
  );

  const onSubmit = async (data: HazardStatementsFormInterface) => {
    createMutate(data);
  };

  const defaultValues = {
    is_usage_record_required: false,
  };

  return FormPage({
    title: Names.hazard_statements + " - " + Names.add_new,
    content: (
      <HazardStatementForm
        onSubmit={onSubmit}
        defaultValues={defaultValues as HazardStatementsFormInterface}
      />
    ),
    setDialogOpen: setOpen,
  });
}

export default AddHazardStatement;

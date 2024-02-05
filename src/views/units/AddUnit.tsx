import { useMutation } from "react-query";

import "../../api/dataProviders/dataProviders";
import { Names } from "../../api/common/dataNames";
import { DataProviders } from "../../api/dataProviders/DataProvider.ts";
import FormPage from "../../components/basic/FormPage";
import UnitsForm from "./UnitsForm";
import { useContext } from "react";
import { APIAlertContext } from "../../providers/alertProvider";
import { useNavigate } from "react-router-dom";
import { UnitInterface } from "../../api/interfaces/unit.ts";

function AddUnit({
  setOpen,
  refetch,
}: {
  setOpen: (value: boolean) => void;
  refetch: () => void;
}) {
  const navigate = useNavigate();
  const { addAlert } = useContext(APIAlertContext);
  const { mutate: createUnitMutate } = useMutation(
    DataProviders.UNITS.createItem,
    {
      onSuccess: (data) => {
        addAlert(`${Names.added_new_object_id} ${data?.data?.id}`, "success");
        if (setOpen && refetch) {
          setOpen(false);
          refetch();
        } else navigate(`/user-panel/${DataProviders.UNITS.endpoint}`);
        refetch();
      },
    },
  );

  const onSubmit = async (data: UnitInterface) => {
    createUnitMutate(data);
  };

  return FormPage({
    title: Names.units + " - " + Names.add_new,
    content: <UnitsForm onSubmit={onSubmit} />,
    setDialogOpen: setOpen,
  });
}

export default AddUnit;

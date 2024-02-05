import { useMutation } from "react-query";

import "../../api/dataProviders/dataProviders";
import { Names } from "../../api/common/dataNames";
import { DataProviders } from "../../api/dataProviders/DataProvider.ts";
import FormPage from "../../components/basic/FormPage";
import ConcentrationsForm from "./ConcentrationsForm";
import { useContext } from "react";
import { APIAlertContext } from "../../providers/alertProvider";
import { useNavigate } from "react-router-dom";
import { ConcentrationsInterface } from "../../api/interfaces/concentrations.ts";

function AddConcentrations({
  setOpen,
  refetch,
}: {
  setOpen: (value: boolean) => void;
  refetch: () => void;
}) {
  const navigate = useNavigate();
  const { addAlert } = useContext(APIAlertContext);
  const { mutate: setConcentrationsMutate } = useMutation(
    DataProviders.CONCENTRATIONS.createItem,
    {
      onSuccess: (data) => {
        addAlert(`${Names.added_new_object_id} ${data?.data?.id}`, "success");
        if (setOpen && refetch) {
          setOpen(false);
          refetch();
        } else navigate(`/user-panel/${DataProviders.CONCENTRATIONS.endpoint}`);
      },
    },
  );

  const onSubmit = async (data: ConcentrationsInterface) => {
    setConcentrationsMutate(data);
  };

  return FormPage({
    title: Names.concentrations + " - " + Names.add_new,
    content: <ConcentrationsForm onSubmit={onSubmit} />,
    setDialogOpen: setOpen,
  });
}

export default AddConcentrations;

import { useMutation } from "react-query";
import "../../api/dataProviders/dataProviders";
import { Names } from "../../api/common/dataNames";
import { DataProviders } from "../../api/dataProviders/DataProvider.ts";
import FormPage from "../../components/basic/FormPage";
import PurityQualityForm from "./PurityQualityForm";
import { useContext } from "react";
import { APIAlertContext } from "../../providers/alertProvider";
import { useNavigate } from "react-router-dom";
import { PurityQualityInterface } from "../../api/interfaces/purityQuality.ts";

function AddPurityQuality({
  setOpen,
  refetch,
}: {
  setOpen: (value: boolean) => void;
  refetch: () => void;
}) {
  const navigate = useNavigate();
  const { addAlert } = useContext(APIAlertContext);
  const { mutate: createPurityQualityMutate } = useMutation(
    DataProviders.PURITIES_QUALITIES.createItem,
    {
      onSuccess: (data) => {
        addAlert(Names.added_new_object_id + data?.data?.id, "success");
        if (setOpen && refetch) {
          setOpen(false);
          refetch();
        } else
          navigate(`/user-panel/${DataProviders.PURITIES_QUALITIES.endpoint}`);
      },
    },
  );

  const onSubmit = async (data: PurityQualityInterface) => {
    createPurityQualityMutate(data);
  };

  return FormPage({
    title: Names.purities_qualities + " - " + Names.new_item,
    content: <PurityQualityForm onSubmit={onSubmit} />,
    setDialogOpen: setOpen,
  });
}

export default AddPurityQuality;

import { useMutation } from "react-query";
import "../../api/dataProviders/dataProviders";
import { Names } from "../../api/common/dataNames";
import { DataProviders } from "../../api/dataProviders/DataProvider.ts";
import FormPage from "../../components/basic/FormPage";
import PictogramsForm from "./PictogramsForm";
import { useContext } from "react";
import { APIAlertContext } from "../../providers/alertProvider";
import { useNavigate } from "react-router-dom";
import { PictogramsInterface } from "../../api/interfaces/pictograms.ts";

function AddPictograms({
  setOpen,
  refetch,
}: {
  setOpen: (value: boolean) => void;
  refetch: () => void;
}) {
  const navigate = useNavigate();
  const { addAlert } = useContext(APIAlertContext);
  const { mutate: createStorageConditionMutate } = useMutation(
    DataProviders.PICTOGRAMS.createMultipartItem,
    {
      onSuccess: (data) => {
        addAlert(`${Names.added_new_object_id} ${data?.data?.id}`, "success");
        if (setOpen && refetch) {
          setOpen(false);
          refetch();
        } else navigate(`/user-panel/${DataProviders.PICTOGRAMS.endpoint}`);
      },
    },
  );

  const onSubmit = async (data: PictogramsInterface) => {
    createStorageConditionMutate(data);
  };

  return FormPage({
    title: Names.pictograms + " - " + Names.add_new,
    content: <PictogramsForm onSubmit={onSubmit} />,
    setDialogOpen: setOpen,
  });
}

export default AddPictograms;

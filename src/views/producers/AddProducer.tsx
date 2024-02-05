import { useMutation } from "react-query";
import "../../api/dataProviders/dataProviders";
import { Names } from "../../api/common/dataNames";
import ProducerForm from "./ProducerForm";
import { DataProviders } from "../../api/dataProviders/DataProvider.ts";
import FormPage from "../../components/basic/FormPage";
import { useContext } from "react";
import { APIAlertContext } from "../../providers/alertProvider";
import { useNavigate } from "react-router-dom";

function AddProducer({
  setOpen,
  refetch,
}: {
  setOpen: (value: boolean) => void;
  refetch: () => void;
}) {
  const navigate = useNavigate();
  const { addAlert } = useContext(APIAlertContext);
  const { mutate: createProducerMutate } = useMutation(
    DataProviders.PRODUCERS.createItem,
    {
      onSuccess: (data) => {
        addAlert(Names.added_new_object_id + data?.data?.id, "success");
        if (setOpen) {
          refetch();
          setOpen(false);
        } else navigate(`/user-panel/${DataProviders.PRODUCERS.endpoint}`);
      },
    },
  );

  const onSubmit = async (data: object) => {
    createProducerMutate(data);
  };

  return FormPage({
    title: Names.producers + " - " + Names.new_item,
    content: <ProducerForm onSubmit={onSubmit} />,
    setDialogOpen: setOpen,
  });
}

export default AddProducer;

import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import "../../api/dataProviders/dataProviders";
import { Names } from "../../api/common/dataNames";
import ProducerForm from "./ProducerForm";
import { DataProviders } from "../../api/dataProviders/DataProvider.ts";
import { useContext } from "react";
import { APIAlertContext } from "../../providers/alertProvider";
import FormPage from "../../components/basic/FormPage.tsx";

function EditProducer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addAlert } = useContext(APIAlertContext);

  const { mutate: updateProducerMutate } = useMutation(
    DataProviders.PRODUCERS.updateAllItem,
    {
      onSuccess: (data) => {
        addAlert(`${Names.updated_object_id} ${data?.data?.id}`, "success");
        navigate(`/user-panel/${DataProviders.PRODUCERS.endpoint}`);
        remove();
      },
    },
  );

  const onSubmit = async (data: { id: number }) => {
    updateProducerMutate(data);
  };

  const { data, isLoading, remove } = useQuery("producerInfo" + id, () =>
    DataProviders.PRODUCERS.getItem(Number(id)).then((res) => res.data),
  );

  return FormPage({
    title: Names.producer + " - " + Names.edit,
    isLoading: isLoading,
    content: <ProducerForm onSubmit={onSubmit} defaultValues={data} edit />,
  });
}

export default EditProducer;

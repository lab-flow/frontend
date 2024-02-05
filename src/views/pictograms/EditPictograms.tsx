import { useMutation, useQuery } from "react-query";
import "../../api/dataProviders/dataProviders";
import { Names } from "../../api/common/dataNames";
import { DataProviders } from "../../api/dataProviders/DataProvider.ts";
import PictogramsForm from "./PictogramsForm";
import { useNavigate, useParams } from "react-router-dom";
import { unpackDataIdValuesFromDict } from "../../components/datagrid/DataUnpackUtils";
import { useContext } from "react";
import { APIAlertContext } from "../../providers/alertProvider";
import { PictogramsInterface } from "../../api/interfaces/pictograms.ts";
import FormPage from "../../components/basic/FormPage.tsx";

function EditPictograms() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addAlert } = useContext(APIAlertContext);

  const { mutate: editPictogramMutate } = useMutation(
    DataProviders.PICTOGRAMS.updateMultipartItem,
    {
      onSuccess: (data) => {
        addAlert(`${Names.updated_object_id} ${data?.data?.id}`, "success");
        navigate(`/user-panel/${DataProviders.PICTOGRAMS.endpoint}`);
        remove();
      },
    },
  );

  const onSubmit = async (data: { id: number }) => {
    editPictogramMutate(data);
  };

  const { data, isLoading, remove } = useQuery("pictogramsInfo" + id, () =>
    DataProviders.PICTOGRAMS.getItem(Number(id)).then(
      (res) =>
        unpackDataIdValuesFromDict(
          res.data,
          false,
        ) as unknown as PictogramsInterface,
    ),
  );

  return FormPage({
    title: Names.pictograms + " - " + Names.edit,
    isLoading: isLoading,
    content: <PictogramsForm onSubmit={onSubmit} defaultValues={data} />,
  });
}

export default EditPictograms;

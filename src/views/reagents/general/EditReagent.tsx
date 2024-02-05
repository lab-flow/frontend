import { useMutation, useQuery } from "react-query";
import { Names } from "../../../api/common/dataNames.ts";
import ReagentForm from "./ReagentForm";
import { useNavigate, useParams } from "react-router-dom";
import { DataProviders } from "../../../api/dataProviders/DataProvider.ts";
import { unpackDataIdValuesFromDict } from "../../../components/datagrid/DataUnpackUtils";
import { useContext } from "react";
import { APIAlertContext } from "../../../providers/alertProvider";
import { ReagentFormInterface } from "../../../api/interfaces/reagent.ts";
import { SubmitHandler } from "react-hook-form";
import FormPage from "../../../components/basic/FormPage.tsx";

function EditReagent() {
  const { id } = useParams();
  const { addAlert } = useContext(APIAlertContext);
  const navigate = useNavigate();

  const { mutate: updateReagentMutate } = useMutation(
    DataProviders.REAGENTS.updateMultipartItem,
    {
      onSuccess: (data) => {
        addAlert(Names.updated_object_id + data?.data?.id, "success");
        navigate(`/${DataProviders.REAGENTS.endpoint}/${data?.data?.id}`);
        remove();
      },
    },
  );

  const onSubmit = async (updatedData: { id: number }) => {
    updateReagentMutate(updatedData);
  };

  const { data, isLoading, remove } = useQuery("reagentInfo" + id, () =>
    DataProviders.REAGENTS.getItem(Number(id)).then((res) => {
      const { safety_data_sheet, safety_instruction, ...data } =
        unpackDataIdValuesFromDict(
          res.data,
          false,
        ) as unknown as ReagentFormInterface;
      return data;
    }),
  );

  return FormPage({
    title: Names.reagent + " - " + Names.edit,
    isLoading: isLoading,
    content: (
      <ReagentForm
        onSubmit={onSubmit as unknown as SubmitHandler<ReagentFormInterface>}
        defaultValues={data}
        edit
      />
    ),
  });
}

export default EditReagent;

import { Names } from "../../../../api/common/dataNames.ts";
import PersonalReagentForm from "./PersonalReagentForm.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { DataProviders } from "../../../../api/dataProviders/DataProvider.ts";
import { unpackDataIdValuesFromDict } from "../../../../components/datagrid/DataUnpackUtils";
import { useContext } from "react";
import { APIAlertContext } from "../../../../providers/alertProvider";
import { PersonalReagentFormInterface } from "../../../../api/interfaces/personalReagent.ts";
import { SubmitHandler } from "react-hook-form";
import FormPage from "../../../../components/basic/FormPage.tsx";

function EditPersonalReagent() {
  const { id } = useParams();
  const { addAlert } = useContext(APIAlertContext);
  const navigate = useNavigate();

  const { data, isLoading, remove } = useQuery(
    "personalReagentAllInfo" + id,
    () =>
      DataProviders.PERSONAL_REAGENTS.getItem(Number(id)).then(
        (data) =>
          unpackDataIdValuesFromDict(
            data.data,
            false,
          ) as unknown as PersonalReagentFormInterface,
      ),
  );

  const { mutate: updatePersonalReagentMutate } = useMutation(
    DataProviders.PERSONAL_REAGENTS.updateAllItem,
    {
      onSuccess: (data) => {
        if (data?.data?.id) {
          navigate(
            `/${DataProviders.PERSONAL_REAGENTS.endpoint}/${data?.data?.id}`,
          );
          remove();
        }
        addAlert(`${Names.updated_personal_reagent}`, "success");
      },
    },
  );

  return FormPage({
    title: Names.personal_reagents + " - " + Names.edit,
    isLoading: isLoading,
    content: (
      <PersonalReagentForm
        onSubmit={
          updatePersonalReagentMutate as SubmitHandler<PersonalReagentFormInterface>
        }
        defaultValues={data}
        edit
      />
    ),
  });
}

export default EditPersonalReagent;

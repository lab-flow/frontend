import { useMutation, useQuery } from "react-query";
import "../../api/dataProviders/dataProviders";
import { Names } from "../../api/common/dataNames";
import { DataProviders } from "../../api/dataProviders/DataProvider.ts";
import ProjectProcedureForm from "./ProjectProcedureForm";
import { useNavigate, useParams } from "react-router-dom";
import { unpackDataIdValuesFromDict } from "../../components/datagrid/DataUnpackUtils";
import { useContext } from "react";
import { APIAlertContext } from "../../providers/alertProvider";
import { ProjectProcedureInterface } from "../../api/interfaces/projectProcedure.ts";
import FormPage from "../../components/basic/FormPage.tsx";

function EditProjectProcedure() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addAlert } = useContext(APIAlertContext);

  const { mutate: editProjectProcedureMutate } = useMutation(
    DataProviders.PROJECT_PROCEDURES.updateAllItem,
    {
      onSuccess: (data) => {
        addAlert(`${Names.added_new_object_id} ${data?.data?.id}`, "success");
        navigate(`/user-panel/${DataProviders.PROJECT_PROCEDURES.endpoint}`);
        remove();
      },
    },
  );

  const onSubmit = async (data: { id: number }) => {
    editProjectProcedureMutate(data);
  };

  const { data, isLoading, remove } = useQuery(
    "projectProcedureInfo" + id,
    () =>
      DataProviders.PROJECT_PROCEDURES.getItem(Number(id)).then(
        (res) =>
          unpackDataIdValuesFromDict(
            res.data,
            false,
          ) as unknown as ProjectProcedureInterface,
      ),
  );

  return FormPage({
    title: Names.project_procedures + " - " + Names.edit,
    isLoading: isLoading,
    content: <ProjectProcedureForm onSubmit={onSubmit} defaultValues={data} />,
  });
}

export default EditProjectProcedure;

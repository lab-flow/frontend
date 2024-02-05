import { useMutation } from "react-query";
import "../../api/dataProviders/dataProviders";
import { Names } from "../../api/common/dataNames";
import { DataProviders } from "../../api/dataProviders/DataProvider.ts";
import ProjectProcedureForm from "./ProjectProcedureForm";
import FormPage from "../../components/basic/FormPage";
import { useContext } from "react";
import { APIAlertContext } from "../../providers/alertProvider";
import { useNavigate } from "react-router-dom";
import { ProjectProcedureInterface } from "../../api/interfaces/projectProcedure.ts";

function AddProjectProcedure({
  setOpen,
}: {
  setOpen: (value: boolean) => void;
}) {
  const navigate = useNavigate();
  const { addAlert } = useContext(APIAlertContext);
  const { mutate: createProjectProcedureMutate } = useMutation(
    DataProviders.PROJECT_PROCEDURES.createItem,
    {
      onSuccess: (data) => {
        addAlert(`${Names.added_new_object_id} ${data?.data?.id}`, "success");
        if (setOpen) {
          setOpen(false);
        } else
          navigate(`/user-panel/${DataProviders.PROJECT_PROCEDURES.endpoint}`);
      },
    },
  );

  const onSubmit = async (data: ProjectProcedureInterface) => {
    createProjectProcedureMutate(data);
  };

  return FormPage({
    title: Names.project_procedures + " - " + Names.new_item,
    content: <ProjectProcedureForm onSubmit={onSubmit} />,
    setDialogOpen: setOpen,
  });
}

export default AddProjectProcedure;

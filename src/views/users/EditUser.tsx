import { useMutation, useQuery } from "react-query";
import "../../api/dataProviders/dataProviders";
import { Names } from "../../api/common/dataNames";
import { UserFormInterface } from "../../api/interfaces/user";
import UserForm from "./UserForm";
import { useNavigate, useParams } from "react-router-dom";
import { DataProviders } from "../../api/dataProviders/DataProvider.ts";
import { useContext } from "react";
import { APIAlertContext } from "../../providers/alertProvider";
import FormPage from "../../components/basic/FormPage.tsx";

function EditUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addAlert } = useContext(APIAlertContext);

  const { data, isLoading, remove } = useQuery(["userInfo", id], () =>
    DataProviders.USERS.getItem(Number(id)).then((res) => res.data),
  );

  const { mutate: updateUserMutate } = useMutation(
    DataProviders.USERS.updateItem,
    {
      onSuccess: () => {
        addAlert(Names.updated, "success");
        navigate(`/admin-panel/${DataProviders.USERS.endpoint}/`);
        remove();
      },
    },
  );
  const onSubmit = async (data: UserFormInterface) => {
    if (data.password !== data.passwordConfirm) {
      addAlert(Names.passwords_not_match, "error");
      return;
    } else {
      updateUserMutate(data);
    }
  };

  return FormPage({
    title: `${Names.user} - ${Names.edit}`,
    isLoading: isLoading,
    content: <UserForm onSubmit={onSubmit} defaultValues={data} edit />,
  });
}

export default EditUser;

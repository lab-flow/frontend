import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { useContext } from "react";

import { UserFormInterface } from "../../api/interfaces/user";
import { APIAlertContext } from "../../providers/alertProvider";
import { DataProviders } from "../../api/dataProviders/DataProvider.ts";
import { Names } from "../../api/common/dataNames";
import FormPage from "../../components/basic/FormPage";
import UserForm from "./UserForm";

function AddUser() {
  const navigate = useNavigate();
  const { addAlert } = useContext(APIAlertContext);

  const { mutate: createUserMutate } = useMutation(
    DataProviders.USERS.createItem,
    {
      onSuccess: (data) => {
        const objectId = data?.data?.id;
        addAlert(Names.added_new_object_id + objectId, "success");
        navigate(`/admin-panel/${DataProviders.USERS.endpoint}`);
      },
    },
  );

  const onSubmit = async (data: UserFormInterface) => {
    if (data.password !== data.passwordConfirm) {
      addAlert(Names.passwords_not_match, "error");
    } else {
      createUserMutate(data);
    }
  };

  return FormPage({
    title: `${Names.user} - ${Names.add_new}`,
    content: <UserForm onSubmit={onSubmit} />,
  });
}

export default AddUser;

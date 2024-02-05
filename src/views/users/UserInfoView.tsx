import { useQuery } from "react-query";
import UserInfo from "./UserInfo.tsx";
import { useParams } from "react-router-dom";
import { APIErrorContext } from "../../providers/errorProvider.tsx";
import { useContext } from "react";
import { DataProviders } from "../../api/dataProviders/DataProvider.ts";

function UserInfoView() {
  const { id } = useParams();
  const { addError } = useContext(APIErrorContext);
  const {
    data: user,
    isFetching,
    isLoading,
    error,
  } = useQuery("getUserInfo", () => DataProviders.USERS.getItem(id));

  if (error) {
    addError(
      (error as { response: { data: { detail: string } } })?.response?.data
        ?.detail,
    );
  }
  return UserInfo(user?.data, isLoading || isFetching);
}

export default UserInfoView;

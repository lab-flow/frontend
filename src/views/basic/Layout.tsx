import { Outlet } from "react-router-dom";

import NavBar from "../../components/nav/NavBar.tsx";
import { WidePageContainer } from "../../components/basic/PageContainer.tsx";
import ErrorNotification from "../../components/basic/ErrorNotification.tsx";
import { Breakpoint } from "@mui/system";

function Layout() {
  return (
    <>
      <ErrorNotification />
      <NavBar />
      <WidePageContainer maxWidth={"90vw" as Breakpoint}>
        <Outlet />
      </WidePageContainer>
    </>
  );
}

export default Layout;

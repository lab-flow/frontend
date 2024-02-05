import { ReactElement, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Grid } from "@mui/material";

import SubNavBar from "../../components/nav/SubNavBar.tsx";

interface BasePanelProps {
  subNavBarItems: Array<{
    name: string;
    id: string;
    icon?: ReactElement;
    component: ReactElement;
    dividerBefore?: boolean;
    visible?: boolean;
  }>;
  baseUrl: string;
}

function BasePanel(props: BasePanelProps) {
  const { subNavBarItems, baseUrl } = props;
  const { id } = useParams();
  const [page, setPage] = useState<ReactElement>();

  useEffect(() => {
    const nextPage = subNavBarItems.find((item) => item.id === id)?.component;
    nextPage && setPage(nextPage);
  }, [id, subNavBarItems]);

  return (
    <Grid item xs={12} container>
      <Grid item xs={12} sm={12} md={4} xl={2} style={{ paddingRight: "20px" }}>
        <SubNavBar items={subNavBarItems} baseUrl={baseUrl} />
      </Grid>
      <Grid item xs={12} sm={12} md={8} xl={10}>
        {page}
      </Grid>
    </Grid>
  );
}

export default BasePanel;

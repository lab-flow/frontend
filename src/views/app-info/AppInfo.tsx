import DashboardCard from "../../components/basic/DashboardCard";
import "../../api/dataProviders/dataProviders";
import { Names } from "../../api/common/dataNames.ts";
import { Box, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";

function AppInfo() {
  return DashboardCard({
    title: Names.app_info,
    content: (
      <>
        <Grid container spacing={1} sx={{ margin: "15px 0 30px " }}>
          <Grid item>
            {" "}
            <Link key="logo" to="/" style={{ marginRight: "16px" }}>
              <img
                src="/logo-black.svg"
                alt="logo"
                style={{ height: "40px" }}
              />
            </Link>
          </Grid>
          <Grid item>
          <Typography>
              <p>LabFlow 1.0.0</p>
              <p>MIT License</p>
              <p>Copyright &copy; 2024 LabFlow</p>
            </Typography>
          </Grid>
        </Grid>

        <Typography>{Names.app_description}</Typography>

        <Typography sx={{ margin: "10px 0 0 0" }}>
          {Names.authors_header}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            margin: "10px 0 0 20px",
            gap: "10px",
          }}
        >
          <ul
            style={{
              listStyleType: "disc",
              paddingInlineStart: "20px",
              margin: 0,
            }}
          >
            <li>
              <Typography variant="body1">
                Sebastian Misztal <br />{" "}
                <a target="_top" href="mailto:sebmis17@gmail.com">
                  sebmis17@gmail.com
                </a>
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Maciej Nessel <br />{" "}
                <a target="_top" href="mailto:maciej.nessel@gmail.com">
                  maciej.nessel@gmail.com
                </a>
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Tomasz Ostafin <br />{" "}
                <a target="_top" href="mailto:ostafintomasz1@gmail.com">
                  ostafintomasz1@gmail.com
                </a>
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Jan Ziętek <br />{" "}
                <a target="_top" href="mailto:zietekjanek@gmail.com">
                  zietekjanek@gmail.com
                </a>
              </Typography>
            </li>
          </ul>
        </Box>
      </>
    ),
  });
}

export default AppInfo;

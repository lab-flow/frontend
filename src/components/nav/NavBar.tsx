import { useContext, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  styled,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import { authenticationService } from "../../services/authenticationService.ts";
import { ADMIN_ROLE, ROLE } from "../../api/enums/userRoles.ts";
import { Names } from "../../api/common/dataNames.ts";
import Alerts from "../basic/Alerts";
import { APIAlertContext } from "../../providers/alertProvider";
import { DataProviders } from "../../api/dataProviders/DataProvider.ts";
import { PrivateComponent } from "../PrivateComponent";
import theme from "../../theme";
import CloseIcon from "@mui/icons-material/Close";
import { AlertColor } from "@mui/material/Alert/Alert";

const NavTypography = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
  textTransform: "uppercase",
}));

const NavLink = styled(Link)`
  margin-right: 16px;
`;

function NavBar() {
  const { addAlert } = useContext(APIAlertContext);
  const { logout, currentUserData } = authenticationService;
  const [menuOpen, setMenuOpen] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 910px)");

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    if (addAlert) {
      addAlert("Wylogowano", "success" as AlertColor);
    }
    window.location.reload();
  };

  const loginButtons = () => {
    if (currentUserData) {
      return (
        <>
          <Link key="user" to={"user-info/me"}>
            <NavTypography style={{ textTransform: "none" }}>
              <PersonIcon />
              {currentUserData?.username}
            </NavTypography>
          </Link>
          <Link
            key="logout"
            to="/"
            onClick={() => {
              handleLogout();
            }}
          >
            <NavTypography>{Names.logout}</NavTypography>
          </Link>
        </>
      );
    } else {
      return (
        <Link key="login" to="/login">
          <NavTypography>{Names.login}</NavTypography>
        </Link>
      );
    }
  };

  const pages = [
    { name: "Strona główna", url: "/", roles: null },
    { name: "Wiki", url: "/wiki/safety-instructions", roles: null },
    {
      name: "Moje Odczynniki",
      url: `/personal-reagents/me`,
      roles: [
        ROLE.LAB_WORKER,
        ROLE.LAB_MANAGER,
        ROLE.PROCEDURE_MANAGER,
        ADMIN_ROLE,
      ],
    },
    {
      name: "Panel użytkownika",
      url: "/user-panel/" + DataProviders.REAGENTS.endpoint,
      roles: [
        ROLE.LAB_WORKER,
        ROLE.LAB_MANAGER,
        ROLE.PROCEDURE_MANAGER,
        ADMIN_ROLE,
      ],
    },
    {
      name: "Raporty",
      url: "/reports/show",
      roles: [ROLE.LAB_MANAGER, ROLE.PROCEDURE_MANAGER, ADMIN_ROLE],
    },
    {
      name: "Statystyki",
      url: "/statistics",
      roles: [
        ROLE.LAB_WORKER,
        ROLE.LAB_MANAGER,
        ROLE.PROCEDURE_MANAGER,
        ADMIN_ROLE,
      ],
    },
    {
      name: "Panel administracyjny",
      url: "/admin-panel/users",
      roles: [ADMIN_ROLE, ROLE.LAB_MANAGER],
    },
  ];

  return (
    <>
      {isSmallScreen && (
        <AppBar sx={{ zIndex: 100 }} component="nav">
          <Toolbar
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleMenuToggle}
              >
                <MenuIcon />
              </IconButton>
            </Box>
            <Link key="logo" to="/" style={{ marginRight: "16px" }}>
              <img src="/logo.svg" alt="logo" style={{ height: "40px" }} />
            </Link>
            <Box>{loginButtons()}</Box>
          </Toolbar>
        </AppBar>
      )}

      {isSmallScreen ? (
        // Responsive Menu
        <Drawer anchor="left" open={menuOpen} onClose={closeMenu}>
          <Box
            sx={{ width: 350 }}
            role="presentation"
            onClick={closeMenu}
            onKeyDown={closeMenu}
          >
            <List>
              <ListItemIcon style={{ left: 20, top: 20, position: "absolute" }}>
                <CloseIcon
                  style={{
                    zIndex: 1000,
                    maxWidth: "40px",
                    minWidth: "40px",
                    height: "30px",
                  }}
                  onClick={closeMenu}
                />
              </ListItemIcon>
              <Box sx={{ height: "50px" }} />
              {pages.map((item) => (
                <PrivateComponent
                  key={item.name}
                  component={() => (
                    <Link
                      style={{ textDecoration: "none" }}
                      key={item.name}
                      to={item.url}
                    >
                      <ListItem style={{ color: theme.palette.text.primary }}>
                        <Typography
                          sx={{
                            height: "25px",
                            marginLeft: "15px",
                            ":hover": { fontWeight: 600 },
                          }}
                        >
                          {item.name}
                        </Typography>
                      </ListItem>
                    </Link>
                  )}
                  roles={item.roles}
                />
              ))}
            </List>
          </Box>
        </Drawer>
      ) : (
        // Top Menu
        <AppBar sx={{ zIndex: 100 }} component="nav">
          <Toolbar
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Link key="logo" to="/" style={{ marginRight: "16px" }}>
              <img src="/logo.svg" alt="logo" style={{ height: "40px" }} />
            </Link>
            <Box style={{ textAlign: "center" }}>
              {pages.map((item) => (
                <PrivateComponent
                  key={item.name}
                  component={() => (
                    <NavLink key={item.name} to={item.url}>
                      <NavTypography>{item.name}</NavTypography>
                    </NavLink>
                  )}
                  roles={item.roles}
                />
              ))}
            </Box>
            <Box>{loginButtons()}</Box>
          </Toolbar>
          <Alerts />
        </AppBar>
      )}
    </>
  );
}

export default NavBar;

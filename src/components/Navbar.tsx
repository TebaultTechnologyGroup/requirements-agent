import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
//import IconButton from "@mui/material/IconButton";
//import MenuIcon from "@mui/icons-material/Menu";
import { useAuthenticator } from "../auth/AuthContext";
//import { Login } from "@mui/icons-material";
//import { LoginPage } from "../pages/LoginPage";

export default function Navbar() {
  const { route, setRoute } = useAuthenticator();

  return (
    <AppBar position="static" sx={{ mb: 2 }}>
      <Toolbar>
        {/* <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton> */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Product Requirements Generator (Demo)
        </Typography>
        {route === "authenticated" ? (
          <Button color="inherit" onClick={() => setRoute("unauthenticated")}>
            Logout
          </Button>
        ) : (
          <Button color="inherit" href="/login">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

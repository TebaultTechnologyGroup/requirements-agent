import { Outlet } from "react-router";
import { Box } from "@mui/material";
import Navbar from "../components/Navbar";

function MainLayout() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Navbar />
      <Outlet />
    </Box>
  );
}
export default MainLayout;

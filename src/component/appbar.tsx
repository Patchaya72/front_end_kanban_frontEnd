import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { NotificationGetRespons } from "../model/notificationGetRespons";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AppbarPage() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<NotificationGetRespons[]>(
    []
  );
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [counts, setCount] = useState<number | null>(null);
  const user = JSON.parse(localStorage.getItem("user_id")!);
  const navigate = useNavigate();

  React.useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await axios.get<NotificationGetRespons[]>(
          "http://localhost:3000/notification/" + user
        );
        setNotifications(res.data);
        const count = await axios.get<{ unread_count: number }>(
          "http://localhost:3000/notification/count/" + user
        );
        setCount(count.data.unread_count);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    }
    fetchNotifications();
  }, [user]);

  async function updateRead() {
    try {
      await axios.put("http://localhost:3000/notification/is_read/" + user);
      const count = await axios.get<{ unread_count: number }>(
        "http://localhost:3000/notification/count/" + user
      );
      setCount(count.data.unread_count);
    } catch (error) {}
  }
  function logOut() {
    localStorage.clear;
    navigate(-1);
  }
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuOpen(false);
  };

  const handleNotificationsClick = () => {
    setAnchorEl(null); // Close menu when notifications are clicked
    setMenuOpen(false); // Close profile menu
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    updateRead();
    setDialogOpen(false);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={menuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={logOut}>Log out</MenuItem>
    </Menu>
  );

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              MUI
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <IconButton
                size="large"
                aria-label="show notifications"
                color="inherit"
                onClick={handleNotificationsClick}
              >
                <Badge badgeContent={counts} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        {renderMenu}
        <Dialog open={dialogOpen} onClose={handleDialogClose}>
          <DialogTitle>Notifications</DialogTitle>
          <Box sx={{ p: 2 }}>
            {notifications.map((notification, index) => (
              <Card key={index} sx={{ mb: 1 }}>
                <CardContent>
                  <Typography>{notification.notification_text}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Dialog>
      </Box>
    </>
  );
}

export default AppbarPage;

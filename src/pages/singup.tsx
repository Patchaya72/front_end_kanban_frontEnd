import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { toast, Toaster } from "sonner";
import { ServiceUser } from "../Service/userService";

function SingupPage() {
  const service = new ServiceUser();
  // TODO remove, this demo shouldn't need to reset the theme.
  const defaultTheme = createTheme();

  const navigateback = useNavigate();

  function navigateBack() {
    navigateback("/");
  }
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = {
      email: String(data.get("email") || ""),
      password: String(data.get("password") || ""),
      name: String(data.get("firstName") + "  " + data.get("lastName") || ""),
    };
    singup(body);
  };

  async function singup(body: {
    email: String;
    password: String;
    name: String;
  }) {
    try {
      const res = await service.addUser(body);
      //   const user: userGetResspones[] = res.data;
      if (res.status == 202) {
        // localStorage.clear();
        // localStorage.setItem("objectUser", JSON.stringify(user[0].id));
        console.log("ok");
        const promise = () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ name: "Sonner" }), 1000)
          );
        const promise2 = () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ name: "Sonner" }), 2000)
          );
        promise2().then(() => {
          navigateBack();
        });
        toast.promise(promise(), {
          loading: "loading...",
          success: "สมัครสำเร็จ",
          error: "Error",
        });
      } else {
        toast.error("ข้อมูลไม่ถูกต้อง"), toast.dismiss();
      }
    } catch (error) {}
  }

  return (
    <>
      <Toaster richColors position="top-center" />
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "#9DC08B" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, bgcolor: "#609966" }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link component="button" onClick={navigateBack}>
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}

export default SingupPage;

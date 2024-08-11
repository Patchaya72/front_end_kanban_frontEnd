import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { ServiceUser } from "../Service/userService";
import { toast, Toaster } from "sonner";
import { userGetResspones } from "../model/userGetRespons";

function LoginPage() {
  const navigate = useNavigate();
  const service = new ServiceUser();

  function Copyright(props: any) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        {...props}
      >
        {"Yimpei © "}
        <Link color="inherit" href="https://mui.com/">
          Kanban Board Website
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    );
  }

  function navigateTo() {
    navigate("/singup");
  }
  function navigateToHome() {
    navigate("/home");
  }

  const defaultTheme = createTheme();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const body = {
      email: String(data.get("email") || ""),
      password: String(data.get("password") || ""),
    };
    login(body);
  };

  async function login(body: { email: string; password: string }) {
    try {
      const res = await service.getLogin(body);
      const user: userGetResspones[] = res.data;
      if (res.status == 202) {
        localStorage.clear();
        localStorage.setItem("user_id", JSON.stringify(user[0].user_id));
        console.log(JSON.parse(localStorage.getItem("user_id")!));
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
            navigateToHome();
        });
        toast.promise(promise(), {
          loading: "loading...",
          success: "เข้าสู่ระบบสำเร็จ",
          error: "Error",
        });
      } else {
        toast.error("อีเมลหรือรหัสไม่ถูกต้อง"), toast.dismiss();
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
              Sign in
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, bgcolor: "#609966" }}
                // onClick={navigateTo}
              >
                Sign In
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link component="button" variant="body2" onClick={navigateTo}>
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      </ThemeProvider>
    </>
  );
}

export default LoginPage;

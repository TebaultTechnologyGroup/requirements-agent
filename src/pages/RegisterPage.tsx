import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  Alert,
  Grid,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { signUp, confirmSignUp, signIn } from "aws-amplify/auth";

import { Visibility, VisibilityOff } from "@mui/icons-material";

function RegisterPage() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfPassword = () => {
    setShowConfPassword(!showConfPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!firstName.trim()) {
      setError("First name is required");
      return;
    }

    if (!lastName.trim()) {
      setError("Last name is required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            given_name: firstName.trim(),
            family_name: lastName.trim(),
          },
        },
      });
      setNeedsConfirmation(true);
    } catch (err: any) {
      setError(err.message || "Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmation = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await confirmSignUp({
        username: email,
        confirmationCode,
      });
      // Auto sign in after confirmation
      await signIn({ username: email, password });
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to confirm account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (needsConfirmation) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          background: "primary.light",
        }}
      >
        <Container maxWidth="sm">
          <Paper elevation={3} sx={{ p: 4 }}>
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{ fontWeight: "bold" }}
              >
                Confirm Your Email
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We've sent a confirmation code to {email}
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleConfirmation}>
              <TextField
                label="Confirmation Code"
                fullWidth
                required
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                sx={{ mb: 3 }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
              >
                {loading ? "Confirming..." : "Confirm Email"}
              </Button>
            </form>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          mt: 3,
          p: 2,
          bgcolor: "#f3f4ff",
          borderRadius: 2,
          border: "1px solid #e0e4ff",
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ lineHeight: 1.6, px: 2 }}
        >
          <strong>Why Register?</strong> This demo uses live AI services to
          generate real documents. Authentication helps prevent misuse and keeps
          the demo available for genuine visitors interested in learning about
          AI automation solutions. If you have already registered,{" "}
          <Link
            sx={{ cursor: "pointer" }}
            onClick={() => {
              navigate("/login");
            }}
          >
            Click here to login.
          </Link>
        </Typography>
      </Box>
      <Box
        sx={{
          minHeight: "75vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container maxWidth="sm">
          <Paper elevation={3} sx={{ p: 4 }}>
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{ fontWeight: "bold" }}
              >
                Create Account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create an account to access the demo
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    autoFocus
                    label="First Name"
                    type="text"
                    fullWidth
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    autoComplete="given-name"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Last Name"
                    type="text"
                    fullWidth
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    autoComplete="family-name"
                  />
                </Grid>
              </Grid>
              <TextField
                margin="dense"
                label="Email"
                type="email"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mt: 2 }}
                autoComplete="email"
              />
              <TextField
                margin="dense"
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mt: 2 }}
                autoComplete="new-password"
                helperText="At least 8 characters"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                margin="dense"
                label="Confirm Password"
                type={showConfPassword ? "text" : "password"}
                fullWidth
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={{ mt: 2, mb: 3 }}
                autoComplete="new-password"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowConfPassword}
                          edge="end"
                        >
                          {showConfPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{ mb: 2 }}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{" "}
                <Link
                  component="button"
                  onClick={() => navigate("/login")}
                  sx={{ cursor: "pointer" }}
                >
                  Sign in here
                </Link>
              </Typography>
            </Box>

            <Box sx={{ textAlign: "center", mt: 1 }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate("/")}
                sx={{ cursor: "pointer" }}
              >
                Back to Home
              </Link>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
}

export default RegisterPage;

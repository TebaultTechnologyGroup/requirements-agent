// src/pages/DashboardPage.tsx
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Box, Grid, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { useAuthenticator } from "@aws-amplify/ui-react";

type Project = {
  id: string;
  title: string;
  createdAt: string;
  status?: string;
};

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const client = generateClient<Schema>();
  const { user } = useAuthenticator((ctx) => [ctx.user]);

  const quota: number = 5;

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      setLoading(true);
      setError("");

      const response = await client.models.Generation.list({
        filter: { userId: { eq: user.userId } },
      });

      console.log("Generations:", response);

      if (response.data) {
        const formattedProjects = response.data
          .map((gen) => ({
            id: gen.id,
            title: gen.title,
            createdAt: gen.createdAt || new Date().toISOString(),
            status: gen.status || undefined,
          }))
          // Sort by date, newest first
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );

        setProjects(formattedProjects);
      } else if (response.errors) {
        console.error("Errors loading projects:", response.errors);
        setError("Failed to load projects");
      }
    } catch (err) {
      console.error("Error loading projects:", err);
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "COMPLETED":
        return "#10b981";
      case "PROCESSING":
        return "#f59e0b";
      case "FAILED":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  function renderProjectCount(numProjects: number) {
    const remaining = quota - numProjects;
    switch (numProjects) {
      case 0:
        return quota + " projects remaining";
      case 1:
        return "1 project (" + remaining + " remaining)";
      case quota:
        return "You have reached your monthly limit of 5 projects";
      default:
        return numProjects + " projects (" + remaining + " remaining)";
    }
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "#fafafa",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fafafa", p: 4 }}>
      <Stack spacing={4} maxWidth="1400px" mx="auto">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 0.5,
              }}
            >
              Your Projects
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {renderProjectCount(projects.length)}
            </Typography>
          </Box>
          {projects.length < quota && (
            <Button
              variant="contained"
              component={Link}
              to="/project"
              size="large"
              sx={{
                bgcolor: "#667eea",
                px: 3,
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
                boxShadow: "0 4px 14px rgba(102, 126, 234, 0.3)",
                "&:hover": {
                  bgcolor: "#5568d3",
                  boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              + New Project
            </Button>
          )}
        </Stack>

        {error && (
          <Card sx={{ bgcolor: "#fee", border: "1px solid #fcc" }}>
            <CardContent>
              <Typography color="error">{error}</Typography>
            </CardContent>
          </Card>
        )}

        {projects.length === 0 ? (
          <Card
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 6,
              border: "2px dashed #998585",
              bgcolor: "white",
              boxShadow: "none",
            }}
          >
            <Box sx={{ maxWidth: 400, mx: "auto" }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  bgcolor: "#d4d6e5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 3,
                }}
              >
                <Typography sx={{ fontSize: "2.5rem" }}>📋</Typography>
              </Box>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                No projects yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click <strong>New Project</strong> to generate your first PRD
                and get started.
              </Typography>
            </Box>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {projects.map((p) => (
              <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                  component={Link}
                  to={`/project/${p.id}`}
                  sx={{
                    textDecoration: "none",
                    display: "block",
                    position: "relative",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                      "& .project-gradient": {
                        opacity: 1,
                      },
                    },
                  }}
                >
                  <Box
                    className="project-gradient"
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background:
                        "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                      opacity: 0,
                      transition: "opacity 0.3s ease",
                    }}
                  />
                  <CardContent
                    sx={{
                      p: 3,
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}
                    >
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          fontSize: "1.5rem",
                        }}
                      >
                        📄
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            mb: 1,
                            fontWeight: 600,
                            color: "#1a1a1a",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            lineHeight: 1.3,
                          }}
                        >
                          {p.title}
                        </Typography>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Typography
                            variant="caption"
                            sx={{
                              color: "text.secondary",
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <span>🕐</span>
                            {new Date(p.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </Typography>
                          {p.status && (
                            <Box
                              sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 0.5,
                                px: 1,
                                py: 0.25,
                                borderRadius: 1,
                                bgcolor: `${getStatusColor(p.status)}20`,
                              }}
                            >
                              <Box
                                sx={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: "50%",
                                  bgcolor: getStatusColor(p.status),
                                }}
                              />
                              <Typography
                                variant="caption"
                                sx={{
                                  color: getStatusColor(p.status),
                                  fontWeight: 600,
                                  fontSize: "0.65rem",
                                  textTransform: "capitalize",
                                }}
                              >
                                {p.status.toLowerCase()}
                              </Typography>
                            </Box>
                          )}
                        </Stack>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Stack>
    </Box>
  );
}

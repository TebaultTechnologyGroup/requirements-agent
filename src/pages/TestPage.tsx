// src/pages/TestPage.tsx - WITH JSON.stringify()
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Box, Grid } from "@mui/material";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { useAuthenticator } from "@aws-amplify/ui-react";

type Project = { id: string; title: string; createdAt: string };

export default function TestPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string>("");
  const { user } = useAuthenticator();
  const client = generateClient<Schema>();

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      const response = await client.models.Generation.list();
      console.log("Generations:", response);

      if (response.data) {
        const formattedProjects = response.data.map((gen) => ({
          id: gen.id,
          title: gen.title,
          createdAt: gen.createdAt || new Date().toISOString(),
        }));
        setProjects(formattedProjects);
      }
    } catch (err) {
      console.error("Error loading projects:", err);
      setError(err instanceof Error ? err.message : "Failed to load projects");
    }
  }

  async function createGenerationRecord() {
    try {
      setError("");

      if (!user) {
        setError("You must be logged in to create a record");
        return;
      }

      console.log("Creating generation record for user:", user.username);

      // All JSON fields must be JSON.stringify()'d
      const result = await client.models.Generation.create({
        // Required fields
        title: "Sample PRD for Mobile App",
        userId: user.userId,
        idea: "A mobile app that helps users track their daily water intake",
        targetMarket: "Health-conscious individuals aged 25-45",

        // Optional string fields
        constraints: "Must work offline, battery efficient",
        additionalContext: "Target launch in Q2 2025",

        // JSON fields - MUST be stringified!
        productRequirements: JSON.stringify({
          overview: "A simple water tracking app",
          goals: ["Increase user hydration", "Build healthy habits"],
          successMetrics: ["Daily active users", "Average water intake"],
        }),

        userStories: JSON.stringify([
          {
            role: "User",
            action: "Log water intake",
            benefit: "Track hydration throughout the day",
            acceptanceCriteria: ["Can add entry", "Can view history"],
          },
        ]),

        risks: JSON.stringify([
          {
            category: "Technical",
            description: "Battery drain from notifications",
            likelihood: "Medium",
            impact: "Low",
            mitigation: "Optimize notification scheduling",
          },
        ]),

        mvpScope: JSON.stringify({
          inScope: ["Water logging", "Daily reminders"],
          outOfScope: ["Social features", "Premium plans"],
          timeline: "3 months",
          assumptions: [
            "Users want simple tracking",
            "Push notifications allowed",
          ],
        }),

        // Enum field
        status: "COMPLETED",

        // DateTime field
        completedAt: new Date().toISOString(),
      });

      console.log("Creation result:", result);

      if (result.data) {
        console.log("Successfully created record:", result.data.id);
        await loadProjects();
      } else if (result.errors) {
        console.error("Creation errors:", result.errors);
        setError(result.errors.map((e: any) => e.message).join(", "));
      }
    } catch (err: any) {
      console.error("Error creating record:", err);
      setError(err.message || "Failed to create record");
    }
  }

  async function createMinimalRecord() {
    try {
      setError("");

      if (!user) {
        setError("You must be logged in to create a record");
        return;
      }

      console.log("Creating MINIMAL generation record...");

      // Absolute minimum - only required fields, no JSON fields
      const result = await client.models.Generation.create({
        title: "Minimal Test Record",
        userId: user.userId,
        idea: "Just a test idea",
        targetMarket: "Test market",
        // All other fields are optional - omit them
      });

      console.log("Minimal creation result:", result);

      if (result.data) {
        console.log("Successfully created minimal record:", result.data.id);
        await loadProjects();
      } else if (result.errors) {
        console.error("Creation errors:", result.errors);
        setError(result.errors.map((e: any) => e.message).join(", "));
      }
    } catch (err: any) {
      console.error("Error creating minimal record:", err);
      setError(err.message || "Failed to create minimal record");
    }
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
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Test Page - Generations
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {projects.length} record(s) found
            </Typography>
            {user && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 1 }}
              >
                Logged in as: {user.username}
              </Typography>
            )}
          </Box>
          <Stack direction="row" spacing={2}>
            <Button
              onClick={createMinimalRecord}
              variant="outlined"
              size="large"
              disabled={!user}
              sx={{
                borderColor: "#667eea",
                color: "#667eea",
                px: 3,
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
                "&:hover": {
                  borderColor: "#5568d3",
                  bgcolor: "rgba(102, 126, 234, 0.05)",
                },
              }}
            >
              + Minimal Record
            </Button>
            <Button
              onClick={createGenerationRecord}
              variant="contained"
              size="large"
              disabled={!user}
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
              + Full Record
            </Button>
          </Stack>
        </Stack>

        {error && (
          <Card sx={{ bgcolor: "#fee", border: "1px solid #fcc" }}>
            <CardContent>
              <Typography
                color="error"
                variant="body1"
                sx={{ fontWeight: 600, mb: 1 }}
              >
                Error:
              </Typography>
              <Typography
                color="error"
                variant="body2"
                sx={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}
              >
                {error}
              </Typography>
            </CardContent>
          </Card>
        )}

        {!user && (
          <Card sx={{ bgcolor: "#fff3cd", border: "1px solid #ffc107" }}>
            <CardContent>
              <Typography variant="body2">
                ⚠️ You need to be logged in to create records
              </Typography>
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
                No records yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click <strong>Add Record</strong> to create a test generation
              </Typography>
            </Box>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {projects.map((p) => (
              <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card>
                  <CardContent
                    sx={{
                      p: 3,
                      border: "1px solid",
                      borderRadius: 6,
                      borderColor: "primary.main",
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
                          }}
                        >
                          {p.title}
                        </Typography>
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
                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            mt: 1,
                            color: "text.secondary",
                            fontSize: "0.7rem",
                          }}
                        >
                          ID: {p.id}
                        </Typography>
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

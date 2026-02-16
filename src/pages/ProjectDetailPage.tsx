// src/pages/ProjectDetailPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import ResultsView from "../components/ResultsView";

const client = generateClient<Schema>();

interface PRDResult {
  productRequirements: {
    overview: string;
    goals: string[];
    successMetrics: string[];
  };
  userStories: Array<{
    role: string;
    action: string;
    benefit: string;
    acceptanceCriteria: string[];
  }>;
  risks: Array<{
    category: string;
    description: string;
    likelihood: string;
    impact: string;
    mitigation: string;
  }>;
  mvpScope: {
    inScope: string[];
    outOfScope: string[];
    timeline: string;
    assumptions: string[];
  };
}

interface FormData {
  title: string;
  idea: string;
  targetMarket: string;
  constraints: string;
  additionalContext: string;
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [result, setResult] = useState<PRDResult | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);

  useEffect(() => {
    if (id) {
      loadProject(id);
    }
  }, [id]);

  async function loadProject(projectId: string) {
    try {
      setLoading(true);
      setError("");

      console.log("Loading project:", projectId);

      // Fetch the generation by ID
      const response = await client.models.Generation.get({ id: projectId });

      console.log("Generation response:", response);

      if (response.data) {
        const gen = response.data;

        // Parse JSON fields
        const parsedResult: PRDResult = {
          productRequirements: gen.productRequirements
            ? JSON.parse(gen.productRequirements as string)
            : { overview: "", goals: [], successMetrics: [] },
          userStories: gen.userStories
            ? JSON.parse(gen.userStories as string)
            : [],
          risks: gen.risks ? JSON.parse(gen.risks as string) : [],
          mvpScope: gen.mvpScope
            ? JSON.parse(gen.mvpScope as string)
            : { inScope: [], outOfScope: [], timeline: "", assumptions: [] },
        };

        setResult(parsedResult);

        // Set form data for display
        setFormData({
          title: gen.title,
          idea: gen.idea,
          targetMarket: gen.targetMarket,
          constraints: gen.constraints || "",
          additionalContext: gen.additionalContext || "",
        });
      } else if (response.errors) {
        console.error("Errors:", response.errors);
        setError(
          `Failed to load project: ${response.errors.map((e) => e.message).join(", ")}`,
        );
      } else {
        setError("Project not found");
      }
    } catch (err: any) {
      console.error("Error loading project:", err);
      setError(err.message || "Failed to load project");
    } finally {
      setLoading(false);
    }
  }

  const handleBack = () => {
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", p: 4 }}>
        <Container maxWidth="lg">
          <Paper sx={{ p: 4 }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
            <Button variant="contained" onClick={handleBack}>
              Back to Dashboard
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  if (!result || !formData) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", p: 4 }}>
        <Container maxWidth="lg">
          <Paper sx={{ p: 4 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              No project data found
            </Alert>
            <Button variant="contained" onClick={handleBack}>
              Back to Dashboard
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "background.default" }}
    >
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <ResultsView
            result={result}
            formData={formData}
            onReset={handleBack}
          />
        </Paper>
      </Container>
    </Box>
  );
}

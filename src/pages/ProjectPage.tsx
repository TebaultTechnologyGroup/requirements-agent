import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Backdrop,
  CircularProgress,
  Typography,
  Alert,
} from "@mui/material";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from "@aws-amplify/ui-react";
import type { Schema } from "../../amplify/data/resource";

import StepOne from "../components/StepOne";
import StepTwo from "../components/StepTwo";
import StepThree from "../components/StepThree";
import ResultsView from "../components/ResultsView";
import { getCurrentUser } from "aws-amplify/auth";

const client = generateClient<Schema>();
const steps = ["Product Idea", "Target & Constraints", "Review & Generate"];
const STORAGE_KEY = "project_form_draft";

function ProjectPage() {
  const { user, authStatus } = useAuthenticator((ctx) => [
    ctx.user,
    ctx.authStatus,
  ]);

  const [activeStep, setActiveStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>(""); // Initialized as string
  const [result, setResult] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<
    Schema["UserProfile"]["type"] | null
  >(null);

  const [formData, setFormData] = useState({
    title: "",
    idea: "",
    targetMarket: "",
    constraints: "",
    additionalContext: "",
  });

  useEffect(() => {
    if (authStatus === "authenticated" && user?.userId) {
      const loadData = async () => {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        if (saved) setFormData(JSON.parse(saved));

        try {
          const { data: profiles } = await client.models.UserProfile.list({
            filter: { userId: { eq: user.userId } },
          });
          if (profiles.length > 0) setUserProfile(profiles[0]);
        } catch (err) {
          console.log("Profile load failed", err);
        }
      };
      loadData();
    }
  }, []);

  const handleNext = () => {
    if (activeStep === 0 && (!formData.title || !formData.idea)) {
      setError("Title and Idea are required.");
      return;
    }
    setError("");
    setActiveStep((prev) => prev + 1);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError("");

    try {
      // 1. Invoke Lambda Mutation
      const { data, errors } = await client.mutations.generatePRD(formData);
      if (errors) throw new Error(errors[0].message);

      const parsedData = JSON.parse(data as string);

      if (!parsedData?.data?.productRequirements?.overview) {
        throw new Error(
          "AI response was incomplete. Missing product overview.",
        );
      }

      const { userId } = await getCurrentUser();

      // 3. Save the Generation record to the DB
      const r = await client.models.Generation.create({
        ...formData,
        userId: userId,
        productRequirements: JSON.stringify(
          parsedData.data.productRequirements,
        ),
        userStories: JSON.stringify(parsedData.data.userStories),
        risks: JSON.stringify(parsedData.data.risks),
        mvpScope: JSON.stringify(parsedData.data.mvpScope),
        status: "COMPLETED",
        completedAt: new Date().toISOString(),
      });

      console.log(JSON.stringify(r));

      // 4. Update User Profile count
      if (userProfile) {
        await client.models.UserProfile.update({
          id: userProfile.id,
          generationsThisMonth: (userProfile.generationsThisMonth || 0) + 1,
        });
      }

      setResult(parsedData.data);
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (err: any) {
      setError(err.message || "An error occurred during generation.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Box sx={{ py: 4, minHeight: "100vh", bgcolor: "background.default" }}>
      <Container maxWidth="lg">
        <Paper sx={{ p: 4 }}>
          {error !== "" && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {!result ? (
            <>
              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {activeStep === 0 && (
                <StepOne
                  formData={formData}
                  setFormData={setFormData}
                  onNext={handleNext}
                />
              )}
              {activeStep === 1 && (
                <StepTwo
                  formData={formData}
                  setFormData={setFormData}
                  onNext={handleNext}
                  onBack={() => setActiveStep(0)}
                />
              )}
              {activeStep === 2 && (
                <StepThree
                  formData={formData}
                  onBack={() => setActiveStep(1)}
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating}
                  error={error}
                />
              )}
            </>
          ) : (
            <ResultsView
              result={result}
              formData={formData}
              onReset={() => {
                setResult(null);
                setActiveStep(0);
              }}
            />
          )}
        </Paper>
      </Container>

      <Backdrop sx={{ color: "#fff", zIndex: 1301 }} open={isGenerating}>
        <Box textAlign="center">
          <CircularProgress color="inherit" />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Architecting your PRD...
          </Typography>
        </Box>
      </Backdrop>
    </Box>
  );
}

export default ProjectPage;

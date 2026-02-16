import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  Grid,
  Card,
  Chip,
} from "@mui/material";
import { Link } from "react-router";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SpeedIcon from "@mui/icons-material/Speed";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

function HomePage() {
  return (
    <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh" }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          py: 12,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Stack spacing={4} alignItems="center" textAlign="center">
            <Chip
              label="AI Optimization Demo"
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                color: "white",
                fontWeight: 600,
                fontSize: "0.9rem",
                px: 2,
                py: 0.5,
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                maxWidth: 800,
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                lineHeight: 1.2,
              }}
            >
              Create Capacity Without Adding Headcount
            </Typography>
            <Typography
              variant="h5"
              sx={{
                maxWidth: 700,
                opacity: 0.95,
                fontWeight: 400,
                lineHeight: 1.6,
              }}
            >
              See how AI-powered automation transforms manual workflows into
              intelligent systems. This live demo showcases the tools I build to
              help organizations reclaim 3–6 months of operational capacity.
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ mt: 2 }}
            >
              <Button
                component={Link}
                to="/register"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: "white",
                  color: "#667eea",
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  borderRadius: 2,
                  textTransform: "none",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                  "&:hover": {
                    bgcolor: "#f8f8f8",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
                  },
                }}
                startIcon={<PlayArrowIcon />}
              >
                Try the Demo
              </Button>
              <Button
                href="https://www.tebaulttechnologygroup.com/contact-us"
                target="_blank"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: "white",
                  color: "white",
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: "none",
                  borderWidth: 2,
                  "&:hover": {
                    borderColor: "white",
                    bgcolor: "rgba(255,255,255,0.1)",
                    borderWidth: 2,
                  },
                }}
                startIcon={<BusinessCenterIcon />}
              >
                Schedule a Consultation
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* What This Demonstrates */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Stack spacing={6}>
          <Box textAlign="center">
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              Real AI in Action
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 700, mx: "auto" }}
            >
              This interactive demo shows how AI automation eliminates manual
              bottlenecks
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  height: "100%",
                  p: 3,
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                    borderColor: "#667eea",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 2,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                  }}
                >
                  <AutoAwesomeIcon sx={{ fontSize: 32, color: "white" }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                  Intelligent Automation
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ lineHeight: 1.7 }}
                >
                  See how Claude AI transforms manual document creation into
                  instant, high-quality outputs. What used to take hours now
                  takes seconds—with better results.
                </Typography>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  height: "100%",
                  p: 3,
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                    borderColor: "#667eea",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 2,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                  }}
                >
                  <SpeedIcon sx={{ fontSize: 32, color: "white" }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                  Workflow Simplification
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ lineHeight: 1.7 }}
                >
                  Experience streamlined processes that eliminate unnecessary
                  steps and handoffs. This is how I help teams reclaim 21% of
                  their operational capacity.
                </Typography>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  height: "100%",
                  p: 3,
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                    borderColor: "#667eea",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 2,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                  }}
                >
                  <TrendingUpIcon sx={{ fontSize: 32, color: "white" }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                  Measurable Impact
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ lineHeight: 1.7 }}
                >
                  Many companies report a 4X increase in efficiency using AI.
                  Let me show you how AI and process optimization can help your
                  organization.
                </Typography>
                <Link
                  to="https://www.worklytics.co/resources/ai-adoption-employee-productivity-pwc-2025-ai-jobs-barometer-guide"
                  target="_blank"
                  style={{ fontSize: 10 }}
                >
                  worklytics.co
                </Link>
                &nbsp;
                <Link
                  to="https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai"
                  target="_blank"
                  style={{ fontSize: 10 }}
                >
                  McKinsey
                </Link>
              </Card>
            </Grid>
          </Grid>
        </Stack>
      </Container>

      {/* The Challenge */}
      <Box sx={{ bgcolor: "white", py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
                Sound Familiar?
              </Typography>
              <Stack spacing={2}>
                {[
                  "Teams overwhelmed by manual reporting and reconciliation",
                  "Work growing faster than headcount approvals",
                  "Interest in AI but no clear execution plan",
                  "Bottlenecks slowing delivery and decision-making",
                  "Manual processes consuming hours that shouldn't require a person",
                ].map((item) => (
                  <Box
                    key={item}
                    sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}
                  >
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        bgcolor: "#667eea",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        mt: 0.5,
                      }}
                    >
                      <Typography
                        sx={{
                          color: "white",
                          fontSize: "0.9rem",
                          fontWeight: 700,
                        }}
                      >
                        ✓
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  p: 4,
                  borderRadius: 3,
                  background:
                    "linear-gradient(135deg, #f3f4ff 0%, #e8eaff 100%)",
                  border: "2px solid #667eea",
                }}
              >
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, mb: 2, color: "#667eea" }}
                >
                  The Solution
                </Typography>

                <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
                  In a full production version, a system or agent would draw on
                  your organization’s historical data, domain context, and
                  project‑specific inputs to produce documentation in your
                  preferred structure and voice, such as:
                  <ul>
                    <li>Product Requirements Documents</li>
                    <li>Project Scope Statements</li>
                    <li>Postmortem / Retrospective Reports</li>
                    <li>And much more</li>
                  </ul>
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
                  By streamlining these repetitive tasks, AI enables teams to
                  focus on higher‑value work—strategy, problem‑solving, and
                  delivering great products.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* How I Can Help */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Stack spacing={6}>
          <Box textAlign="center">
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              How I Help Organizations
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 700, mx: "auto" }}
            >
              20+ years of operational excellence meets cutting-edge AI
              automation
            </Typography>
          </Box>

          <Grid container spacing={8}>
            {[
              {
                title: "Capacity & Workflow Clarity Assessment",
                desc: "Quick 2-week diagnostic to identify where capacity can be reclaimed through workflow optimization and targeted automation.",
              },
              {
                title: "AI Automation & Integration",
                desc: "Implement practical AI solutions that eliminate manual bottlenecks and accelerate decision cycles—only where it truly helps.",
              },
              {
                title: "Process Optimization",
                desc: "Simplify workflows, align process with technology, and create clear visibility into where time and effort are going.",
              },
              {
                title: "Fractional Leadership",
                desc: "Contract or interim COO, CCO, or operations leadership to stabilize teams under pressure and execute strategic transformations.",
              },
            ].map((service) => (
              <Grid size={{ xs: 12, md: 6 }} key={service.title}>
                <Card
                  sx={{
                    p: 3,
                    height: "100%",
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: "#667eea",
                      boxShadow: "0 4px 12px rgba(102, 126, 234, 0.15)",
                    },
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {service.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.6 }}
                  >
                    {service.desc}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Container>

      {/* CTA Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Card
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            p: 6,
            borderRadius: 4,
            textAlign: "center",
          }}
        >
          <Stack spacing={3} alignItems="center">
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              Ready to Create Capacity?
            </Typography>
            <Typography variant="h6" sx={{ maxWidth: 700, opacity: 0.95 }}>
              Let's discuss how workflow optimization and AI automation can free
              up meaningful capacity for your team—without adding headcount.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                href="https://www.tebaulttechnologygroup.com/meetings/tebault"
                target="_blank"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: "white",
                  color: "#667eea",
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  borderRadius: 2,
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "#f8f8f8",
                  },
                }}
              >
                Schedule a Consultation
              </Button>
              <Button
                href="https://www.tebaulttechnologygroup.com"
                target="_blank"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: "white",
                  color: "white",
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: "none",
                  borderWidth: 2,
                  "&:hover": {
                    borderColor: "white",
                    bgcolor: "rgba(255,255,255,0.1)",
                    borderWidth: 2,
                  },
                }}
              >
                Learn More
              </Button>
            </Stack>
            <Box sx={{ pt: 2 }}>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                📞 (770) 862-7067 | ✉️ mark.tebault@tebaulttechnologygroup.com
              </Typography>
            </Box>
          </Stack>
        </Card>
      </Container>
    </Box>
  );
}

export default HomePage;

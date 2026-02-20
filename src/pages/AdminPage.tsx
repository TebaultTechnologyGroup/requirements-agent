import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Card,
  CardContent,
  Collapse,
  Divider,
} from "@mui/material";
import {
  Delete,
  Search,
  Refresh,
  ExpandMore,
  ExpandLess,
  People,
  Article,
  Shield,
  Visibility,
} from "@mui/icons-material";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { useAdminGuard } from "../routes/useAdminGuard";
import { useNavigate } from "react-router-dom";

const client = generateClient<Schema>();

// ─── Types ──────────────────────────────────────────────────────────────────

interface UserProfile {
  id: string;
  userId: string;
  email: string;
  role: string;
  plan: string | null;
  generationsThisMonth: number | null;
  monthResetDate: string | null;
  createdAt?: string;
}

interface Generation {
  id: string;
  title: string;
  userId: string;
  idea: string;
  targetMarket: string;
  constraints?: string | null;
  additionalContext?: string | null;
  status?: string | null;
  completedAt?: string | null;
  createdAt?: string;
  productRequirements?: string | null;
  userStories?: string | null;
  risks?: string | null;
  mvpScope?: string | null;
  errorMessage?: string | null;
}

// ─── Stat Card ───────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <Card
      sx={{
        flex: 1,
        borderTop: `4px solid ${color}`,
        borderRadius: 2,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {label}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, color }}>
          {value}
        </Typography>
        {sub && (
          <Typography variant="caption" color="text.secondary">
            {sub}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Generation Detail Row ───────────────────────────────────────────────────

function GenerationRow({
  gen,
  onDelete,
}: {
  gen: Generation;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const statusColor = (s?: string | null) => {
    switch (s) {
      case "COMPLETED":
        return "success";
      case "PROCESSING":
        return "warning";
      case "FAILED":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <>
      <TableRow
        hover
        sx={{ "& td": { borderBottom: expanded ? "none" : undefined } }}
      >
        <TableCell sx={{ maxWidth: 220 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {gen.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {gen.id.slice(0, 8)}…
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="caption" sx={{ fontFamily: "monospace" }}>
            {gen.userId.slice(0, 16)}…
          </Typography>
        </TableCell>
        <TableCell sx={{ maxWidth: 180 }}>
          <Typography
            variant="caption"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {gen.targetMarket}
          </Typography>
        </TableCell>
        <TableCell>
          <Chip
            label={gen.status || "UNKNOWN"}
            size="small"
            color={statusColor(gen.status) as any}
          />
        </TableCell>
        <TableCell>
          <Typography variant="caption">
            {gen.createdAt
              ? new Date(gen.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "—"}
          </Typography>
        </TableCell>
        <TableCell align="right">
          <Tooltip title="View full PRD">
            <IconButton
              size="small"
              onClick={() => navigate(`/project/${gen.id}`)}
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={expanded ? "Collapse" : "Expand details"}>
            <IconButton size="small" onClick={() => setExpanded(!expanded)}>
              {expanded ? (
                <ExpandLess fontSize="small" />
              ) : (
                <ExpandMore fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete generation">
            <IconButton
              size="small"
              color="error"
              onClick={() => onDelete(gen.id)}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>

      {/* Expanded detail row */}
      <TableRow>
        <TableCell colSpan={6} sx={{ py: 0 }}>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Box
              sx={{
                p: 2,
                bgcolor: "#f8f9ff",
                borderRadius: 1,
                mb: 1,
                border: "1px solid #e8eaff",
              }}
            >
              <Stack spacing={1}>
                <Box>
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    color="primary"
                  >
                    IDEA
                  </Typography>
                  <Typography variant="body2">{gen.idea}</Typography>
                </Box>
                {gen.constraints && (
                  <Box>
                    <Typography
                      variant="caption"
                      fontWeight={700}
                      color="primary"
                    >
                      CONSTRAINTS
                    </Typography>
                    <Typography variant="body2">{gen.constraints}</Typography>
                  </Box>
                )}
                {gen.additionalContext && (
                  <Box>
                    <Typography
                      variant="caption"
                      fontWeight={700}
                      color="primary"
                    >
                      ADDITIONAL CONTEXT
                    </Typography>
                    <Typography variant="body2">
                      {gen.additionalContext}
                    </Typography>
                  </Box>
                )}
                {gen.errorMessage && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {gen.errorMessage}
                  </Alert>
                )}
              </Stack>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

// ─── Main Admin Page ─────────────────────────────────────────────────────────

export default function AdminPage() {
  const { authStatus } = useAdminGuard();

  const [tab, setTab] = useState(0);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingGens, setLoadingGens] = useState(false);
  const [userError, setUserError] = useState("");
  const [genError, setGenError] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [genSearch, setGenSearch] = useState("");
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: "user" | "generation";
    id: string;
    label: string;
  }>({ open: false, type: "user", id: "", label: "" });
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ── Loaders ────────────────────────────────────────────────────────────────

  const loadUsers = useCallback(async () => {
    setLoadingUsers(true);
    setUserError("");
    try {
      const result = await client.models.UserProfile.list({
        authMode: "userPool", // This forces the use of Group permissions instead of Owner permissions
      });

      if (result.errors?.length) {
        setUserError(result.errors.map((e) => e.message).join(", "));
      } else {
        const sorted = (result.data || []).sort((a, b) =>
          (a.email || "").localeCompare(b.email || ""),
        );
        setUsers(sorted as UserProfile[]);
      }
    } catch (err: any) {
      setUserError(err.message || "Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  const loadGenerations = useCallback(async () => {
    setLoadingGens(true);
    setGenError("");
    try {
      const result = await client.models.Generation.list();
      if (result.errors?.length) {
        setGenError(result.errors.map((e) => e.message).join(", "));
      } else {
        const sorted = (result.data || []).sort(
          (a, b) =>
            new Date(b.createdAt || "").getTime() -
            new Date(a.createdAt || "").getTime(),
        );
        setGenerations(sorted as Generation[]);
      }
    } catch (err: any) {
      setGenError(err.message || "Failed to load generations");
    } finally {
      setLoadingGens(false);
    }
  }, []);

  useEffect(() => {
    if (authStatus === "authenticated") {
      loadUsers();
      loadGenerations();
    }
  }, [authStatus, loadUsers, loadGenerations]);

  // ── Delete handlers ────────────────────────────────────────────────────────

  const confirmDelete = (
    type: "user" | "generation",
    id: string,
    label: string,
  ) => {
    setDeleteDialog({ open: true, type, id, label });
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      if (deleteDialog.type === "user") {
        const result = await client.models.UserProfile.delete({
          id: deleteDialog.id,
        });
        if (result.errors?.length) {
          setUserError(result.errors.map((e) => e.message).join(", "));
        } else {
          setUsers((prev) => prev.filter((u) => u.id !== deleteDialog.id));
        }
      } else {
        const result = await client.models.Generation.delete({
          id: deleteDialog.id,
        });
        if (result.errors?.length) {
          setGenError(result.errors.map((e) => e.message).join(", "));
        } else {
          setGenerations((prev) =>
            prev.filter((g) => g.id !== deleteDialog.id),
          );
        }
      }
    } catch (err: any) {
      const msg = err.message || "Delete failed";
      deleteDialog.type === "user" ? setUserError(msg) : setGenError(msg);
    } finally {
      setDeleteLoading(false);
      setDeleteDialog({ open: false, type: "user", id: "", label: "" });
    }
  };

  // ── Derived / filtered data ────────────────────────────────────────────────

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.userId.toLowerCase().includes(userSearch.toLowerCase()),
  );

  const filteredGens = generations.filter(
    (g) =>
      g.title.toLowerCase().includes(genSearch.toLowerCase()) ||
      g.userId.toLowerCase().includes(genSearch.toLowerCase()) ||
      g.targetMarket.toLowerCase().includes(genSearch.toLowerCase()),
  );

  const completedCount = generations.filter(
    (g) => g.status === "COMPLETED",
  ).length;
  const failedCount = generations.filter((g) => g.status === "FAILED").length;
  const planCounts = users.reduce(
    (acc, u) => {
      const plan = u.plan || "FREE";
      acc[plan] = (acc[plan] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // ── Guard: still loading auth ──────────────────────────────────────────────

  if (authStatus === "configuring") {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f4f5fa" }}>
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          color: "white",
          px: 4,
          py: 3,
          mb: 4,
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        <Container maxWidth="xl">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Shield sx={{ fontSize: 32, color: "#667eea" }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Admin Console
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Restricted access — authorized personnel only
              </Typography>
            </Box>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl">
        {/* Stat cards */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={4}>
          <StatCard
            label="Total Users"
            value={users.length}
            sub={`PRO: ${planCounts["PRO"] || 0} · Free: ${planCounts["FREE"] || 0}`}
            color="#667eea"
          />
          <StatCard
            label="Total Generations"
            value={generations.length}
            sub={`Completed: ${completedCount}`}
            color="#10b981"
          />
          <StatCard
            label="Failed Generations"
            value={failedCount}
            sub={failedCount > 0 ? "Needs attention" : "All good"}
            color={failedCount > 0 ? "#ef4444" : "#6b7280"}
          />
          <StatCard
            label="Avg / User"
            value={
              users.length
                ? (generations.length / users.length).toFixed(1)
                : "—"
            }
            sub="generations per user"
            color="#f59e0b"
          />
        </Stack>

        {/* Tabs */}
        <Paper
          sx={{ borderRadius: 2, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
        >
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              px: 2,
              borderBottom: "1px solid",
              borderColor: "divider",
              "& .MuiTab-root": { textTransform: "none", fontWeight: 600 },
            }}
          >
            <Tab
              icon={<People fontSize="small" />}
              iconPosition="start"
              label={`Users (${users.length})`}
            />
            <Tab
              icon={<Article fontSize="small" />}
              iconPosition="start"
              label={`Generations (${generations.length})`}
            />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {/* ── Users Tab ─────────────────────────────────────────────── */}
            {tab === 0 && (
              <>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <TextField
                    size="small"
                    placeholder="Search by email or user ID…"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    sx={{ width: 320 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Tooltip title="Refresh">
                    <IconButton onClick={loadUsers} disabled={loadingUsers}>
                      <Refresh />
                    </IconButton>
                  </Tooltip>
                </Stack>

                {userError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {userError}
                  </Alert>
                )}

                {loadingUsers ? (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", py: 6 }}
                  >
                    <CircularProgress />
                  </Box>
                ) : (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow
                          sx={{
                            "& th": { fontWeight: 700, bgcolor: "#f8f9ff" },
                          }}
                        >
                          <TableCell>Email</TableCell>
                          <TableCell>User ID</TableCell>
                          <TableCell>Role</TableCell>
                          <TableCell>Plan</TableCell>
                          <TableCell>Generations This Month</TableCell>
                          <TableCell>Reset Date</TableCell>
                          <TableCell>Joined</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredUsers.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={7}
                              align="center"
                              sx={{ py: 6 }}
                            >
                              <Typography color="text.secondary">
                                No users found
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredUsers.map((u) => (
                            <TableRow key={u.id} hover>
                              <TableCell>
                                <Typography variant="body2" fontWeight={600}>
                                  {u.email}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  variant="caption"
                                  sx={{ fontFamily: "monospace" }}
                                >
                                  {u.userId.slice(0, 20)}…
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" fontWeight={600}>
                                  {u.role}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={u.plan || "FREE"}
                                  size="small"
                                  color={
                                    u.plan === "PRO"
                                      ? "primary"
                                      : u.plan === "ENTERPRISE"
                                        ? "secondary"
                                        : "default"
                                  }
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Typography variant="body2">
                                  {u.generationsThisMonth ?? 0}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="caption">
                                  {u.monthResetDate
                                    ? new Date(
                                        u.monthResetDate,
                                      ).toLocaleDateString()
                                    : "—"}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="caption">
                                  {u.createdAt
                                    ? new Date(u.createdAt).toLocaleDateString(
                                        "en-US",
                                        {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                        },
                                      )
                                    : "—"}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Tooltip title="Delete user profile">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() =>
                                      confirmDelete("user", u.id, u.email)
                                    }
                                  >
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </>
            )}

            {/* ── Generations Tab ───────────────────────────────────────── */}
            {tab === 1 && (
              <>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <TextField
                    size="small"
                    placeholder="Search by title, user ID, or market…"
                    value={genSearch}
                    onChange={(e) => setGenSearch(e.target.value)}
                    sx={{ width: 360 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Tooltip title="Refresh">
                    <IconButton
                      onClick={loadGenerations}
                      disabled={loadingGens}
                    >
                      <Refresh />
                    </IconButton>
                  </Tooltip>
                </Stack>

                {genError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {genError}
                  </Alert>
                )}

                {loadingGens ? (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", py: 6 }}
                  >
                    <CircularProgress />
                  </Box>
                ) : (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow
                          sx={{
                            "& th": { fontWeight: 700, bgcolor: "#f8f9ff" },
                          }}
                        >
                          <TableCell>Title</TableCell>
                          <TableCell>User ID</TableCell>
                          <TableCell>Target Market</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Created</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredGens.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              align="center"
                              sx={{ py: 6 }}
                            >
                              <Typography color="text.secondary">
                                No generations found
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredGens.map((gen) => (
                            <GenerationRow
                              key={gen.id}
                              gen={gen}
                              onDelete={(id) =>
                                confirmDelete("generation", id, gen.title)
                              }
                            />
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </>
            )}
          </Box>
        </Paper>

        <Divider sx={{ my: 3 }} />
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          textAlign="center"
          pb={4}
        >
          Admin Console · Data reflects live DynamoDB state via AppSync
        </Typography>
      </Container>

      {/* ── Delete Confirmation Dialog ───────────────────────────────────── */}
      <Dialog
        open={deleteDialog.open}
        onClose={() =>
          !deleteLoading &&
          setDeleteDialog({ open: false, type: "user", id: "", label: "" })
        }
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to permanently delete{" "}
            <strong>
              {deleteDialog.type === "user" ? "user profile" : "generation"}
            </strong>{" "}
            for:
          </Typography>
          <Box
            sx={{
              mt: 1,
              p: 1.5,
              bgcolor: "#fff4f4",
              border: "1px solid #fcc",
              borderRadius: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontFamily: "monospace", wordBreak: "break-all" }}
            >
              {deleteDialog.label}
            </Typography>
          </Box>
          <Typography
            variant="caption"
            color="error"
            sx={{ mt: 1, display: "block" }}
          >
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="outlined"
            onClick={() =>
              setDeleteDialog({ open: false, type: "user", id: "", label: "" })
            }
            disabled={deleteLoading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={deleteLoading}
            startIcon={
              deleteLoading ? <CircularProgress size={16} /> : <Delete />
            }
          >
            {deleteLoading ? "Deleting…" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

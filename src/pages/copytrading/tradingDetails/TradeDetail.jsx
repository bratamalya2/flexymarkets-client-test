import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Button,
  Chip,
  Container,
  Stack,
  Tab,
  Tabs,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  useMediaQuery,
  alpha,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert as MuiAlert,
  Pagination,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  Rating,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormHelperText,
  FormControlLabel,
  Switch,
} from "@mui/material"; // Added FormControlLabel and Switch
import Grid from "@mui/material/Grid2";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShareIcon from "@mui/icons-material/Share";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import EmailIcon from "@mui/icons-material/Email";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Selector from "../../../components/Selector";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetMasterTraderDetailsQuery,
  useMasterTraderTradeListQuery,
  useSubmitReviewMutation,
  useReviewListQuery,
  useRemoveReviewMutation,
  useMySubscriptionListQuery,
  useMyTraderWatchListQuery,
  useSubscribeMutation,
  useUnSubscribeMutation,
  useAddMasterTraderIntoWatchListMutation,
  useRemoveMasterTraderFromWatchListMutation,
} from "../../../globalState/socialTrading/socialTradingApis.js";
import { Skeleton, Alert } from "@mui/material";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { setNotification } from "../../../globalState/notificationState/notificationStateSlice";
import { useGetUserDataQuery } from "../../../globalState/userState/userStateApis";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

// Risk type options
const riskTypes = [
  {
    value: "FIXED_LOT",
    label: "Fixed Lot",
    description: "Trade with fixed lot size",
  },
  {
    value: "MULTIPLIER",
    label: "Multiplier",
    description: "Trade with multiplier effect",
  },
];

// --- Validation Schema ---
const reviewSchema = z.object({
  masterTraderId: z.string().or(z.number()),
  rating: z.number().min(1, "Rating is required").max(5),
  comment: z
    .string()
    .min(5, "Comment must be at least 5 characters long")
    .max(500, "Comment is too long"),
});

// --- Animations ---
const fadeIn = {
  "@keyframes fadeIn": {
    from: { opacity: 0, transform: "translateY(10px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
  animation: "fadeIn 0.5s ease-out forwards",
};

// --- Order Page Component ---
const OrderPage = ({ traderId }) => {
  const theme = useTheme();
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [days, setDays] = useState("30");

  const { data, isLoading, isError } = useMasterTraderTradeListQuery({
    masterTraderId: traderId,
    page,
    sizePerPage,
    days,
  });

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleDaysChange = (event) => {
    setDays(event.target.value);
    setPage(1);
  };

  const trades = data?.data?.trades || [];
  const totalPages = data?.data?.totalPages || 1;

  if (isLoading) {
    return (
      <Paper
        sx={{
          p: 4,
          display: "flex",
          justifyContent: "center",
          borderRadius: 2,
          border: "1px solid",
          borderColor: theme.palette.divider,
          boxShadow: "none",
          bgcolor: "background.paper",
          ...fadeIn,
        }}
      >
        <CircularProgress />
      </Paper>
    );
  }

  if (isError) {
    return (
      <Paper
        sx={{
          p: 4,
          textAlign: "center",
          borderRadius: 2,
          border: "1px solid",
          borderColor: theme.palette.divider,
          boxShadow: "none",
          bgcolor: "background.paper",
          ...fadeIn,
        }}
      >
        <Alert severity="error">Error loading order history.</Alert>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 2,
        border: "1px solid",
        borderColor: theme.palette.divider,
        boxShadow: "none",
        bgcolor: "background.paper",
        ...fadeIn,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="subtitle1" fontWeight="800" color="text.primary">
          Order History
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={days}
            onChange={handleDaysChange}
            displayEmpty
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="7">Last 7 Days</MenuItem>
            <MenuItem value="30">Last 30 Days</MenuItem>
            <MenuItem value="90">Last 90 Days</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="order history table">
          <TableHead>
            <TableRow
              sx={{
                "& th": {
                  fontWeight: "bold",
                  color: "text.secondary",
                  borderBottom: `1px solid ${theme.palette.divider}`,
                },
              }}
            >
              <TableCell>Symbol</TableCell>
              <TableCell align="right">Volume</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Commission</TableCell>
              <TableCell align="right">Profit</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell align="right">Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trades.length > 0 ? (
              trades.map((trade, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "& td": {
                      borderBottom: `1px solid ${theme.palette.divider}`,
                    },
                  }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ fontWeight: 600 }}
                  >
                    {trade.symbol || "-"}
                  </TableCell>
                  <TableCell align="right">{trade.volume}</TableCell>
                  <TableCell align="right">{trade.price}</TableCell>
                  <TableCell align="right">{trade.commission}</TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color:
                        parseFloat(trade.profit) >= 0 ? "#12B76A" : "#F04438",
                      fontWeight: 600,
                    }}
                  >
                    {trade.profit}
                  </TableCell>
                  <TableCell>{trade.comment || "-"}</TableCell>
                  <TableCell align="right">
                    {trade.time
                      ? new Date(trade.time * 1000).toLocaleString()
                      : "-"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  align="center"
                  sx={{ py: 3, color: "text.secondary" }}
                >
                  No trades found for the selected period.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 3,
            px: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 600 }}
            >
              Rows per page:
            </Typography>
            <FormControl size="small" variant="standard" sx={{ minWidth: 60 }}>
              <Select
                value={sizePerPage}
                onChange={(e) => {
                  setSizePerPage(e.target.value);
                  setPage(1);
                }}
                disableUnderline
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  "& .MuiSelect-select": {
                    py: 0.5,
                    px: 1,
                    color: "text.primary",
                  },
                }}
              >
                {[5, 10, 20, 50, 100].map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Paper>
  );
};

// --- Copiers Page Component ---
const CopiersPage = ({ traderId }) => {
  const theme = useTheme();
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);

  const { data, isLoading, isError, error } = useMySubscriptionListQuery({
    page,
    sizePerPage,
  });

  const allSubscriptions = data?.data?.subscriptions || [];
  const traderSubscriptions = allSubscriptions.filter(
    (sub) => sub.masterTraderId === Number(traderId)
  );

  const totalPages = data?.data?.totalPages || 1;

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return "#12B76A";
      case "PENDING":
        return "#F79009";
      case "REJECTED":
      case "INACTIVE":
        return "#F04438";
      default:
        return "#667085";
    }
  };

  if (isLoading) {
    return (
      <Paper
        sx={{
          p: 4,
          display: "flex",
          justifyContent: "center",
          borderRadius: 2,
          border: "1px solid",
          borderColor: theme.palette.divider,
          boxShadow: "none",
          bgcolor: "background.paper",
          ...fadeIn,
        }}
      >
        <CircularProgress />
      </Paper>
    );
  }

  if (isError) {
    return (
      <Paper
        sx={{
          p: 4,
          textAlign: "center",
          borderRadius: 2,
          border: "1px solid",
          borderColor: theme.palette.divider,
          boxShadow: "none",
          bgcolor: "background.paper",
          ...fadeIn,
        }}
      >
        <Alert severity="error">
          Error loading copiers data:{" "}
          {error?.data?.message || "Please try again."}
        </Alert>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 2,
        border: "1px solid",
        borderColor: theme.palette.divider,
        boxShadow: "none",
        bgcolor: "background.paper",
        ...fadeIn,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="subtitle1" fontWeight="800" color="text.primary">
          Copiers List
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total Copiers: {traderSubscriptions.length}
        </Typography>
      </Stack>

      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="copiers table">
          <TableHead>
            <TableRow
              sx={{
                "& th": {
                  fontWeight: "bold",
                  color: "text.secondary",
                  borderBottom: `1px solid ${theme.palette.divider}`,
                },
              }}
            >
              <TableCell>User</TableCell>
              <TableCell align="right">Login</TableCell>
              <TableCell align="right">Risk Type</TableCell>
              <TableCell align="right">Fixed Lot</TableCell>
              <TableCell align="right">Multiplier</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Subscribed At</TableCell>
              <TableCell align="right">Total PnL</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {traderSubscriptions.length > 0 ? (
              traderSubscriptions.map((sub) => (
                <TableRow
                  key={sub.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "& td": {
                      borderBottom: `1px solid ${theme.palette.divider}`,
                    },
                  }}
                >
                  <TableCell component="th" scope="row">
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: theme.palette.primary.main,
                          fontSize: "0.875rem",
                        }}
                      >
                        {sub.masterTrader?.user?.name?.charAt(0) || "U"}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="600">
                          {sub.masterTrader?.user?.name || "Unknown User"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {sub.userId}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight="500">
                      {sub.login || "-"}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      label={sub.riskType || "-"}
                      size="small"
                      sx={{
                        bgcolor: alpha(
                          sub.riskType === "FIXED_LOT"
                            ? "#2E90FA"
                            : sub.riskType === "MULTIPLIER"
                              ? "#7A5AF8"
                              : "#667085",
                          0.1
                        ),
                        color:
                          sub.riskType === "FIXED_LOT"
                            ? "#2E90FA"
                            : sub.riskType === "MULTIPLIER"
                              ? "#7A5AF8"
                              : "#667085",
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">{sub.fixedLotSize || "-"}</TableCell>
                  <TableCell align="right">{sub.multiplier || "-"}</TableCell>
                  <TableCell align="right">
                    <Chip
                      label={sub.status || "PENDING"}
                      size="small"
                      sx={{
                        bgcolor: alpha(getStatusColor(sub.status), 0.1),
                        color: getStatusColor(sub.status),
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      {formatDate(sub.subscribedAt || sub.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body2"
                      fontWeight="600"
                      sx={{
                        color:
                          sub.totalPnl > 0
                            ? "#12B76A"
                            : sub.totalPnl < 0
                              ? "#F04438"
                              : "text.secondary",
                      }}
                    >
                      ${sub.totalPnl?.toFixed(2) || "0.00"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  align="center"
                  sx={{ py: 3, color: "text.secondary" }}
                >
                  No copiers found for this trader.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 3,
            px: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 600 }}
            >
              Rows per page:
            </Typography>
            <FormControl size="small" variant="standard" sx={{ minWidth: 60 }}>
              <Select
                value={sizePerPage}
                onChange={(e) => {
                  setSizePerPage(e.target.value);
                  setPage(1);
                }}
                disableUnderline
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  "& .MuiSelect-select": {
                    py: 0.5,
                    px: 1,
                    color: "text.primary",
                  },
                }}
              >
                {[5, 10, 20, 50, 100].map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Paper>
  );
};

// --- Watchers Page Component ---
const WatchersPage = ({ navigate }) => {
  const theme = useTheme();
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);

  const { data, isLoading, isError, error } = useMyTraderWatchListQuery({
    page,
    sizePerPage,
  });

  const watchlist = data?.data?.watchlist || [];
  const totalPages = data?.data?.totalPages || 1;

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel?.toUpperCase()) {
      case "HIGH":
        return "#F04438";
      case "MEDIUM":
        return "#F79009";
      case "LOW":
        return "#12B76A";
      default:
        return "#667085";
    }
  };

  const formatCurrency = (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  if (isLoading) {
    return (
      <Paper
        sx={{
          p: 4,
          display: "flex",
          justifyContent: "center",
          borderRadius: 2,
          border: "1px solid",
          borderColor: theme.palette.divider,
          boxShadow: "none",
          bgcolor: "background.paper",
          ...fadeIn,
        }}
      >
        <CircularProgress />
      </Paper>
    );
  }

  if (isError) {
    return (
      <Paper
        sx={{
          p: 4,
          textAlign: "center",
          borderRadius: 2,
          border: "1px solid",
          borderColor: theme.palette.divider,
          boxShadow: "none",
          bgcolor: "background.paper",
          ...fadeIn,
        }}
      >
        <Alert severity="error">
          Error loading watchlist: {error?.data?.message || "Please try again."}
        </Alert>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 2,
        border: "1px solid",
        borderColor: theme.palette.divider,
        boxShadow: "none",
        bgcolor: "background.paper",
        ...fadeIn,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="subtitle1" fontWeight="800" color="text.primary">
          Watchlist
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total Watchers: {watchlist.length}
        </Typography>
      </Stack>

      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="watchlist table">
          <TableHead>
            <TableRow
              sx={{
                "& th": {
                  fontWeight: "bold",
                  color: "text.secondary",
                  borderBottom: `1px solid ${theme.palette.divider}`,
                },
              }}
            >
              <TableCell>Trader</TableCell>
              <TableCell align="right">MT5 Login</TableCell>
              <TableCell align="right">Risk Level</TableCell>
              <TableCell align="right">Min Copy Balance</TableCell>
              <TableCell align="right">Total PnL</TableCell>
              <TableCell align="right">Win Rate</TableCell>
              <TableCell align="right">Active Copiers</TableCell>
              <TableCell align="right">Notifications</TableCell>
              <TableCell align="right">Added On</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {watchlist.length > 0 ? (
              watchlist.map((item) => (
                <TableRow
                  key={item.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "& td": {
                      borderBottom: `1px solid ${theme.palette.divider}`,
                    },
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.04),
                    },
                  }}
                  onClick={() =>
                    navigate &&
                    navigate(
                      `/client/copyTrading/master-trader-details/${item.masterTraderId}`
                    )
                  }
                >
                  <TableCell component="th" scope="row">
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: theme.palette.primary.main,
                          fontSize: "0.875rem",
                        }}
                      >
                        {item.masterTrader?.user?.name?.charAt(0) || "T"}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="600">
                          {item.masterTrader?.user?.name || "Unknown Trader"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.masterTrader?.displayName || ""}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight="500">
                      {item.masterTrader?.mt5Login || "-"}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      label={item.masterTrader?.riskLevel || "N/A"}
                      size="small"
                      sx={{
                        bgcolor: alpha(
                          getRiskLevelColor(item.masterTrader?.riskLevel),
                          0.1
                        ),
                        color: getRiskLevelColor(item.masterTrader?.riskLevel),
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(item.masterTrader?.minimumCopyBalance)}
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body2"
                      fontWeight="600"
                      sx={{
                        color:
                          parseFloat(item.masterTrader?.latestStats?.totalPnL) >
                          0
                            ? "#12B76A"
                            : parseFloat(
                                  item.masterTrader?.latestStats?.totalPnL
                                ) < 0
                              ? "#F04438"
                              : "text.secondary",
                      }}
                    >
                      {formatCurrency(item.masterTrader?.latestStats?.totalPnL)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight="500">
                      {item.masterTrader?.latestStats?.winRate
                        ? `${parseFloat(item.masterTrader.latestStats.winRate).toFixed(2)}%`
                        : "0.00%"}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight="500">
                      {item.masterTrader?.activeCopiers || 0}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      label={item.notificationsEnabled ? "ON" : "OFF"}
                      size="small"
                      sx={{
                        bgcolor: item.notificationsEnabled
                          ? alpha("#12B76A", 0.1)
                          : alpha("#667085", 0.1),
                        color: item.notificationsEnabled
                          ? "#12B76A"
                          : "#667085",
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      {formatDate(item.createdAt)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={9}
                  align="center"
                  sx={{ py: 3, color: "text.secondary" }}
                >
                  No traders in your watchlist.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 3,
            px: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 600 }}
            >
              Rows per page:
            </Typography>
            <FormControl size="small" variant="standard" sx={{ minWidth: 60 }}>
              <Select
                value={sizePerPage}
                onChange={(e) => {
                  setSizePerPage(e.target.value);
                  setPage(1);
                }}
                disableUnderline
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  "& .MuiSelect-select": {
                    py: 0.5,
                    px: 1,
                    color: "text.primary",
                  },
                }}
              >
                {[5, 10, 20, 50, 100].map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Paper>
  );
};

// --- Reviews Page Component ---
const ReviewsPage = ({ traderId, traderData }) => {
  const { reviewsCount, reviewsRating } = traderData || {};

  const theme = useTheme();

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { data: userDataObj } = useGetUserDataQuery(undefined, {
    skip: !token,
  });
  const currentUserId =
    userDataObj?.data?.userData?._id || userDataObj?.data?.userData?.id;

  const defaultValues = {
    masterTraderId: traderId,
    rating: 0,
    comment: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues,
  });

  const [submitReview, { isLoading }] = useSubmitReviewMutation();
  const [removeReview, { isLoading: isRemoveLoading }] =
    useRemoveReviewMutation();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const { data: reviewsData, isLoading: isReviewsLoading } = useReviewListQuery(
    {
      masterTraderId: traderId,
      page: page,
      limit: limit,
    }
  );

  const rawReviewsList = reviewsData?.data?.reviews || [];
  const reviewsList = [...rawReviewsList].sort((a, b) => {
    const isACurrentUser =
      a.user?.id === currentUserId || a.userId === currentUserId;
    const isBCurrentUser =
      b.user?.id === currentUserId || b.userId === currentUserId;
    if (isACurrentUser && !isBCurrentUser) return -1;
    if (!isACurrentUser && isBCurrentUser) return 1;
    return 0;
  });

  const totalPages = reviewsData?.data?.totalPages || 1;

  const onSubmit = async (data) => {
    try {
      const response = await submitReview(data).unwrap();
      if (response?.status) {
        dispatch(
          setNotification({
            open: true,
            message: response?.message,
            severity: "success",
          })
        );
        reset(defaultValues);
      }
    } catch (error) {
      if (!error?.data?.status) {
        dispatch(
          setNotification({
            open: true,
            message:
              error?.data?.message ||
              "Failed to submit. Please try again later.",
            severity: "error",
          })
        );
      }
    }
  };

  const handleDeleteReview = async () => {
    try {
      const response = await removeReview({
        masterTraderId: Number(traderId),
      }).unwrap();
      if (response?.status) {
        dispatch(
          setNotification({
            open: true,
            message: response?.message,
            severity: "success",
          })
        );
      }
    } catch (error) {
      if (!error?.data?.status) {
        dispatch(
          setNotification({
            open: true,
            message:
              error?.data?.message ||
              "Failed to delete review. Please try again later.",
            severity: "error",
          })
        );
      }
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper
          sx={{
            p: 4,
            borderRadius: 2,
            border: "1px solid",
            borderColor: theme.palette.divider,
            boxShadow: "none",
            bgcolor: "background.paper",
            ...fadeIn,
          }}
        >
          <Typography variant="h6" fontWeight="800" sx={{ mb: 3 }}>
            Write a Review
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <Box>
                <Typography
                  component="legend"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Rating
                </Typography>
                <Controller
                  name="rating"
                  control={control}
                  render={({ field }) => (
                    <Rating
                      {...field}
                      onChange={(_, value) => field.onChange(value)}
                      size="large"
                      precision={0.5}
                    />
                  )}
                />
                {errors.rating && (
                  <Typography variant="caption" color="error">
                    {errors.rating.message}
                  </Typography>
                )}
              </Box>
              <TextField
                label="Your Comment"
                multiline
                rows={4}
                {...register("comment")}
                error={!!errors.comment}
                helperText={errors.comment ? errors.comment.message : ""}
                variant="outlined"
                fullWidth
                placeholder="Tell us about your experience with this trader..."
              />
              <Box>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  sx={{
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? theme.palette.primary.main
                        : "#1a1a1a",
                    color: "white",
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 700,
                    textTransform: "none",
                    "&:hover": {
                      bgcolor:
                        theme.palette.mode === "dark"
                          ? theme.palette.primary.dark
                          : "#333",
                    },
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Submit Review"
                  )}
                </Button>
              </Box>
            </Stack>
          </form>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Paper
          sx={{
            p: 4,
            borderRadius: 2,
            border: "1px solid",
            borderColor: theme.palette.divider,
            boxShadow: "none",
            bgcolor: "background.paper",
            ...fadeIn,
            height: "100%",
            minHeight: "300px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 3 }}
          >
            <Typography variant="h6" fontWeight="800">
              Reviews ({reviewsCount || 0})
            </Typography>
            {reviewsRating && (
              <Stack direction="row" alignItems="center" spacing={1}>
                <Rating
                  value={reviewsRating}
                  precision={0.5}
                  readOnly
                  size="small"
                />
                <Typography variant="body2" fontWeight="700">
                  {reviewsRating}
                </Typography>
              </Stack>
            )}
          </Stack>

          <Box sx={{ overflowY: "auto", height: "500px" }}>
            {isReviewsLoading ? (
              <Stack spacing={2} sx={{ py: 3, alignItems: "center" }}>
                <CircularProgress size={30} />
              </Stack>
            ) : reviewsList.length > 0 ? (
              <Stack spacing={3}>
                {reviewsList.map((review) => (
                  <Box
                    key={review.id}
                    sx={{
                      p: 2,
                      bgcolor: theme.palette.action.hover,
                      borderRadius: 2,
                    }}
                  >
                    {currentUserId === (review.user?.id || review.userId) &&
                      (isRemoveLoading ? (
                        <Typography color="red" mb={2}>
                          Deleting...
                        </Typography>
                      ) : (
                        <DeleteOutlineIcon
                          size="extra-small"
                          sx={{
                            color: "red",
                            fontWeight: 700,
                            cursor: "pointer",
                            mb: 2,
                          }}
                          onClick={handleDeleteReview}
                        />
                      ))}
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      sx={{ mb: 1 }}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: theme.palette.primary.main,
                            fontSize: "0.875rem",
                          }}
                        >
                          {review.user?.name?.charAt(0) || "U"}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="700">
                            {`${review.user?.name}${currentUserId === (review.user?.id || review.userId) ? " (You)" : ""}` ||
                              "Unknown User"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Stack>
                      <Rating
                        value={parseFloat(review.rating)}
                        readOnly
                        size="small"
                      />
                    </Stack>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      {review.comment}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  No reviews available yet.
                </Typography>
              </Box>
            )}
          </Box>

          {totalPages > 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 3,
                pt: 2,
                borderTop: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontWeight: 600 }}
                >
                  Rows per page:
                </Typography>
                <FormControl
                  size="small"
                  variant="standard"
                  sx={{ minWidth: 60 }}
                >
                  <Select
                    value={limit}
                    onChange={(e) => {
                      setLimit(e.target.value);
                      setPage(1);
                    }}
                    disableUnderline
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      "& .MuiSelect-select": {
                        py: 0.5,
                        px: 1,
                        color: "text.primary",
                      },
                    }}
                  >
                    {[5, 10, 20, 50, 100].map((size) => (
                      <MenuItem key={size} value={size}>
                        {size}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, val) => setPage(val)}
                color="primary"
                shape="rounded"
                size="small"
              />
            </Box>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

// --- Visual Charts ---
const EquityAreaGraph = ({ data }) => {
  const chartData =
    data?.map((item) => ({
      ...item,
      formattedDate: item.timestamp
        ? new Date(item.timestamp).toLocaleString()
        : "",
      equityValue: parseFloat(item.equity || 0),
    })) || [];

  return (
    <Box sx={{ width: "100%", height: 220, mt: 2 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2E90FA" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#2E90FA" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="formattedDate" hide />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              border: "none",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
            }}
            itemStyle={{ color: "#2E90FA", fontWeight: "bold" }}
            formatter={(value) => [`$${value}`, "Equity"]}
            labelStyle={{ color: "#666" }}
          />
          <Area
            type="monotone"
            dataKey="equityValue"
            stroke="#2E90FA"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorEquity)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

const SimpleAreaGraph = ({ data }) => {
  const chartData =
    data?.map((item) => ({
      ...item,
      formattedDate: item.date ? new Date(item.date).toLocaleDateString() : "",
    })) || [];

  return (
    <Box sx={{ width: "100%", height: 220, mt: 2 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorPnL" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#12B76A" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#12B76A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="formattedDate" hide />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              border: "none",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
            }}
            itemStyle={{ color: "#12B76A", fontWeight: "bold" }}
            formatter={(value) => [`$${value}`, "PnL"]}
            labelStyle={{ color: "#666" }}
          />
          <Area
            type="monotone"
            dataKey="totalPnL"
            stroke="#12B76A"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorPnL)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

const StrategyStats = ({ stats, masterTrader }) => {
  const theme = useTheme();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value || 0);
  };

  const statItems = [
    { label: "Cumulative Copiers", value: masterTrader?.maxCopiers || 0 },
    { label: "Active Copiers", value: masterTrader?.activeCopiers || 0 },
    {
      label: "Minimum Copy Balance",
      value: formatCurrency(masterTrader?.minimumCopyBalance),
    },
    {
      label: "Average Win",
      value: stats?.averageWin ? formatCurrency(stats.averageWin) : "$0.00",
    },
    {
      label: "Average Loss",
      value: stats?.averageLoss ? formatCurrency(stats.averageLoss) : "$0.00",
    },
    { label: "Trades", value: stats?.totalTrades || 0 },
    {
      label: "Active Since",
      value: masterTrader?.createdAt
        ? new Date(masterTrader.createdAt).toLocaleDateString()
        : "N/A",
    },
  ];

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 4,
        border: "1px solid",
        borderColor: theme.palette.divider,
        boxShadow: "none",
        height: "100%",
        bgcolor: "background.paper",
        ...fadeIn,
      }}
    >
      <Typography
        variant="subtitle1"
        fontWeight="800"
        color="text.primary"
        sx={{ mb: 3, display: "flex", alignItems: "center" }}
      >
        Strategy Info{" "}
        <InfoOutlinedIcon
          sx={{ ml: 1, fontSize: 18, color: "text.secondary" }}
        />
      </Typography>
      <Stack spacing={2.2}>
        {statItems.map((item, i) => (
          <Stack
            key={i}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              color="text.secondary"
              variant="body2"
              sx={{
                display: "flex",
                alignItems: "center",
                fontSize: "0.85rem",
              }}
            >
              {item.label}{" "}
              {item.info && <InfoOutlinedIcon sx={{ ml: 0.5, fontSize: 14 }} />}
            </Typography>
            <Typography fontWeight="800" color="text.primary" variant="body2">
              {item.value}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
};

// --- MAIN DASHBOARD ---
const TraderDashboard = () => {
  const { traderId } = useParams();
  const navigate = useNavigate();
  const [chartTimeframe, setChartTimeframe] = useState("30D");

  // Subscribe/Unsubscribe state
  const [openSubscribeDialog, setOpenSubscribeDialog] = useState(false);
  const [openUnsubscribeDialog, setOpenUnsubscribeDialog] = useState(false);
  const [selectedMt5Login, setSelectedMt5Login] = useState("200022");
  const [selectedRiskType, setSelectedRiskType] = useState("");
  const [fixedLotSize, setFixedLotSize] = useState("");
  const [multiplier, setMultiplier] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionId, setSubscriptionId] = useState(null);

  // Watch state
  const [isWatching, setIsWatching] = useState(false);
  const [watchId, setWatchId] = useState(null);
  const [watchNotifications, setWatchNotifications] = useState(true);
  const [openWatchDialog, setOpenWatchDialog] = useState(false);
  const [openUnwatchDialog, setOpenUnwatchDialog] = useState(false);

  // API hooks
  const { data, isLoading, isError, refetch } = useGetMasterTraderDetailsQuery(
    { masterTraderId: traderId, chartTimeframe },
    { skip: !traderId }
  );

  const [subscribe, { isLoading: isSubscribing }] = useSubscribeMutation();
  const [unSubscribe, { isLoading: isUnsubscribing }] =
    useUnSubscribeMutation();
  const [addToWatchlist, { isLoading: isAddingToWatchlist }] =
    useAddMasterTraderIntoWatchListMutation();
  const [removeFromWatchlist, { isLoading: isRemovingFromWatchlist }] =
    useRemoveMasterTraderFromWatchListMutation();

  // Fetch user's subscriptions to check if this trader is already subscribed
  const { data: subscriptionsData } = useMySubscriptionListQuery({
    page: 1,
    sizePerPage: 100,
  });

  // Fetch user's watchlist to check if this trader is already watched
  const { data: watchlistData } = useMyTraderWatchListQuery({
    page: 1,
    sizePerPage: 100,
  });

  // Check if this trader is already subscribed
  useEffect(() => {
    if (subscriptionsData?.data?.subscriptions) {
      const foundSubscription = subscriptionsData.data.subscriptions.find(
        (sub) => sub.masterTraderId === Number(traderId)
      );
      if (foundSubscription) {
        setIsSubscribed(true);
        setSubscriptionId(foundSubscription.id);
      } else {
        setIsSubscribed(false);
        setSubscriptionId(null);
      }
    }
  }, [subscriptionsData, traderId]);

  // Check if this trader is already in watchlist
  useEffect(() => {
    if (watchlistData?.data?.watchlist) {
      const foundWatch = watchlistData.data.watchlist.find(
        (item) => item.masterTraderId === Number(traderId)
      );
      if (foundWatch) {
        setIsWatching(true);
        setWatchId(foundWatch.id);
        setWatchNotifications(foundWatch.notificationsEnabled || true);
      } else {
        setIsWatching(false);
        setWatchId(null);
      }
    }
  }, [watchlistData, traderId]);

  const masterTrader = data?.data?.masterTrader;
  const latestStats = data?.data?.latestStats;
  const pnlPerformanceChart = data?.data?.pnlPerformanceChart;
  const equityCurve = data?.data?.equityCurve;
  // Also get isWatching from API response as backup
  const apiIsWatching = data?.data?.isWatching;

  const hideTab = useMediaQuery("(max-width:400px)");
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();

  // --- Share Functionality ---
  const [anchorEl, setAnchorEl] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const openShareMenu = Boolean(anchorEl);

  const handleShareClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleShareClose = () => {
    setAnchorEl(null);
  };

  const currentUrl = window.location.href;
  const shareText = `Check out this master trader ${masterTrader?.user?.name || ""} on Flexy Markets!`;

  const handleShare = (platform) => {
    let url = "";
    switch (platform) {
      case "whatsapp":
        url = `https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`;
        window.open(url, "_blank");
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
        window.open(url, "_blank");
        break;
      case "email":
        url = `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(currentUrl)}`;
        window.location.href = url;
        break;
      case "instagram":
        navigator.clipboard.writeText(currentUrl);
        showSnackbar("Link copied! Share on Instagram", "success");
        setTimeout(() => {
          window.open("https://instagram.com", "_blank");
        }, 1500);
        break;
      case "copy":
        navigator.clipboard.writeText(currentUrl);
        showSnackbar("Link copied to clipboard!", "success");
        break;
      default:
        break;
    }
    handleShareClose();
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  // Subscribe handlers
  const handleCopyClick = () => {
    if (isSubscribed) {
      setOpenUnsubscribeDialog(true);
    } else {
      setOpenSubscribeDialog(true);
      setSelectedRiskType("");
      setFixedLotSize("");
      setMultiplier("");
      setErrors({});
    }
  };

  // Watch handlers
  const handleWatchClick = () => {
    if (isWatching) {
      setOpenUnwatchDialog(true);
    } else {
      setOpenWatchDialog(true);
    }
  };

  const handleAddToWatchlist = async () => {
    try {
      await addToWatchlist({
        masterTraderId: Number(traderId),
        notificationsEnabled: watchNotifications,
      }).unwrap();

      setOpenWatchDialog(false);
      setIsWatching(true);
      showSnackbar(
        `Added ${masterTrader?.user?.name || "trader"} to watchlist`,
        "success"
      );
      refetch(); // Refresh data to update isWatching status
    } catch (error) {
      console.error("Watch error:", error);
      showSnackbar(
        error?.data?.message || "Failed to add to watchlist",
        "error"
      );
    }
  };

  const handleRemoveFromWatchlist = async () => {
    try {
      await removeFromWatchlist({
        masterTraderId: Number(traderId),
      }).unwrap();

      setOpenUnwatchDialog(false);
      setIsWatching(false);
      setWatchId(null);
      showSnackbar(
        `Removed ${masterTrader?.user?.name || "trader"} from watchlist`,
        "success"
      );
      refetch(); // Refresh data to update isWatching status
    } catch (error) {
      console.error("Unwatch error:", error);
      showSnackbar(
        error?.data?.message || "Failed to remove from watchlist",
        "error"
      );
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!selectedRiskType) {
      newErrors.riskType = "Risk type is required";
      setErrors(newErrors);
      return false;
    }

    if (selectedRiskType === "FIXED_LOT") {
      if (!fixedLotSize) {
        newErrors.fixedLotSize = "Fixed lot size is required";
      } else if (parseFloat(fixedLotSize) <= 0) {
        newErrors.fixedLotSize = "Lot size must be greater than 0";
      }
    }

    if (selectedRiskType === "MULTIPLIER") {
      if (!multiplier) {
        newErrors.multiplier = "Multiplier is required";
      } else if (parseFloat(multiplier) <= 0) {
        newErrors.multiplier = "Multiplier must be greater than 0";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubscribe = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const requestBody = {
        masterTraderId: Number(traderId),
        mt5Login: selectedMt5Login,
        riskType: selectedRiskType,
      };

      if (selectedRiskType === "FIXED_LOT") {
        requestBody.fixedLotSize = parseFloat(fixedLotSize);
      } else if (selectedRiskType === "MULTIPLIER") {
        requestBody.multiplier = parseFloat(multiplier);
      }

      await subscribe(requestBody).unwrap();

      setOpenSubscribeDialog(false);
      setSelectedRiskType("");
      setFixedLotSize("");
      setMultiplier("");
      setIsSubscribed(true);

      showSnackbar(
        `Successfully subscribed to ${masterTrader?.user?.name || "trader"}`,
        "success"
      );
    } catch (error) {
      console.error("Subscribe error:", error);
      showSnackbar(error?.data?.message || "Failed to subscribe", "error");
    }
  };

  const handleUnsubscribe = async () => {
    try {
      await unSubscribe({
        subscriptionId: subscriptionId,
      }).unwrap();

      setOpenUnsubscribeDialog(false);
      setIsSubscribed(false);
      setSubscriptionId(null);

      showSnackbar(
        `Successfully unsubscribed from ${masterTrader?.user?.name || "trader"}`,
        "success"
      );
    } catch (error) {
      console.error("Unsubscribe error:", error);
      showSnackbar(error?.data?.message || "Failed to unsubscribe", "error");
    }
  };

  return (
    <Box
      sx={{
        bgcolor:
          theme.palette.mode === "dark" ? "background.default" : "#F9FAFB",
        minHeight: "100vh",
        pb: 10,
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          bgcolor: "background.paper",
          pt: 2,
          borderBottom: "1px solid",
          borderColor: theme.palette.divider,
        }}
      >
        <Container maxWidth="xl">
          {isLoading ? (
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "", sm: "center" }}
              sx={{ pb: 4 }}
              gap={"10px"}
            >
              <Stack direction="row" spacing={3} alignItems="center">
                <Skeleton variant="rounded" width={80} height={80} />
                <Box>
                  <Skeleton variant="text" width={200} height={40} />
                  <Skeleton variant="text" width={300} height={20} />
                  <Skeleton variant="text" width={400} height={20} />
                </Box>
              </Stack>
            </Stack>
          ) : isError ? (
            <Alert severity="error" sx={{ mb: 4 }}>
              Failed to load trader details
            </Alert>
          ) : (
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "", sm: "center" }}
              sx={{ pb: 4 }}
              gap={"10px"}
            >
              <Stack
                spacing={3}
                sx={{
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "", sm: "center" },
                  gap: { sm: 3 },
                }}
              >
                <Avatar
                  src={masterTrader?.profileImage}
                  variant="rounded"
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 3,
                    bgcolor: theme.palette.primary.main,
                  }}
                >
                  {masterTrader?.user?.name?.charAt(0)}
                </Avatar>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <Typography
                    variant="h4"
                    fontWeight="900"
                    color="text.primary"
                  >
                    {masterTrader?.user?.name}
                  </Typography>
                  <Stack
                    direction="row"
                    flexWrap={"wrap"}
                    gap={"10px"}
                    sx={{ mt: 1 }}
                  >
                    <Chip
                      label={masterTrader?.displayName || "Strategy"}
                      size="small"
                      sx={{
                        bgcolor: theme.palette.action.hover,
                        color: "text.primary",
                        fontWeight: 700,
                        borderRadius: 1,
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Strategy ID:{" "}
                      <b>{masterTrader?.sourceMt5Account?.Login}</b> &nbsp;
                      Provider: <b>{masterTrader?.user?.name} </b>
                    </Typography>
                  </Stack>
                  <Typography
                    variant="caption"
                    display="block"
                    sx={{ mt: 1, color: "text.secondary" }}
                  >
                    {masterTrader?.bio || "No description available."}
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1.5}>
                <IconButton
                  onClick={handleShareClick}
                  sx={{ color: "text.secondary" }}
                  aria-controls={openShareMenu ? "share-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={openShareMenu ? "true" : undefined}
                >
                  <ShareIcon fontSize="small" />
                </IconButton>

                <Menu
                  id="share-menu"
                  anchorEl={anchorEl}
                  open={openShareMenu}
                  onClose={handleShareClose}
                  MenuListProps={{
                    "aria-labelledby": "share-button",
                  }}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      borderRadius: 2,
                      mt: 1,
                      minWidth: 180,
                    },
                  }}
                >
                  <MenuItem onClick={() => handleShare("whatsapp")}>
                    <ListItemIcon>
                      <WhatsAppIcon
                        fontSize="small"
                        sx={{ color: "#25D366" }}
                      />
                    </ListItemIcon>
                    <ListItemText>WhatsApp</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => handleShare("facebook")}>
                    <ListItemIcon>
                      <FacebookIcon
                        fontSize="small"
                        sx={{ color: "#1877F2" }}
                      />
                    </ListItemIcon>
                    <ListItemText>Facebook</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => handleShare("instagram")}>
                    <ListItemIcon>
                      <InstagramIcon
                        fontSize="small"
                        sx={{ color: "#E4405F" }}
                      />
                    </ListItemIcon>
                    <ListItemText>Instagram</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => handleShare("email")}>
                    <ListItemIcon>
                      <EmailIcon fontSize="small" color="action" />
                    </ListItemIcon>
                    <ListItemText>Email</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => handleShare("copy")}>
                    <ListItemIcon>
                      <ContentCopyIcon fontSize="small" color="action" />
                    </ListItemIcon>
                    <ListItemText>Copy Link</ListItemText>
                  </MenuItem>
                </Menu>

                {/* Watch/Unwatch Button */}
                <Button
                  variant="outlined"
                  onClick={handleWatchClick}
                  disabled={isAddingToWatchlist || isRemovingFromWatchlist}
                  startIcon={
                    isWatching ? (
                      <VisibilityOutlinedIcon />
                    ) : (
                      <VisibilityOffOutlinedIcon />
                    )
                  }
                  sx={{
                    borderColor: isWatching ? "#FFD700" : theme.palette.divider, // Changed 'yellow' to '#FFD700'
                    color: isWatching ? "#FFD700" : "text.primary", // Changed 'yellow' to '#FFD700'
                    px: 3,
                    borderRadius: 10,
                    fontWeight: 900,
                    textTransform: "none",
                    "&:hover": {
                      borderColor: isWatching
                        ? "#FFD700"
                        : theme.palette.text.primary, // Changed 'yellow' to '#FFD700'
                      bgcolor: alpha(
                        isWatching ? "#FFD700" : theme.palette.primary.main,
                        0.1
                      ), // Changed alpha value to 0.1
                    },
                  }}
                >
                  {isAddingToWatchlist
                    ? "Adding..."
                    : isRemovingFromWatchlist
                      ? "Removing..."
                      : isWatching
                        ? "Watching"
                        : "Watch"}
                </Button>

                {/* Copy/Uncopy Button */}
                <Button
                  variant="contained"
                  onClick={handleCopyClick}
                  disabled={isSubscribing || isUnsubscribing}
                  sx={{
                    bgcolor: isSubscribed
                      ? theme.palette.error.main
                      : theme.palette.mode === "dark"
                        ? theme.palette.primary.main
                        : "#1a1a1a",
                    color: "white",
                    px: 5,
                    borderRadius: 10,
                    fontWeight: 900,
                    textTransform: "none",
                    "&:hover": {
                      bgcolor: isSubscribed
                        ? theme.palette.error.dark
                        : theme.palette.mode === "dark"
                          ? theme.palette.primary.dark
                          : "#333",
                    },
                  }}
                >
                  {isSubscribing
                    ? "Subscribing..."
                    : isUnsubscribing
                      ? "Unsubscribing..."
                      : isSubscribed
                        ? "Uncopy"
                        : "Copy"}
                </Button>
              </Stack>
            </Stack>
          )}

          {hideTab ? (
            <Selector
              items={[
                { label: "Overview", value: 0 },
                { label: "Order", value: 1 },
                { label: "Copiers", value: 2 },
                { label: "Watchers", value: 3 },
                { label: "Reviews", value: 4 },
              ]}
              value={activeTab}
              onChange={(e) => setActiveTab(e?.target?.value)}
              width={"200px"}
              showDefaultOption={false}
            />
          ) : (
            <Tabs
              value={activeTab}
              onChange={(e, v) => setActiveTab(v)}
              sx={{
                "& .MuiTabs-indicator": { bgcolor: theme.palette.text.primary },
                "& .MuiTab-root": {
                  color: "text.secondary",
                  "&.Mui-selected": { color: "text.primary" },
                },
              }}
            >
              {["Overview", "Order", "Copiers", "Watchers", "Reviews"].map(
                (label) => (
                  <Tab
                    key={label}
                    label={label}
                    sx={{ fontWeight: 700, textTransform: "none" }}
                  />
                )
              )}
            </Tabs>
          )}
        </Container>
      </Box>

      {/* CONTENT */}
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        {activeTab === 0 && (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: theme.palette.divider,
                  boxShadow: "none",
                  height: "100%",
                  bgcolor: "background.paper",
                  ...fadeIn,
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight="800"
                  color="text.primary"
                  sx={{ mb: 4 }}
                >
                  Performance
                </Typography>
                <Stack spacing={4}>
                  {[
                    {
                      l: "Return (Growth)",
                      v:
                        latestStats?.growthPercent != null
                          ? `${latestStats.growthPercent}%`
                          : "0.00%",
                      c:
                        parseFloat(latestStats?.growthPercent || 0) >= 0
                          ? "#12B76A"
                          : "#F04438",
                    },
                    {
                      l: "Max drawdown",
                      v:
                        latestStats?.maxDrawdownPercent != null
                          ? `${latestStats.maxDrawdownPercent}%`
                          : "0.00%",
                      c: "#F04438",
                    },
                    {
                      l: "Profit Factor",
                      v:
                        latestStats?.profitFactor != null
                          ? latestStats.profitFactor
                          : "0.00",
                      c: "text.primary",
                    },
                    {
                      l: "Win Rate",
                      v:
                        latestStats?.winRate != null
                          ? `${latestStats.winRate}%`
                          : "0.00%",
                      c: "text.primary",
                    },
                  ].map((item, idx) => (
                    <Stack
                      key={idx}
                      direction="row"
                      justifyContent="space-between"
                    >
                      <Typography color="text.secondary">{item.l}</Typography>
                      <Typography
                        fontWeight="800"
                        color={
                          item.c === "text.primary" ? "text.primary" : item.c
                        }
                      >
                        {item.v}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: theme.palette.divider,
                  boxShadow: "none",
                  height: "100%",
                  bgcolor: "background.paper",
                  ...fadeIn,
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 3 }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="800"
                    color="text.primary"
                  >
                    Trading Analysis
                  </Typography>
                  <ToggleButtonGroup
                    size="small"
                    value={chartTimeframe}
                    onChange={(e, newTimeframe) => {
                      if (newTimeframe !== null) {
                        setChartTimeframe(newTimeframe);
                      }
                    }}
                    exclusive
                    sx={{ bgcolor: theme.palette.action.hover }}
                  >
                    <ToggleButton
                      value="7D"
                      sx={{
                        textTransform: "none",
                        px: 2,
                        color: "text.secondary",
                        "&.Mui-selected": {
                          bgcolor: "background.paper",
                          color: "text.primary",
                          boxShadow: theme.shadows[1],
                        },
                      }}
                    >
                      7D
                    </ToggleButton>
                    <ToggleButton
                      value="30D"
                      sx={{
                        textTransform: "none",
                        px: 2,
                        color: "text.secondary",
                        "&.Mui-selected": {
                          bgcolor: "background.paper",
                          color: "text.primary",
                          boxShadow: theme.shadows[1],
                        },
                      }}
                    >
                      30D
                    </ToggleButton>
                    <ToggleButton
                      value="90D"
                      sx={{
                        textTransform: "none",
                        px: 2,
                        color: "text.secondary",
                        "&.Mui-selected": {
                          bgcolor: "background.paper",
                          color: "text.primary",
                          boxShadow: theme.shadows[1],
                        },
                      }}
                    >
                      90D
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Stack>
                <Stack direction="row" spacing={5} sx={{ mb: 1 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Return (Total PnL %)
                    </Typography>
                    <Typography
                      variant="h5"
                      fontWeight="900"
                      color={
                        parseFloat(latestStats?.totalPnLPercentage || 0) >= 0
                          ? "#12B76A"
                          : "#F04438"
                      }
                    >
                      {latestStats?.totalPnLPercentage != null
                        ? `${latestStats.totalPnLPercentage}%`
                        : "0.00%"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Total PnL
                    </Typography>
                    <Typography
                      variant="h5"
                      fontWeight="900"
                      color={
                        parseFloat(latestStats?.totalPnL || 0) >= 0
                          ? "#12B76A"
                          : "#F04438"
                      }
                    >
                      {latestStats?.totalPnL != null
                        ? `$${latestStats.totalPnL}`
                        : "$0.00"}
                    </Typography>
                  </Box>
                </Stack>
                <SimpleAreaGraph data={pnlPerformanceChart} />
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <StrategyStats stats={latestStats} masterTrader={masterTrader} />
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: theme.palette.divider,
                  boxShadow: "none",
                  height: "100%",
                  bgcolor: "background.paper",
                  ...fadeIn,
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight="800"
                  color="text.primary"
                  sx={{ mb: 3 }}
                >
                  Equity Curve
                </Typography>
                <EquityAreaGraph data={equityCurve} />
              </Paper>
            </Grid>
          </Grid>
        )}

        {activeTab === 1 && <OrderPage traderId={traderId} />}
        {activeTab === 2 && <CopiersPage traderId={traderId} />}
        {activeTab === 3 && <WatchersPage navigate={navigate} />}
        {activeTab === 4 && (
          <ReviewsPage traderId={traderId} traderData={data?.data} />
        )}
      </Container>

      {/* Subscribe Dialog */}
      <Dialog
        open={openSubscribeDialog}
        onClose={() => setOpenSubscribeDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Subscribe to {masterTrader?.user?.name}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <FormControl fullWidth required error={!!errors.riskType}>
              <InputLabel>Risk Type</InputLabel>
              <Select
                value={selectedRiskType}
                label="Risk Type"
                onChange={(e) => {
                  setSelectedRiskType(e.target.value);
                  setFixedLotSize("");
                  setMultiplier("");
                  setErrors({});
                }}
              >
                {riskTypes.map((risk) => (
                  <MenuItem key={risk.value} value={risk.value}>
                    <Box>
                      <Typography variant="body1">{risk.label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {risk.description}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {errors.riskType && (
                <FormHelperText>{errors.riskType}</FormHelperText>
              )}
            </FormControl>

            {selectedRiskType === "FIXED_LOT" && (
              <TextField
                fullWidth
                required
                label="Fixed Lot Size"
                type="number"
                value={fixedLotSize}
                onChange={(e) => setFixedLotSize(e.target.value)}
                error={!!errors.fixedLotSize}
                helperText={
                  errors.fixedLotSize || "Enter lot size (e.g., 0.01, 0.1, 1.0)"
                }
                inputProps={{
                  step: "0.01",
                  min: "0.01",
                }}
              />
            )}

            {selectedRiskType === "MULTIPLIER" && (
              <TextField
                fullWidth
                required
                label="Multiplier"
                type="number"
                value={multiplier}
                onChange={(e) => setMultiplier(e.target.value)}
                error={!!errors.multiplier}
                helperText={
                  errors.multiplier || "Enter multiplier (e.g., 1, 2, 5, 10)"
                }
                inputProps={{
                  step: "0.1",
                  min: "0.1",
                }}
              />
            )}

            <Typography variant="caption" color="text.secondary">
              Using MT5 Account: {selectedMt5Login}
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSubscribeDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSubscribe}
            variant="contained"
            disabled={isSubscribing}
          >
            {isSubscribing ? "Subscribing..." : "Confirm Subscription"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Unsubscribe Dialog */}
      <Dialog
        open={openUnsubscribeDialog}
        onClose={() => setOpenUnsubscribeDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Unsubscribe from {masterTrader?.user?.name}</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Are you sure you want to unsubscribe from this trader? You will stop
            copying their trades.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUnsubscribeDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleUnsubscribe}
            variant="contained"
            color="error"
            disabled={isUnsubscribing}
          >
            {isUnsubscribing ? "Unsubscribing..." : "Confirm Unsubscribe"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Watch Dialog */}
      <Dialog
        open={openWatchDialog}
        onClose={() => setOpenWatchDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add to Watchlist</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Typography variant="body1">
              Add {masterTrader?.user?.name} to your watchlist to track their
              performance?
            </Typography>
            <FormControl fullWidth>
              <FormControlLabel
                control={
                  <Switch
                    checked={watchNotifications}
                    onChange={(e) => setWatchNotifications(e.target.checked)}
                    color="primary"
                  />
                }
                label="Enable notifications for this trader"
              />
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenWatchDialog(false)}>Cancel</Button>
          <Button
            onClick={handleAddToWatchlist}
            variant="contained"
            disabled={isAddingToWatchlist}
          >
            {isAddingToWatchlist ? "Adding..." : "Add to Watchlist"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Unwatch Dialog */}
      <Dialog
        open={openUnwatchDialog}
        onClose={() => setOpenUnwatchDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Remove from Watchlist</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Are you sure you want to remove {masterTrader?.user?.name} from your
            watchlist?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUnwatchDialog(false)}>Cancel</Button>
          <Button
            onClick={handleRemoveFromWatchlist}
            variant="contained"
            color="error"
            disabled={isRemovingFromWatchlist}
          >
            {isRemovingFromWatchlist ? "Removing..." : "Remove"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Feedback */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default TraderDashboard;

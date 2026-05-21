import {
    Stack,
    Typography,
    IconButton,
    Divider,
    Fade,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ModalComponent from "../../../components/ModalComponent";
import AddWatchList from "./AddWatchList";
import {
    useAddSymbolToWatchListMutation,
    useWatchListQuery,
} from "../../../globalState/trade/tradeApis";
import Loader from "../../../components/Loader";
import { useDispatch } from "react-redux";
import { setNotification } from "../../../globalState/notificationState/notificationStateSlice";

function WatchList() {
    const dispatch = useDispatch();

    const { data, isLoading } = useWatchListQuery();
    const allSymbols = data?.data?.symbols || [];

    const [addSymbolToWatchList] = useAddSymbolToWatchListMutation();

    const handleRemoveSymbol = async (symbol) => {
        try {
            const response = await addSymbolToWatchList({
                symbol,
                action: "REMOVE",
            }).unwrap();

            if (response?.status) {
                dispatch(
                    setNotification({
                        open: true,
                        message: response.message,
                        severity: "success",
                    })
                );
            }
        } catch (err) {
            dispatch(
                setNotification({
                    open: true,
                    message:
                        err?.data?.message ||
                        "Failed to remove symbol. Please try again.",
                    severity: "error",
                })
            );
        }
    };

    return (
        <>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
            >
                <Typography fontWeight={600} fontSize={18}>
                    Watchlist
                </Typography>

                <ModalComponent
                    btnName="Add Symbol"
                    Content={AddWatchList}
                    contentData="ADD"
                />
            </Stack>

            <Divider sx={{ mb: 2, opacity: 0.15 }} />

            {isLoading ? (
                <Loader />
            ) : allSymbols.length === 0 ? (
                <Typography
                    textAlign="center"
                    color="text.secondary"
                    fontSize={14}
                    py={4}
                >
                    No symbols added yet
                </Typography>
            ) : (
                <Stack spacing={0.5}>
                    {allSymbols.map((item) => (
                        <Fade in key={item}>
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                                sx={{
                                    px: 1.5,
                                    py: 1.2,
                                    borderRadius: 2,
                                    transition: "all 0.2s ease",
                                    "&:hover": {
                                        backgroundColor: "rgba(255,255,255,0.04)",
                                    },
                                }}
                            >
                                <Typography
                                    fontWeight={500}
                                    letterSpacing={0.6}
                                    fontSize={14}
                                >
                                    {item}
                                </Typography>

                                <IconButton
                                    size="small"
                                    onClick={() => handleRemoveSymbol(item)}
                                    sx={{
                                        color: "text.secondary",
                                        "&:hover": {
                                            color: "error.main",
                                            backgroundColor: "rgba(244,67,54,0.12)",
                                        },
                                    }}
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </Stack>
                        </Fade>
                    ))}
                </Stack>
            )}
        </>
    );
}

export default WatchList;
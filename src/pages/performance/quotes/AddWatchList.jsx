import { Button, InputLabel, Stack, Typography } from "@mui/material";
import Selector from "../../../components/Selector";
import Grid from "@mui/material/Grid2";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { setNotification } from "../../../globalState/notificationState/notificationStateSlice"
import { useAddSymbolToWatchListMutation } from "../../../globalState/trade/tradeApis";
import * as z from 'zod';
import { useMappedSymbols } from "../../../hooks/useMappedSymbols";


const addWatchListSchema = z.object({
    symbol: z.string().min(1, "Symbol is required")
});


function AddWatchList({ data: actionType, onClose }) {

    const { mappedSymbols } = useMappedSymbols()

    const symbolList = mappedSymbols?.map((item) => ({
        label: item.groupedSym,
        value: item.groupedSym
    }));

    const dispatch = useDispatch()

    const defaultValues = {
        symbol: ""
    };

    const { handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(addWatchListSchema),
        defaultValues
    });

    const [addSymbolToWatchList, { isLoading }] = useAddSymbolToWatchListMutation()

    const onSubmit = async (data) => {

        try {
            const response = await addSymbolToWatchList({ ...data, action: actionType }).unwrap();

            if (response?.status) {
                dispatch(setNotification({ open: true, message: response?.message, severity: "success" }));
                reset(defaultValues)
                onClose()
            }

        } catch (data) {
            if (!data?.data?.status) {
                dispatch(setNotification({ open: true, message: data?.data?.message || "Failed to submit. Please try again later.", severity: "error" }));
            }
        }

    }


    return (
        <Stack>
            <Typography fontWeight={"bold"} fontSize={"1.2rem"} mb={2}>Add Symbol to Watchlist</Typography>
            <Grid
                component={"form"}
                container
                size={12}
                spacing={3}
                onSubmit={handleSubmit(onSubmit)}
            >
                <Grid item size={{ xs: 12 }}>
                    <InputLabel sx={{ mb: ".2rem", fontSize: "13px" }}>Select Symbol*</InputLabel>
                    <Selector
                        items={symbolList}
                        shouldBeFullWidth={true}
                        value={watch("symbol")}
                        onChange={(e) => setValue("symbol", e.target.value, { shouldValidate: true })}
                    />
                    {errors.symbol && <Typography color="error" fontSize={"14px"}>{errors.symbol.message}</Typography>}
                </Grid>
                <Button
                    fullWidth
                    variant="contained"
                    type="submit"
                    disabled={isLoading}
                    sx={{
                        textTransform: "none",
                        boxShadow: "none",
                        color: "white",
                        py: ".6rem",
                        "&:hover": {
                            boxShadow: "none"
                        }
                    }}
                >Add Symbol</Button>
            </Grid>
        </Stack>
    );
}

export default AddWatchList;
import { useState } from 'react';
import { Stack, Typography, TextField, InputAdornment, Box, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import QuotesCard from './QuotesCard';
import Grid from '@mui/material/Grid2';
import ModalComponent from '../../../components/ModalComponent';
import WatchList from './WatchList';

const PRIORITY_SYMBOLS = ['XAUUSD', 'XAGUSD', 'BTCUSD'];

function QuotesTable({ data }) {

    const [globalFilter, setGlobalFilter] = useState("");

    const orderedData = data
        ? [
            ...data.filter(item =>
                PRIORITY_SYMBOLS.includes(
                    (item.name).toUpperCase()
                )
            ),
            ...data.filter(item =>
                !PRIORITY_SYMBOLS.includes(
                    (item.name).toUpperCase()
                )
            ),
        ]
        : [];

    const filteredData = globalFilter
        ? orderedData.filter(item =>
            (item.name || item.Symbol)
                ?.toUpperCase()
                .includes(globalFilter.toUpperCase())
        )
        : orderedData;

    return (
        <Stack spacing={3}>

            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} spacing={2}>

                <Typography variant='h4' fontWeight={"700"}>Quotes</Typography>

                {data?.length > 0 && <Stack sx={{ flexDirection: "row", gap: "10px" }}>
                    <ModalComponent
                        btnName={"Watch List"}
                        Content={WatchList}
                    />
                </Stack>}

                <TextField
                    placeholder="Search Symbols..."
                    variant="outlined"
                    size="small"
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        width: { xs: '100%', sm: '300px' },
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                        }
                    }}
                />
            </Stack>

            <Grid container spacing={2}>
                {filteredData && filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                        <Grid item size={{ xs: 12 }} key={item.Symbol || index}>
                            <QuotesCard data={item} />
                        </Grid>
                    ))
                ) : (
                    <Grid item size={{ xs: 12 }}>
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="body1" color="text.secondary">
                                {data && data.length > 0 ? "No symbols match your search." : "Loading quotes..."}
                            </Typography>
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Stack>
    )
};

export default QuotesTable;

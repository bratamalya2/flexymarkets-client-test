import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { Stack, TextField } from '@mui/material';

function SearchPanel({ width = "100%", placeholder, value, onChange }) {

    return (
        <Stack
            component="form"
            sx={{
                flexDirection: "row",
                alignItems: 'center',
                width: width,
                border: "1px solid #c4c4c4",
            }}
        >
            <TextField
                fullWidth
                size="small"
                placeholder={placeholder || "Search..."}
                variant="outlined"
                value={value}
                onChange={onChange}
                sx={{
                    ml: 1,
                    "& .MuiOutlinedInput-root": {
                        "& fieldset": { border: "none" },
                        "&:hover fieldset": { border: "none" },
                        "&.Mui-focused fieldset": { border: "none" },
                    },
                    "& .MuiOutlinedInput-input": {
                        p: 0,
                    }
                }}
            />
            <IconButton type="button" aria-label="search">
                <SearchIcon />
            </IconButton>
        </Stack>
    );

}

export default SearchPanel;
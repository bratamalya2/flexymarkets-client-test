import { Autocomplete, TextField } from '@mui/material';;

function SearchableDropdown({ shouldBeDisabled = false, options, placeholder, value, onChange, noOptionText, type, width }) {

    return (
        <Autocomplete
            size='small'
            disablePortal
            disabled={shouldBeDisabled}
            value={value}
            onChange={(event, newValue) => onChange(newValue || "")}
            options={options}
            renderInput={(params) => <TextField {...params} placeholder={placeholder} />}
            sx={{ width: width }}
        />
    );

}

export default SearchableDropdown;
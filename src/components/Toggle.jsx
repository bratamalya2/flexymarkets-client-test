import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Stack } from '@mui/material';


function Toggle({ toggleButtonSx, items, toggleButtonGroupSx, stackSx, onChange, active }) {

    const handleAlignment = (event, newAlignment) => {
        onChange(newAlignment ? newAlignment : active);
    };

    return (
        <Stack sx={stackSx}>
            <ToggleButtonGroup
                value={active}
                color="primary"
                exclusive
                onChange={handleAlignment}
                aria-label="Platform"
                sx={{ color: "#989c9e", ...toggleButtonGroupSx }}
            >
                {
                    items?.map((item, i) => (
                        <ToggleButton
                            value={item.name}
                            sx={{
                                textTransform: "none",
                                fontSize: "1rem",
                                ...toggleButtonSx
                            }}
                            key={i}
                        >
                            {item?.icon || item?.name}
                        </ToggleButton>
                    ))
                }
            </ToggleButtonGroup>
        </Stack>
    );
}

export default Toggle;
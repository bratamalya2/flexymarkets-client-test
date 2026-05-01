import { MenuItem, Typography, Stack, FormControl, Select } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Icon } from '@iconify/react';

function Selector({
    items = [],
    shouldBeFullWidth = false,
    shouldBeDisabled = false,
    width,
    value,
    onChange,
    selectSx,
    showDefaultOption = true,
    disableItem = false
}) {
    return (
        <FormControl size="small" sx={{ width: width }} fullWidth={shouldBeFullWidth}>
            <Select
                disabled={shouldBeDisabled}
                size="small"
                value={value || ""}
                onChange={onChange}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                MenuProps={{ transitionDuration: 0 }}
                sx={{ ...selectSx, border: "none" }}
                IconComponent={KeyboardArrowDownIcon}
            >
                {showDefaultOption && (
                    <MenuItem value="">
                        <em>Select --</em>
                    </MenuItem>
                )}

                {items?.map((item, i) => (
                    <MenuItem
                        value={item.value || item.name || item}
                        key={i}
                        disabled={(item.value || item.name || item) === disableItem}
                    >
                        <Stack direction="row" alignItems="center" gap={1} width={"100%"} >
                            {item.image && (
                                <img src={item.image} alt={item.name} width="30" height="30" />
                            )}
                            {item.icon && (
                                <Icon icon={item.icon} fontSize={"2rem"} />
                            )}
                            {/* <Typography>
                                {item.name || item}
                            </Typography> */}
                            <Typography>
                                {item.label || item.name || item}
                            </Typography>
                            {item.description && (
                                <Typography sx={{ textAlign: "end", width: "100%" }} variant="body2" color="gray">
                                    {item.description}
                                </Typography>
                            )}
                        </Stack>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

export default Selector;
import {
  MenuItem,
  Typography,
  FormControl,
  Popper,
  Paper,
  MenuList,
  ClickAwayListener,
  InputBase,
  Box,
  CircularProgress,
  InputAdornment,
  IconButton
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useRef, useState, useEffect } from "react";
import useDebounce from "../hooks/useDebounce";
import ClearIcon from '@mui/icons-material/Clear';


function SearchableSelector({
  items = [],
  value,
  onChange,
  width,
  onSearchChange,
  shouldBeFullwidth = false,
  isLoading = false,
  getOptionLabel = (item) => item.name || item.label || "",
  multiple = false,
  disabled = false
}) {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    if (onSearchChange) {
      onSearchChange(debouncedSearch);
    }
  }, [debouncedSearch]);

  const selectedItems = multiple
    ? items.filter((item) => (value || []).includes(item.value))
    : items.find((item) => item.value === value);

  const handleSelect = (item) => {
    if (disabled) return;
    if (multiple) {
      const newValue = value?.includes(item.value)
        ? value.filter((v) => v !== item.value)
        : [...(value || []), item.value];
      onChange(newValue);
    } else {
      onChange(item.value);
      setOpen(false);
    }
  };

  const filteredItems = items.filter((item) =>
    getOptionLabel(item).toLowerCase().includes(search.toLowerCase())
  );

  const handleClearAll = () => {
    if (disabled) return;
    if (multiple) onChange([]);
    else onChange(null);
    setSearch("");
    if (onSearchChange) onSearchChange("");
  };

  return (
    <Box>
      <FormControl
        sx={{ width: { xs: "100%", sm: width || "100%" } }}
        fullWidth={shouldBeFullwidth}
        variant="outlined"
        size="small"
        disabled
      >
        <Box
          ref={anchorRef}
          // onClick={() => setOpen((prev) => !prev)}
          onClick={() => !disabled && setOpen((prev) => !prev)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border: "1px solid #ccc",
            borderRadius: "4px",
            px: 2,
            py: 1,
            // cursor: "pointer",
            cursor: disabled ? "not-allowed" : "pointer",
            bgcolor: disabled ? "#f5f5f5" : "inherit",
            opacity: disabled ? 0.6 : 1,
            minHeight: "40px",
            flexWrap: "wrap",
            gap: "4px",
          }}
        >
          <Typography>
            {multiple
              ? selectedItems.length
                ? selectedItems.map(getOptionLabel).join(", ")
                : "Please choose..."
              : selectedItems
                ? getOptionLabel(selectedItems)
                : "Please choose..."}
          </Typography>

          {((multiple && selectedItems.length > 0)
            // ||
            //   (!multiple && selectedItems)
          )
            && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearAll();
                }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            )}

          <KeyboardArrowDownIcon />
        </Box>
      </FormControl>
      {!disabled && (
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          style={{
            zIndex: 1300,
            width: anchorRef.current?.offsetWidth,
          }}
        >
          <ClickAwayListener onClickAway={() => setOpen(false)}>
            <Paper>
              <Box px={1} py={1}>
                <InputBase
                  placeholder="Search..."
                  fullWidth
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onMouseDown={(e) => e.stopPropagation()}
                  endAdornment={
                    search && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSearch("");
                            if (onSearchChange) onSearchChange("");
                          }}
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                  sx={{
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    px: 1,
                    py: 0.5,
                  }}
                />
              </Box>
              <MenuList sx={{ overflow: "auto", maxHeight: "300px" }}>
                {isLoading ? (
                  <MenuItem disabled>
                    <CircularProgress size={18} sx={{ mr: 1 }} /> Loading...
                  </MenuItem>
                ) : filteredItems.length ? (
                  filteredItems.map((item, idx) => (
                    <MenuItem
                      key={idx}
                      selected={
                        multiple ? value?.includes(item.value) : item.value === value
                      }
                      onClick={() => handleSelect(item)}
                    >
                      <Typography>{getOptionLabel(item)}</Typography>
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No results</MenuItem>
                )}
              </MenuList>
            </Paper>
          </ClickAwayListener>
        </Popper>
      )}
    </Box>
  );
}

export default SearchableSelector;
import { styled, alpha } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useEffect, useState } from 'react';
import { Stack, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import SearchPanel from "../../components/SearchPanel";
import { setSelectedSymbol } from '../../globalState/terminalState/terminalSlice';
import { useMappedSymbols } from '../../hooks/useMappedSymbols';


const StyledMenu = styled((props) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color: 'rgb(55, 65, 81)',
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
        ...theme.applyStyles('dark', {
            color: theme.palette.grey[300],
        }),
    },
}));






function TerminalSymbolMenu() {

    const { selectedSymbol } = useSelector(state => state.terminal)

    const dispatch = useDispatch();
    const [value, setValue] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (item) => {
        if (item) {
            dispatch(setSelectedSymbol(item));
        }
        setAnchorEl(null);
    };

    const { mappedSymbols, defaultSymbol } = useMappedSymbols()

    const filteredSymbols = mappedSymbols.filter(sym =>
        sym.name?.toLowerCase()?.includes(value.toLowerCase())
    );

    useEffect(() => {
        if (selectedSymbol) {
            dispatch(setSelectedSymbol(selectedSymbol));
        }
    }, [selectedSymbol, dispatch]);

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Stack
                    onClick={handleClick}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    sx={{
                        cursor: "pointer",
                        border: "1px solid transparent",
                        height: { xs: "40px", sm: "48px" },
                        justifyContent: "center",
                        px: ".8rem",
                        borderRadius: "5px",
                        ":hover": {
                            border: theme => `1px solid ${theme.palette.custom.brandLight}`,
                            bgcolor: theme => theme.palette.custom.activeNavigation
                        }
                    }}
                >
                    <AddIcon />
                </Stack>
            </Box>
            <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                    'aria-labelledby': 'demo-customized-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={() => handleClose()}
            >
                <MenuItem
                    key="search-bar"
                    onKeyDown={(e) => e.stopPropagation()}
                    sx={{
                        position: "sticky",
                        zIndex: "500",
                        top: "0",
                        justifyContent: "space-between",
                        backgroundColor: '#1e1e1e',
                        '&:hover': {
                            backgroundColor: '#1e1e1e'
                        }
                    }}>
                    <SearchPanel
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                </MenuItem>
                {filteredSymbols.map((item) => {

                    return <MenuItem
                        onClick={() => handleClose(item)}
                        key={`symbol-${item.name}`}
                        autoFocus={false}
                        sx={{
                            flexDirection: "row",
                            gap: "10px",
                            alignItems: "center",
                            '&:hover': {
                                backgroundColor: 'transparent'
                            },
                            mt: ".5rem"
                        }}
                    >
                        <Box sx={{ position: "relative", width: "20px", height: "20px" }}>
                            {item.img2 && <img
                                src={item.img2}
                                alt="error"
                                width="17px"
                                height="17px"
                                style={{
                                    borderRadius: "50%",
                                    position: "absolute",
                                    left: 0,
                                    top: 0
                                }}
                            />}
                            <img
                                src={item.img1}
                                alt="error"
                                width="17px"
                                height="17px"
                                style={{
                                    borderRadius: "50%",
                                    position: "absolute",
                                    right: item.img2 && "7px",
                                    top: item.img2 && "7px"
                                }}
                            />
                        </Box>
                        {item.name}
                    </MenuItem>
                })}
            </StyledMenu>
        </>
    );
}

export default TerminalSymbolMenu;
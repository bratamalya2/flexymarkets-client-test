import { styled, alpha } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useEffect, useState } from 'react';
import { Stack, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import SearchPanel from "../../components/SearchPanel";
import { setSelectedSymbol } from '../../globalState/terminalState/terminalSlice';
import { useGetMT5AccountSymbolQuery, useMt5AccountListQuery } from '../../globalState/mt5State/mt5StateApis';
import { useGetUserDataQuery } from '../../globalState/userState/userStateApis';


const allSymbol = [
    { name: "AUDJPY", img1: "/symbol_logo/AUD.svg", img2: "/symbol_logo/JYP.svg" },
    { name: "AUDNZD", img1: "/symbol_logo/AUD.svg", img2: "/symbol_logo/NZD.svg" },
    { name: "AUDUSD", img1: "/symbol_logo/AUD.svg", img2: "/symbol_logo/USD.svg" },
    { name: "AUS200", img1: "/symbol_logo/AUS200.svg" },
    { name: "CADCHF", img1: "/symbol_logo/CAD.svg", img2: "/symbol_logo/CHF.svg" },
    { name: "CADJPY", img1: "/symbol_logo/CAD.svg", img2: "/symbol_logo/JYP.svg" },
    { name: "CHFJPY", img1: "/symbol_logo/CHF.svg", img2: "/symbol_logo/JYP.svg" },
    { name: "EURAUD", img1: "/symbol_logo/EUR.svg", img2: "/symbol_logo/AUD.svg" },
    { name: "EURCAD", img1: "/symbol_logo/EUR.svg", img2: "/symbol_logo/CAD.svg" },
    { name: "EURCHF", img1: "/symbol_logo/EUR.svg", img2: "/symbol_logo/CHF.svg" },
    { name: "EURGBP", img1: "/symbol_logo/EUR.svg", img2: "/symbol_logo/GBP.svg" },
    { name: "EURJPY", img1: "/symbol_logo/EUR.svg", img2: "/symbol_logo/JYP.svg" },
    { name: "EURNZD", img1: "/symbol_logo/EUR.svg", img2: "/symbol_logo/NZD.svg" },
    { name: "EURUSD", img1: "/symbol_logo/EUR.svg", img2: "/symbol_logo/USD.svg" },
    { name: "GBPAUD", img1: "/symbol_logo/GBP.svg", img2: "/symbol_logo/AUD.svg" },
    { name: "GBPCAD", img1: "/symbol_logo/GBP.svg", img2: "/symbol_logo/CAD.svg" },
    { name: "GBPCHF", img1: "/symbol_logo/GBP.svg", img2: "/symbol_logo/CHF.svg" },
    { name: "GBPJPY", img1: "/symbol_logo/GBP.svg", img2: "/symbol_logo/JYP.svg" },
    { name: "GBPNZD", img1: "/symbol_logo/GBP.svg", img2: "/symbol_logo/NZD.svg" },
    { name: "GBPUSD", img1: "/symbol_logo/GBP.svg", img2: "/symbol_logo/USD.svg" },
    { name: "NZDCAD", img1: "/symbol_logo/NZD.svg", img2: "/symbol_logo/CAD.svg" },
    { name: "NZDCHF", img1: "/symbol_logo/NZD.svg", img2: "/symbol_logo/CHF.svg" },
    { name: "NZDJPY", img1: "/symbol_logo/NZD.svg", img2: "/symbol_logo/JYP.svg" },
    { name: "NZDUSD", img1: "/symbol_logo/NZD.svg", img2: "/symbol_logo/USD.svg" },
    { name: "US30", img1: "/symbol_logo/US30.svg" },
    { name: "USDCAD", img1: "/symbol_logo/USD.svg", img2: "/symbol_logo/CAD.svg" },
    { name: "USDCHF", img1: "/symbol_logo/USD.svg", img2: "/symbol_logo/CHF.svg" },
    { name: "USDJPY", img1: "/symbol_logo/USD.svg", img2: "/symbol_logo/JYP.svg" },
    { name: "USDNOK", img1: "/symbol_logo/USD.svg", img2: "/symbol_logo/NOK.svg" },
    { name: "XAGUSD", img1: "/symbol_logo/XAGUSD.svg", img2: "/symbol_logo/USD.svg" },
    { name: "XAUUSD", img1: "/symbol_logo/XAUUSD.svg", img2: "/symbol_logo/USD.svg" }
]


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

    const { activeMT5AccountLogin } = useSelector(state => state.mt5)
    const { selectedSymbol } = useSelector(state => state.terminal)
    // const { data, isLoading } = useGetMT5AccountSymbolQuery({ activeMT5AccountLogin }, { skip: !activeMT5AccountLogin })
    const { data: userData, isLoading: userDataLoading } = useMt5AccountListQuery({ search: activeMT5AccountLogin }, { skip: !activeMT5AccountLogin })

    const mt5LoginId = userData?.data?.mt5AccountList[0]?.id

    const selectedMT5LoginIdDefaultSym = userData?.data?.mt5AccountList[0]?.defaultSymbol

    // useEffect(() => {
    //     dispatch(setSelectedSymbol(selectedMT5LoginIdDefaultSym))
    // }, [selectedMT5LoginIdDefaultSym])


    const { data, isLoading } = useGetMT5AccountSymbolQuery({ id: mt5LoginId }, { skip: !mt5LoginId })

    const symbolList = data?.symbolList

    const symbolToShow = [];

    // if (Array.isArray(symbolList) && Array.isArray(allSymbol)) {
    //     const symbolSet = new Set(symbolList?.map(sym => sym?.includes(".") ? sym?.slice(0, -2) : sym));
    //     for (const sym of allSymbol) {
    //         if (symbolSet.has(sym.name)) {
    //             sym["groupedSym"] = sym.name
    //             symbolToShow.push(sym);
    //         }
    //     }
    // }

    if (Array.isArray(symbolList) && Array.isArray(allSymbol)) {
        const symbolMap = new Map(
            symbolList.map(sym => [
                sym?.includes(".") ? sym.slice(0, -2) : sym,
                sym
            ])
        );

        for (const sym of allSymbol) {
            const originalSymbol = symbolMap.get(sym.name);
            if (originalSymbol) {
                symbolToShow.push({
                    ...sym,
                    groupedSym: originalSymbol,
                });
            }
        }
    }

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

    const filteredSymbols = symbolToShow.filter(sym =>
        sym.name.toLowerCase().includes(value.toLowerCase())
    );

    useEffect(() => {
        if (!selectedSymbol && selectedMT5LoginIdDefaultSym) {
            dispatch(setSelectedSymbol(selectedMT5LoginIdDefaultSym));
        }
    }, [selectedMT5LoginIdDefaultSym, selectedSymbol, dispatch]);

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
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';

function TabComponent({ items, boxSx, onChange, active, tabSx }) {

    return (
        <Box sx={{ ...boxSx }}>
            <TabContext value={active}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={onChange} aria-label="lab API tabs example"
                        sx={{
                            "& .MuiTabs-indicator": {
                                backgroundColor: "primary.main",
                            }
                        }}
                    >
                        {items?.map((item, i) => (
                            <Tab
                                key={i}
                                label={item}
                                value={item}
                                sx={{
                                    textTransform: "none",
                                    "&.Mui-selected": {
                                        color: "primary.main",
                                    },
                                    ...tabSx
                                }}
                            />
                        ))}
                    </TabList>
                </Box>
            </TabContext>
        </Box>
    );
}

export default TabComponent;
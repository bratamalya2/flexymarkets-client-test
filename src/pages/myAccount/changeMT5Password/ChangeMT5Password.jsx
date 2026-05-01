import { Button, Card, Divider, Stack, Typography, InputLabel, Container, OutlinedInput, InputAdornment, IconButton } from '@mui/material'
import Grid from "@mui/material/Grid2"
import SearchableDropdown from '../../../components/SearchableDropdown';
import Selector from '../../../components/Selector';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState } from 'react';


function ChangeMT5Password() {

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    return (
        <Stack mt={"2rem"}>
            <Container>
                <Typography variant='h5' fontWeight={"700"} fontSize={"1.8rem"} mb={"2rem"}>Change MT5 Password</Typography>
                <Card
                    sx={{
                        boxShadow: "0 0px 0px 0 rgba(0, 0, 0, 0.19), 0 0px 8px 0 rgba(0, 0, 0, 0.19)",
                        borderRadius: "1.2rem",
                        padding: { xs: "1rem", md: "2rem" }
                    }}
                >
                    <Typography mx={{ xs: "1rem", md: "0" }}>Fill Details</Typography>
                    <Divider sx={{ my: "1.2rem" }} />
                    <Grid container size={12} spacing={3}>
                        <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                            <InputLabel sx={{ mb: ".5rem" }}>Select MT5 ID *</InputLabel>
                            <SearchableDropdown options={[]} placeholder="Please Choose..." />
                        </Grid>
                        <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                            <InputLabel sx={{ mb: ".5rem" }}>Password Type *</InputLabel>
                            <Selector items={["Both", "Main", "Investor"]} selected={"Both"} shouldBeFullWidth={true} />
                        </Grid>
                        <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                            <InputLabel sx={{ mb: ".5rem" }}>Main Password *</InputLabel>
                            <OutlinedInput
                                placeholder='Enter Main Password'
                                fullWidth
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label={
                                                showPassword ? 'hide the password' : 'display the password'
                                            }
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            onMouseUp={handleMouseUpPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                            <InputLabel sx={{ mb: ".5rem" }}>Investor Password *</InputLabel>
                            <OutlinedInput
                                placeholder='Enter Investor Password'
                                fullWidth
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label={
                                                showPassword ? 'hide the password' : 'display the password'
                                            }
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            onMouseUp={handleMouseUpPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </Grid>
                    </Grid>
                    <Button
                        variant='contained'
                        sx={{
                            textTransform: "capitalize",
                            width: "5rem",
                            boxShadow: "none",
                            color: "white",
                            mt: '1.5rem',
                            "&:hover": {
                                boxShadow: "none"
                            }
                        }}
                    >Submit</Button>
                </Card>
            </Container>
        </Stack >
    )
}

export default ChangeMT5Password;
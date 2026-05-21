import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import ModalComponent from './ModalComponent';

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






function MenuComponent({ btnContent, btnSx, menuData, otherMenuData, specialMenuData, modalMenuData, modalComponentData }) {

    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button
                id="demo-customized-button"
                aria-controls={open ? 'demo-customized-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                variant="contained"
                disableElevation
                sx={{ ...btnSx }}
                onClick={handleClick}
            >
                {btnContent}
            </Button>
            <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                    'aria-labelledby': 'demo-customized-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                {otherMenuData &&
                    <Stack sx={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #afb5b9", p: "1rem" }}>
                        {
                            Array.isArray(otherMenuData) && otherMenuData.map((item, i) => (
                                <Stack key={i} sx={{ alignItems: "center", justifyContent: "center", gap: '.5rem' }}>
                                    {
                                        item.link ? (
                                            <Button
                                                component={Link}
                                                to={item.link}
                                                sx={{
                                                    textTransform: "capitalize",
                                                    bgcolor: i && "#f3f5f7",
                                                    color: "black",
                                                    boxShadow: "none",
                                                    width: "40px",
                                                    height: "40px",
                                                    minWidth: "40px",
                                                    minHeight: "40px",
                                                    borderRadius: "50%",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    padding: 0,
                                                }}
                                            >
                                                <item.icon sx={{ fontSize: "1.2rem" }} />
                                            </Button>
                                        ) : (
                                            <ModalComponent
                                                Content={item.modalType}
                                                contentData={modalComponentData}
                                                btnSx={{
                                                    textTransform: "capitalize",
                                                    bgcolor: i && "#f3f5f7",
                                                    color: "black",
                                                    boxShadow: "none",
                                                    width: "40px",
                                                    height: "40px",
                                                    minWidth: "40px",
                                                    minHeight: "40px",
                                                    borderRadius: "50%",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    padding: 0,
                                                }}
                                                btnName={<item.icon sx={{ fontSize: "1.2rem" }} />}
                                                headingName={item.name}
                                                modalWidth={500}
                                            />
                                        )
                                    }
                                    <Typography variant='body1'>{item.name}</Typography>
                                </Stack>
                            ))
                        }
                    </Stack>
                }
                {
                    Array.isArray(menuData) && menuData.map((data, i) => (
                        <MenuItem key={i} onClick={handleClose}>{data}</MenuItem>
                    ))
                }
                {
                    Array.isArray(specialMenuData) && specialMenuData.map((data, i) => (
                        <MenuItem onClick={handleClose} component={Link} to={data.link} key={i}>
                            <data.icon sx={{ color: "primary.main" }} />
                            <Typography>{data.name}</Typography>
                        </MenuItem>
                    ))
                }
                {
                    modalMenuData?.map((item, index) => (
                        <MenuItem
                            key={index}
                            autoFocus={false}
                            onKeyDown={(e) => e.stopPropagation()}
                            onClick={(e) => { e.currentTarget.blur() }}
                        >
                            {
                                item.link && <Typography component={Link} to={item.link} sx={{ color: "inherit", textDecoration: "none" }}>{item.name}</Typography>
                            }
                            {
                                item.modalContent && <ModalComponent
                                    key={index}
                                    type={'text'}
                                    btnName={item.name}
                                    Content={item.modalContent}
                                    contentData={modalComponentData}
                                    modalWidth={500}
                                />
                            }
                        </MenuItem>
                    ))
                }
            </StyledMenu>
        </div>
    );
}

export default MenuComponent;
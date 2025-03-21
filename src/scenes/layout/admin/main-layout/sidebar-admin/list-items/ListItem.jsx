import Link from '@mui/material/Link';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconifyIcon from '../../../../../../components/base/IconifyIcon.jsx';
import React from 'react';
import {useLocation} from "react-router-dom";

const ListItem = ({subheader, icon, path, realPath}) => {
    const location = useLocation();
    return (
        <ListItemButton
            component={Link}
            href={path}
            sx={{
                mb: 2.5,
                bgcolor: realPath === location.pathname ? 'primary.main' : null,
                '&:hover': {
                    bgcolor: realPath === location.pathname ? 'primary.main' : null,
                },
            }}
        >
            <ListItemIcon>
                {icon && (
                    <IconifyIcon
                        icon={icon}
                        fontSize="h4.fontSize"
                        sx={{
                            color: realPath === location.pathname ? 'info.light' : null,
                        }}
                    />
                )}
            </ListItemIcon>
            <ListItemText
                primary={subheader}
                sx={{
                    '& .MuiListItemText-primary': {
                        color: realPath === location.pathname ? 'info.light' : null,
                    },
                }}
            />
        </ListItemButton>
    );
};

export default ListItem;

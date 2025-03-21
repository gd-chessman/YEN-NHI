import {
    Box,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import {tokens} from "../../../theme.js";
import X from "../../../components/ts/Button/X";
import {Link, useNavigate, useParams} from "react-router-dom";
import React from "react";


function NavbarOnStudy({title}) {


    const theme = useTheme();
    const isMdDevices = useMediaQuery("(max-width:768px)");
    const isXsDevices = useMediaQuery("(max-width:466px)");
    const colors = tokens(theme.palette.mode);
    const navigate=useNavigate();
    const {id}=useParams()
    const handleRedirect = () => {
        navigate(`/user/set/detail/${id}`)
    }
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            p={2}
            bgcolor="#EDEDFF"
            sx={{
                boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.1)",
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
            }}
            pr={5}
            pl={10}
        >
            <div className="title">{title}</div>

            <X onClick={handleRedirect}/>

        </Box>
    );
};

export default NavbarOnStudy;

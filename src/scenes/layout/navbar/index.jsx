import {
    Box,
    IconButton,
    useMediaQuery,
} from "@mui/material";
import {useContext} from "react";
import {
    MenuOutlined,
} from "@mui/icons-material";
import {ToggledContext} from "../../../App";
import {FaPlusSquare} from "react-icons/fa";
import {IoNotifications} from "react-icons/io5";
import LogoQuizcard from "../../../components/icon/LogoQuizcard.jsx";
import {Link, useNavigate} from "react-router-dom";
import {authenticate} from "src/services/AuthenticationService.js";

const Navbar = ({menuVisible, avatar}) => {
    const {toggled, setToggled} = useContext(ToggledContext);
    const isMdDevices = useMediaQuery("(max-width:768px)");
    const isXsDevices = useMediaQuery("(max-width:466px)");
    const navigate = useNavigate();
    const user = authenticate();
    const redirectPageCreateSet = () => {
        navigate('create');
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
        >
            <Box display="flex" alignItems="center" gap={5} ml={5}>
                <Link to="/user">
                    <LogoQuizcard size={32}/>
                </Link>
                <IconButton
                    sx={{display: `${isMdDevices ? "flex" : "none"}`}}
                    onClick={() => setToggled(!toggled)}
                >
                    <MenuOutlined/>
                </IconButton>
            </Box>
            <Box>
                <IconButton onClick={redirectPageCreateSet}>
                    <FaPlusSquare color="0E22E9"/>
                </IconButton>
                {/*<IconButton>*/}
                {/*    <IoNotifications color="0E22E9"/>*/}
                {/*</IconButton>*/}
                <IconButton onClick={menuVisible}>
                    {user.role[0] === "ROLE_PREMIUM_USER" && <img width="27" height="27"
                                                                  src={avatar || "https://img.icons8.com/color/48/user-male-circle--v1.png"}
                                                                  style={{
                                                                      borderRadius: "50%",
                                                                      border: "2px solid blue"
                                                                  }}
                                                                  alt="user-male-circle--v1"/>
                    }
                    {user.role[0] !== "ROLE_PREMIUM_USER" && <img width="27" height="27"
                                                                  src={avatar || "https://img.icons8.com/color/48/user-male-circle--v1.png"}
                                                                  style={{
                                                                      borderRadius: "50%",
                                                                  }}
                                                                  alt="user-male-circle--v1"/>
                    }

                </IconButton>
            </Box>
        </Box>
    );
};

export default Navbar;

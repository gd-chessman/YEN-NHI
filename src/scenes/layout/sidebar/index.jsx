import {Box, IconButton, useTheme} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import {tokens} from "../../../theme.js";
import {Menu, MenuItem, Sidebar} from "react-pro-sidebar";
import {MenuOutlined} from "@mui/icons-material";
import Item from "./Item";
import {ToggledContext} from "../../../App";
import {BiHomeSmile} from "react-icons/bi";
import FlashcardIcon from "../../../components/icon/IconFlashcard.jsx";
import KnowledgeArena from "../../../components/icon/IconKnowledgeArena.jsx";
import Ka from "../../../components/icon/IconKa.jsx";
import {Link, useNavigate} from "react-router-dom";
import IconClock from "../../../components/icon/IconClock.jsx";
import CardDeadline from "../../../components/DeadlineCard/CardDeadline.jsx";
import "../../../components/Term/Term.jsx"
import * as deadlineService from "../../../services/fetchDeadline.js"
import {useDeadline} from "src/context/DeadlineContext.jsx";

function SideBar() {
    const [collapsed, setCollapsed] = useState(false);
    const {toggled} = useContext(ToggledContext);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    // const [listDeadline, setListDeadline] = useState([]);
    const {listDeadline, refreshDeadline} = useDeadline();
    // const fetchDeadline = async () => {
    //     try {
    //         const response = await deadlineService.fetchDataDeadline();
    //         // console.log(response);
    //         if (response.status === 200) {
    //             setListDeadline(response.data);
    //         } else if (response.status === 404) {
    //             setListDeadline([]);
    //         }
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }
    useEffect(() => {
        refreshDeadline().then().catch();
    }, []);

    return (
        <Sidebar
            backgroundColor="#EDEDFF"
            rootStyles={{border: 0, height: "100%",}}
            collapsed={collapsed}
            toggled={false}
            breakPoint="md"
            display="flex"
        >

            <Menu
                menuItemStyles={{
                    button: {":hover": {background: "transparent"}}
                }}
            >
                <MenuItem
                    rootStyles={{
                        color: colors.gray[100],
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <IconButton onClick={() => setCollapsed(!collapsed)}>
                            <MenuOutlined/>
                        </IconButton>
                    </Box>
                </MenuItem>
            </Menu>

            <Box
                pl={collapsed ? undefined : "5%"}
                display="flex"
                flexDirection="column"
                gap="10px">
                <Menu>
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                            ":hover": {
                                cursor: "pointer",
                            }
                        }}
                    >
                        <Link to="/arena" style={{display: "flex", width: "100%"}}>
                            {collapsed ? <Ka/> : <KnowledgeArena/>}
                        </Link>
                    </Box>
                </Menu>

                <Menu
                    menuItemStyles={{
                        button: {
                            ":hover": {
                                color: "#868dfb",
                                background: "transparent",
                                transition: ".4s ease",
                            },
                        },
                    }}
                >
                    <Box
                        bgcolor={colors.primary[400]}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        borderRadius="15px"
                        borderTop="2px solid"
                        borderRight="2px solid"
                        borderLeft="2px solid"
                        borderBottom="4px solid"
                        borderColor="#e0e0fe"
                    >
                        <Item
                            title="Homepage"
                            path=""
                            colors={colors}
                            icon={<BiHomeSmile size={18}/>}
                        />
                    </Box>
                </Menu>

                <Menu
                    menuItemStyles={{
                        button: {
                            ":hover": {
                                color: "#868dfb",
                                background: "transparent",
                                transition: ".4s ease",
                            },
                        },
                    }}
                >
                    <Box
                        bgcolor={colors.primary[400]}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        borderRadius="15px"
                        borderTop="2px solid"
                        borderRight="2px solid"
                        borderLeft="2px solid"
                        borderBottom="4px solid"
                        borderColor="#e0e0fe"
                    >
                        <Item
                            title="My flashcard"
                            path="flashcard"
                            colors={colors}
                            icon={<FlashcardIcon size={18}/>}
                        />
                    </Box>
                </Menu>
                <Menu
                    menuItemStyles={{
                        button: {
                            ":hover": {
                                color: "#868dfb",
                                background: "transparent",
                                transition: ".4s ease",
                            },
                        },
                    }}
                >
                    <Box
                        bgcolor={colors.primary[400]}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        borderRadius="15px"
                        borderTop="2px solid"
                        borderRight="2px solid"
                        borderLeft="2px solid"
                        borderBottom="4px solid"
                        borderColor="#e0e0fe"
                    >
                        <Item
                            title="You have deadlines"
                            colors={colors}
                            icon={<IconClock/>}
                        />
                        <div style={{maxHeight: "200px", overflowY: "auto"}}>
                            {!collapsed && listDeadline.length > 0 ? (
                                listDeadline.map((item, index) => (
                                    <CardDeadline
                                        size={0.75}
                                        status={true}
                                        title={item.title}
                                        deadline={item.reminderTime}
                                        totalCard={item.cardCount}
                                        setId={item.setId}
                                        key={index}
                                    />
                                ))
                            ) : (
                                !collapsed && (
                                    <Box sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        textAlign: "center",
                                        color: "gray",
                                        fontSize: "10px"
                                    }} p={1}>
                                        No deadlines available.
                                    </Box>
                                )
                            )}
                        </div>
                    </Box>
                </Menu>
            </Box>
        </Sidebar>
    );
};

export default SideBar;

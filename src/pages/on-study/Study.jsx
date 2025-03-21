import {Box, CssBaseline, ThemeProvider} from "@mui/material";
import {ColorModeContext, useMode} from "../../theme.js";
import NavbarStudy from "../../scenes/layout/navbar-study/index.jsx";
import FlashcardArray from "../../components/ts/FlashcardArray/FlashcardArray";
import React, {useCallback, useEffect, useState} from "react";
import "../../../src/components/ts/ProgressStudy/Progress.scss"
import {useParams} from "react-router-dom";
import Loading from "src/components/Loading.jsx";
import {convertHtmlToText, removeNewlines, textToHtml} from "src/utils/HtmlAndFileUtils.jsx";
import * as progressService from "src/services/UserProgress.js";
import {filterProgress} from "src/utils/filterProgressFunction.jsx";
import api from "src/apis/api.js";
import {toast, ToastContainer} from "react-toastify";


function Study() {
    const [theme, colorMode] = useMode();
    const {id} = useParams();
    const [data, setData] = useState([]);
    const [recall, setRecall] = useState(0);
    const [remember, setRemember] = useState(0);
    const [title, setTitle] = useState();
    const user = JSON.parse(localStorage.getItem("user"));
    const formatCardArray = (cards) => {
        if (!Array.isArray(cards)) {
            console.error("Invalid cards data:");
            return [];
        }
        // return cards.map((listCard) => ({
        //     id: listCard.cardId,
        //     frontHTML: textToHtml(listCard.question),
        //     backHTML: textToHtml(listCard.answer),
        //     img: listCard.imageUrl,
        //     isRemembered: listCard.statusProgress,
        //     mark: listCard.statusMark,
        // }));
        return cards.map((listCard) => ({
            id: listCard.id,
            frontHTML: listCard.frontHTML,
            backHTML: listCard.backHTML,
            img: listCard.imageUrl,
            isRemembered: null,
            mark: listCard.mark,
        }));
    };
    const handleProgress = useCallback((remember, recall) => {
        setRecall(recall);
        setRemember(remember);
    }, []);
    // const handleUpdateProgress = (id, status) => {
    //     const data={
    //         cardId:id,
    //         userId:user.id,
    //         isAttention
    //
    //     }
    // }
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await progressService.getProgressBySetIdUserId(user.id, id);
                setTitle(res[0].title);
                const nativeCards_ = res.map(item => ({
                    id: item.cardId,
                    frontHTML: textToHtml(item.question),
                    backHTML: textToHtml(item.answer),
                    img: item.imageUrl,
                    imageUrl: item.imageUrl,
                    isRemembered: item.statusProgress,
                    mark: item.statusMark === true,
                }));
                setData(formatCardArray(filterProgress(nativeCards_)));
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Error fetching data");
            }
        };
        console.log(data);
        fetchData().then().catch();
    }, [id]);

    const handleUpdateCards = (data) => {
        // setData(data);
    }
    const handleViewCard = () => {
        console.log(data);
    }

    const handleOnSound = async (data) => {
        console.log(removeNewlines(data));
        await api.post("http://localhost:8080/api/v1/speech",removeNewlines(data));

    }

    const handleCardStatusChange = async(idCard, status) => {
        try {
            console.log(status);
            await api.patch("/v1/progress/user/assign-progress", {
                progressType: status,
                cardId: idCard,
            });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                {data ? (
                    <NavbarStudy title={title}/>
                ) : (
                    <Loading type={"bubbles"}/>
                )}
                <Box sx={{display: "flex", height: "100vh", maxWidth: "100%"}} pt={9}>
                    <Box
                        bgcolor="#EDEDFF"
                        sx={{
                            flexGrow: 1,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                        }}
                        gap={4}
                    >
                        <div className="wrapper">
                            <div className="box recall">
                                {recall}
                            </div>
                            <div className="box remember">
                                {remember}
                            </div>
                        </div>
                        <FlashcardArray cards={data} FlashcardArrayStyle={{
                            width: "70%",
                            fontSize: "1.6rem"
                        }}
                                        heightCard="450px"
                                        onStudy={true}
                                        onProgressStudy={handleProgress}
                                        onUpdateCards={handleUpdateCards}
                                        onSound={handleOnSound}
                                        onCardStatusChange={handleCardStatusChange}
                        />
                    </Box>
                </Box>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export default Study;

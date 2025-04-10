import {Box, useTheme, useMediaQuery, Button} from "@mui/material";
import {useCallback, useEffect, useRef, useState} from "react";
import ReactQuill, {Quill} from "react-quill";
import CreateCardButton from "../../components/icon/CreateCardButton.jsx";
import Plus from "../../components/icon/Plus.jsx";
import Remove from "../../components/icon/Remove.jsx";
import LockIcon from "../../components/icon/LockIcon.jsx";
import ImportText from "../../components/icon/ImportText.jsx";
import ImagePreview from "../../components/ImagePreview.jsx";
import ImageToggleButton from "../../components/ImageToggleButton.jsx";
import api from "../../apis/api.js";
import { usePremiumFilter, PremiumUpgradeMessage, MaxFlashcardsMessage } from "../../components/component-add-update/PremiumFilter.jsx";
import {debounce} from "lodash";
import {canAccess, Roles} from "../../roles/roles.js";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {uploadToFirebase} from "../../utils/firebaseUtils.js";
import {storage} from "../../configs/firebaseConfig.js";
import {useNavigate} from "react-router-dom";
import {htmlToText} from "html-to-text";
import {convertHtmlToText, textToHtml} from "../../utils/HtmlAndFileUtils.jsx";

import ImportTextComp from "src/components/ImportText/ImportTextComp.jsx";
import "./index.css";
import {parseImportTextBaseOnString, parseImportTextQToA} from "src/utils/parseImportText.jsx";

function AddNewSet() {
    const navigate = useNavigate();
    const [listCard, setListCard] = useState([]);
    const [importFile, setImportFile] = useState(false);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [benefits, setBenefits] = useState({});
    const [maxFlashcards, setMaxFlashcards] = useState(0);
    const [isFreeUser, setIsFreeUser] = useState(true);
    const [isBlockPageByPremium, setIsBlockPageByPremium] = useState(false);
    const [blockMessageBody, setBlockMessageBody] = useState(<></>);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [privacy, setPrivacy] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(1);

    const upgradeModal = useRef(null);

    const blockPageBtn = useRef(null);

    const [categories, setCategories] = useState([
        {categoryId: 1, categoryName: 'Choose a category'},
    ]);

    useEffect(() => {
        const checkUserStatus = async () => {
            try {
                const [
                    resCategories,
                    resRole,
                    resBenefit,
                    resNumberSet,
                    resMaxSetCreatedToday,
                ] = await Promise.all([
                    api.get("/v1/category/list"),
                    api.get("/v1/auth/user-info"),
                    api.get("/v1/category-subscription/current-benefit"),
                    api.get("/v1/set/count-set"),
                    api.get("/v1/set/count-set-in-current-date"),
                ]);

                setCategories(resCategories.data);
                let freeUser = canAccess(resRole.data.role, [Roles.FREE_USER]);
                setIsFreeUser(freeUser);

                setBenefits(resBenefit.data);
                setMaxFlashcards(resBenefit.data.maxFlashcardsPerSet ?? 0);

                if (resNumberSet.data.data >= resBenefit.data.maxSetsFlashcards) {
                    blockPageFunction(
                        `You cannot create more sets because the maximum number of sets is: ${resBenefit.data.maxSetsFlashcards}`,
                        freeUser
                    );
                    return;
                }
                if (resMaxSetCreatedToday.data.data >= resBenefit.data.maxSetsPerDay) {
                    blockPageFunction(
                        `You cannot create more sets because the maximum number of sets created per day is: ${resBenefit.data.maxSetsPerDay}`,
                        freeUser
                    );
                }
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    loginRedirect();
                }
                console.error(err);
            }
        };

        checkUserStatus().then().catch();
    }, []);

    const handlePremiumFilter = usePremiumFilter(isFreeUser);

    const BlockMessage = ({ toastId }) => (
        <div>
            <h2>Sorry</h2>
            {blockMessageBody}
            <button id="cancelBtn" onClick={() => toast.dismiss(toastId)}>
                Cancel
            </button>
            {isFreeUser && (
                <button id="saveButtonBtn" onClick={() => toast.dismiss(toastId)}>
                    Go to upgrade
                </button>
            )}
        </div>
    );

    const blockPageFunction = (message, freeUser) => {
        setIsBlockPageByPremium(true);
        setBlockMessageBody(
            <>
                <p style={{marginTop: "14px"}}>{message}</p>
                {freeUser && <p style={{marginBottom: "14px"}}>Do you want to upgrade ?</p>}
            </>
        );
        blockPageBtn.current.click();
    };

    const showToastr = (ToastComponent, type) => {
        const options = { autoClose: true, closeButton: true };
        if (type === "error") {
            toast.error(<ToastComponent />, options);
        } else if (type === "warning") {
            toast.warning(<ToastComponent />, options);
        } else if (type === "success") {
            toast.success(<ToastComponent />, options);
        }
    };

    const loginRedirect = () => {
        const currentUrl = window.location.pathname + window.location.search;
        const loginUrl = `/login?redirect=${encodeURIComponent(currentUrl)}`;
        window.location.href = loginUrl;
    };

    const addCard = useCallback(() => {
        setListCard((prev) => [...prev, {id: prev.length + 1, front: "", back: "", img: ""}]);
    }, []);

    const removeCard = useCallback(
        (id) => {
            setListCard((prev) => prev.filter(card => card.id !== id));
        }
        , []
    );

    const handleImageUpload = (event, id) => {
        const file = event.target.files[0];
        if (file) {
            // Tiêu chí 1: Kiểm tra loại file có phải image không
            if (!file.type.startsWith('image/')) {
                alert('Only image files are accepted. Please select the correct file format!');
                return; // Dừng lại nếu không phải file ảnh
            }

            // Tiêu chí 2: Kiểm tra kích thước file (25MB = 25 * 1024 * 1024 bytes)
            const maxSizeInBytes = 25 * 1024 * 1024; // 25MB
            if (file.size > maxSizeInBytes) {
                alert('File exceeds allowed size (25MB). Please choose a smaller file!');
                return; // Dừng lại nếu file quá lớn
            }

            // Nếu thỏa mãn cả hai tiêu chí, tiến hành đọc file
            const reader = new FileReader();
            reader.onload = (event) => {
                setListCard((prev) =>
                    prev.map((card) => card.id === id ? { ...card, img: event.target.result } : card)
                );
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageRemove = (id) => {
        setListCard((prev) =>
            prev.map((card) => card.id === id ? {...card, img: ""} : card)
        );
    };

    const quillModules = {
        toolbar: false,
    };

    const handleWriteDataCard = (type, value, id) => {
        setListCard((prev) =>
            prev.map((card) => card.id === id ? {...card, [type]: value} : card)
        );
    }

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
        console.log(event.target.value);
    };

    const handlePrivacyChange = (event) => {
        setPrivacy(event.target.value === "true");
    };

    const handleTagsChange = (event) => {
        setTags(event.target.value);
    };

    const handleParseChangedImportText = (text, useMotipQAChange, termSeparator, cardSeparator, hasImage) => {
        text = convertHtmlToText(text);
        let cards = [];
        if (useMotipQAChange) {
            cards = parseImportTextQToA(text);
        } else {
            cards = parseImportTextBaseOnString(text, termSeparator, cardSeparator, hasImage);
        }
        console.log(text);
        if (isFreeUser) {
            if (cards.length >= maxFlashcards) {
                toast.error(`Cannot parse card because max cards of set are: ${maxFlashcards}.`);
                setListCard([]);
                return;
            }
            for (let card of cards) {
                if (card.img) {
                    toast.error("Cannot parse card because you are free user but insert image link.");
                    setListCard([]);
                    return;
                }
            }
        }
        let newCards = cards.map(card => ({
            id: card.id,
            front: textToHtml(card.front),
            back: textToHtml(card.back),
            img: card.img,
        }));
        // console.log(newCards);
        console.log("Parse done");
        setListCard(newCards);
    };

    const uploadAllImagesToCloud = async (listCard) => {
        let newListCard = [];
        for (let card of listCard) {
            let downloadUrl = "";
            if (card.img) {
                downloadUrl = await uploadToFirebase(
                    storage,
                    card.img,
                    "images",
                    null,
                    null
                );
            }
            newListCard.push({
                question: convertHtmlToText(card.front),
                answer: convertHtmlToText(card.back),
                imageLink: downloadUrl
            });
        }
        return newListCard;
    };

    const checkListCardValid = (listCard) => {
        if (listCard.length < 2) {
            toast.error("You need at least two flashcards for created set.");
            throw new Error("Error card");
        }

        if (listCard.length > maxFlashcards) {
            toast.error(`You cannot add set flashcard because max cards of set are: ${maxFlashcards}`);
            throw new Error("Error card");
        }

        let messageError = "";
        let isOk = true;

        for (let card of listCard) {
            const cardDiv = document.getElementById(`cardData-${card.id}`);
            if (!(card.front && card.back)) {
                messageError = "Missing question or answer in card";
                isOk = false;
            }
            if (isOk && convertHtmlToText(card.front).length > 500 ||
                convertHtmlToText(card.back).length > 500) {
                messageError = "Length of question or answer must be less than 500.";
                isOk = false;
            }
            if (isOk && card.img) {
                if (isFreeUser) {
                    messageError = "You cannot add set flashcard because u maybe cheating...";
                    isOk = false;
                }
            }
            if (!isOk) {
                toast.error(messageError);
                cardDiv.style.border = "2px solid red";
                cardDiv.scrollIntoView({behavior: "smooth", block: "center"});
                throw new Error("Error card");
            }
            cardDiv.style.border = "none";
        }
    };

    const handleCreate = async (event) => {
        if (!title) {
            toast.error("Missing title");
            return;
        }

        if (isFreeUser && isAnonymous) {
            toast.error("Free user cannot set anonymous. Đòi hỏi ít thôi");
            return;
        }

        try {
            checkListCardValid(listCard);
        } catch (err) {
            console.log(err);
            return;
        }

        event.preventDefault();
        document.body.style.opacity = "0.5";
        document.body.style.pointerEvents = "none";
        let failed = false;
        let setIdCreated = 0;

        try {
            const newListCards = await uploadAllImagesToCloud(listCard);
            const setData = {
                title,
                descriptionSet: description,
                isAnonymous,
                sharingMode: privacy,
                categoryId: selectedCategory,
                tagNames: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
                flashcards: newListCards
            };
            const res = await api.post("/v1/set/create-new-set", setData);
            console.log(res);
            if (res.status === 201) {
                toast.success("Added card successfully");
                setTimeout(() => {
                    navigate(`/user/set/detail/${res.data.data}`);
                }, 2000);
            }
        } catch (err) {
            console.error(err);
            toast.error(err.message);
        } finally {
            document.body.style.opacity = "1";
            document.body.style.pointerEvents = "";
        }
    };

    return (
        <>
            <Box p={isSmallScreen ? 2 : 5} sx={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
                margin: {xs: "0 20px", sm: "0 50px", md: "0 150px", lg: "0 250px"},
                position: "relative"
            }}>
                <h3><b>Create your own flashcard set</b></h3>

                <input
                    type="text"
                    style={{
                        border: "hidden",
                        height: "20px",
                        width: "100%",
                        fontWeight: "bold",
                        padding: "20px",
                        fontSize: "15px",
                        borderRadius: "15px",
                    }}
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Give a title (e.g: Software Testing MCQ - Fall 2024)"
                />

                <Box sx={{display: "flex", flexDirection: {xs: "column", md: "row"}, gap: "20px"}}>
                    <input
                        type="text"
                        style={{
                            border: "hidden",
                            height: "50px",
                            width: "100%",
                            fontWeight: "bold",
                            padding: "20px",
                            fontSize: "15px",
                            borderRadius: "15px",
                        }}
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder="Description ..."
                    />

                    <input
                        type="text"
                        style={{
                            border: "hidden",
                            height: "50px",
                            width: "100%",
                            fontWeight: "bold",
                            padding: "20px",
                            fontSize: "15px",
                            borderRadius: "15px",
                        }}
                        value={tags}
                        onChange={handleTagsChange}
                        placeholder="Tags (comma separated) ..."
                    />
                </Box>

                <Box sx={{display: "flex", flexDirection: {xs: "column", md: "row"}, gap: "20px"}}>
                    <Box width="100%" p={2}>
                        <p style={{fontSize: "16px"}}>Alternative :</p>
                        <button onClick={() => setImportFile(true)} style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-around",
                            backgroundColor: "white",
                            borderRadius: "15px",
                            height: "40px",
                            width: "130px",
                            border: "none",
                            borderBottom: "4px solid #e0e0fe",
                            cursor: "pointer"
                        }}>
                            <ImportText/>
                            Import text
                        </button>
                    </Box>

                    <Box width="100%" p={2}>
                        <p style={{fontSize: "16px"}}>Category :</p>
                        <select style={{
                            width: "100%",
                            height: "40px",
                            borderRadius: "15px",
                            border: "none",
                            borderBottom: "4px solid #e0e0fe",
                            padding: "8px"
                        }}
                                onChange={handleCategoryChange}
                                defaultValue="1"
                        >
                            {
                                categories.map(category => (
                                    <option key={category.categoryId} value={category.categoryId}>
                                        {category.categoryName}
                                    </option>
                                ))
                            }
                        </select>
                        <Box sx={{display: "flex", justifyContent: "space-between", flexWrap: "wrap"}}>
                            <div style={{width: "48%"}}>
                                <p style={{fontSize: "16px"}}>Privacy:</p>
                                <select
                                    value={privacy.toString()}
                                    onChange={handlePrivacyChange}
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        borderRadius: "15px",
                                        border: "none",
                                        borderBottom: "4px solid #e0e0fe",
                                        padding: "8px"
                                    }}>
                                    <option value="true">Publish</option>
                                    <option value="false">Private</option>
                                </select>
                            </div>

                            <div>
                                <p style={{fontSize: "16px"}}>Publish as :</p>
                                <button style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-around",
                                    backgroundColor: "white",
                                    borderRadius: "15px",
                                    height: "40px",
                                    width: "130px",
                                    border: "none",
                                    borderBottom: "4px solid #dbbef4",
                                    color: isAnonymous ? "#000000" : "#b6b7bf",
                                    fontWeight: isAnonymous ? "bold" : "normal",
                                }}
                                        onClick={(e) => handlePremiumFilter(
                                            e,
                                            isFreeUser,
                                            () => setIsAnonymous(isAnonymous => !isAnonymous),
                                            PremiumUpgradeMessage
                                        )}>
                                    Anonymous
                                    {
                                        isFreeUser && <LockIcon/>
                                    }
                                </button>
                            </div>
                        </Box>
                    </Box>
                </Box>

                {importFile && (
                    <ImportTextComp
                        containerStyles={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                            cursor: "pointer",
                        }}
                        textInput={{
                            className: "ans-custom-quill",
                            theme: "snow",
                            modules: quillModules,
                            style: {
                                border: "none",
                                outline: "none",
                                height: "300px",
                                width: "100%",
                                overflowY: "auto",
                                backgroundColor: "white",
                                borderRadius: "15px",
                            },
                            placeholder: "Enter your document...",
                        }}
                        onCancel={() => {
                            setListCard([]);
                            setImportFile(false);
                        }}
                        onSave={() => {
                            setImportFile(false);
                        }}
                        onSaveButtonStyles={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#ffffff",
                            color: "#2c3e50",
                            fontSize: "18px",
                            fontWeight: "bold",
                            borderRadius: "30px",
                            height: "60px",
                            width: "100%",
                            border: "2px solid #dfe4ea",
                            cursor: "pointer",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                            transition: "all 0.3s ease",
                        }}
                        onTextChange={handleParseChangedImportText}
                    />
                )}

                <span
                    style={{width: "100%", height: "3px", backgroundColor: "#e2e2fe", borderRadius: "15px"}}></span>

                <h3><b>Add your terms</b></h3>

                {listCard.map((card, index) => (
                    <Box key={card.id} p={1} bgcolor="#e0e0fe" id={`cardData-${card.id}`}
                         tabIndex={-1}
                         sx={{
                             display: "flex",
                             flexDirection: "column",
                             width: "100%",
                             borderRadius: "15px",
                             gap: 2,
                         }}>
                        <Box sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            p: "10px"
                        }}>
                            <span>{index + 1}</span>
                            <Remove onClick={() => removeCard(card.id)}/>
                        </Box>

                        <Box sx={{
                            display: "flex",
                            flexDirection: {xs: "column", md: "row"},
                            gap: 2,
                            maxHeight: "500px",
                            overflowY: "auto"
                        }}>
                            <ReactQuill
                                theme="snow"
                                value={card.front || ""}
                                modules={quillModules}
                                className="ans-custom-react-quill"
                                style={{
                                    border: "none",
                                    outline: "none",
                                    height: "100%", width: "100%",
                                    overflowY: "auto",
                                    backgroundColor: "white",
                                    borderRadius: "15px",
                                }}
                                placeholder="Enter your question..."
                                onChange={(value) => handleWriteDataCard("front", value, card.id)}
                            />

                            <ReactQuill
                                theme="snow"
                                value={card.back || ""}
                                modules={quillModules}
                                className="ans-custom-react-quill"
                                style={{
                                    border: "none",
                                    outline: "none",
                                    height: "100%", width: "100%",
                                    overflowY: "auto",
                                    backgroundColor: "white",
                                    borderRadius: "15px"
                                }}
                                placeholder="Enter your answer..."
                                onChange={(value) => handleWriteDataCard("back", value, card.id)}
                            />

                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "10px",
                                width: "200px",
                                height: "100%"
                            }}>
                                <ImagePreview img={card.img} id={card.id}/>
                                <input
                                    type="file"
                                    id={`imageUpload-${card.id}`}
                                    accept="image/*"
                                    onClick={(e) => handlePremiumFilter(e,
                                        isFreeUser,
                                        () => {
                                        },
                                        PremiumUpgradeMessage
                                    )}
                                    onChange={(e) => handleImageUpload(e, card.id)}
                                    style={{display: "none"}}
                                />
                                <ImageToggleButton
                                    hasImage={card.img}
                                    onRemove={(e) => handlePremiumFilter(e,
                                        isFreeUser,
                                        () => handleImageRemove(card.id),
                                        PremiumUpgradeMessage
                                    )}
                                    onUpload={() => document.getElementById(`imageUpload-${card.id}`).click()}
                                    childComponent={!isFreeUser ? <></> : <LockIcon/>}
                                />
                            </div>
                        </Box>
                    </Box>
                ))}

                {
                    !importFile &&
                    <Box sx={{display: "flex", justifyContent: "center"}}>
                        <div style={{position: "relative"}}>
                            <Plus onClick={(e) => handlePremiumFilter(e,
                                listCard.length >= maxFlashcards,
                                addCard,
                                MaxFlashcardsMessage
                            )} style={{cursor: "pointer"}}/>
                            {
                                listCard.length >= maxFlashcards &&
                                <div style={{position: "absolute", top: -10, right: -10}}>
                                    <LockIcon/>
                                </div>
                            }
                        </div>
                    </Box>
                }

                <div style={{
                    position: "absolute",
                    zIndex: "5000",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0)",
                    display: isBlockPageByPremium ? "block" : "none",
                }}>
                    <button ref={blockPageBtn} style={{
                        width: "100%",
                        height: "100%",
                        background: "transparent",
                        border: "none"
                    }} onClick={(e) => handlePremiumFilter(
                        e,
                        true,
                        () => {
                        },
                        BlockMessage
                    )}>
                    </button>
                </div>
            </Box>

            {!isBlockPageByPremium && !importFile &&
                <button
                    style={{
                        position: "fixed",
                        bottom: "30px",
                        right: "50px",
                        border: "none",
                        backgroundColor: "#ededff",
                    }}
                    onClick={handleCreate}
                >
                    <CreateCardButton/>
                </button>
            }

            {/*<ToastContainer*/}
            {/*    autoClose={3000}*/}
            {/*    hideProgressBar={false}*/}
            {/*    newestOnTop={false}*/}
            {/*    closeOnClick*/}
            {/*    rtl={false}*/}
            {/*    pauseOnFocusLoss*/}
            {/*    draggable*/}
            {/*    pauseOnHover*/}
            {/*    theme="dark"*/}
            {/*/>*/}
        </>
    );
}

export default AddNewSet;
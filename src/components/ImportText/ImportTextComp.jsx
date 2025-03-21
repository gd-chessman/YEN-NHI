import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel, FormGroup,
    FormLabel,
    Radio,
    RadioGroup,
    TextField
} from "@mui/material";
import Cancel from "../../components/icon/Import.jsx";
import ReactQuill from "react-quill";
import {value} from "lodash/seq.js";
import {convertHtmlToText} from "src/utils/HtmlAndFileUtils.jsx";


const ImportTextComp = ({
                            onClick = () => {
                            },
                            onCancel = () => {
                            },
                            onSave = () => {
                            },
                            onTextChange = () => {
                            },
                            ...props
                        }) => {
    const [text, setText] = useState("");
    const [termSeparator, setTermSeparator] = useState("\t"); // Default: Tab
    const [cardSeparator, setCardSeparator] = useState("\n"); // Default: New Line
    const [termSepaInput, setTermSepaInput] = useState(""); // Custom input for term separator
    const [cardSepaInput, setCardSepaInput] = useState(""); // Custom input for card separator

    const [isTermSepaEditing, setIsTermSepaEditing] = useState(false);
    const [isCardSepaEditing, setIsCardSepaEditing] = useState(false);

    const [useMotipQA, setUseMotipQA] = useState(false);

    const [hasImage, setHasImage] = useState(false);

    const handleOnCancel = (event) => {
        event.preventDefault();
        onCancel();
    };

    const handleOnSave = (event) => {
        event.preventDefault();
        onSave();
    };

    const handleTextChange = (content) => {
        setText(content);
        onTextChange(convertHtmlToText(content), useMotipQA, termSeparator, cardSeparator, hasImage);
    };

    const handleTermSeparatorChange = (event) => {
        const value = event.target.value.replace(/\\n/g, "\n").replace(/\\t/g, "\t");
        setTermSeparator(value);
        onTextChange(convertHtmlToText(text), useMotipQA, value, cardSeparator, hasImage);
    };

    const handleCardSeparatorChange = (event) => {
        const value = event.target.value.replace(/\\n/g, "\n").replace(/\\t/g, "\t");
        setCardSeparator(value);
        onTextChange(convertHtmlToText(text), useMotipQA, termSeparator, value, hasImage);
    };

    const handleTermSepaInputChange = (event) => {
        const value = event.target.value.replace(/\\n/g, "\n").replace(/\\t/g, "\t");
        setTermSepaInput(event.target.value);
        setTermSeparator(value);
        onTextChange(convertHtmlToText(text), useMotipQA, value, cardSeparator, hasImage);
    };

    const handleCardSepaInputChange = (event) => {
        const value = event.target.value.replace(/\\n/g, "\n").replace(/\\t/g, "\t");
        setCardSepaInput(event.target.value);
        setCardSeparator(value);
        onTextChange(convertHtmlToText(text), useMotipQA, termSeparator, value, hasImage);
    };

    const handleUseMotipQAChange = (newValue) => {
        setUseMotipQA(newValue);
        onTextChange(convertHtmlToText(text), newValue, termSeparator, cardSeparator, hasImage);
    }

    const handleHasImageChange = (newValue) => {
        setHasImage(newValue);
        onTextChange(convertHtmlToText(text), useMotipQA, termSeparator, cardSeparator, newValue);
    };

    return (
        <>
            <Box sx={{...props.containerStyles}} gap={2}>
                <Cancel onClick={handleOnCancel}/>
                <ReactQuill onChange={handleTextChange}
                            value={text}
                            {...props.textInput} />
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Checkbox checked={useMotipQA}
                                      onChange={() => handleUseMotipQAChange(!useMotipQA)}
                            />
                        }
                        label="Use default Q & A Motip"/>
                </FormGroup>
                {
                    !useMotipQA &&
                    <>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                flexDirection: "row",
                                alignItems: "center",
                                padding: "20px",
                                borderRadius: "10px",
                                width: "100%",
                                '@media (max-width: 600px)': {
                                    flexDirection: 'column', // Flex column on small screens
                                },
                            }}
                        >
                            {/* Left Section */}
                            <Box>
                                <FormLabel sx={{fontSize: "16px", fontWeight: "bold"}}>
                                    Between term and definition
                                </FormLabel>
                                <RadioGroup
                                    onChange={handleTermSeparatorChange}
                                    defaultValue="\t"
                                >
                                    <FormControlLabel
                                        value="\t"
                                        control={<Radio sx={{color: "white"}}/>}
                                        label="Tab"
                                        checked={termSeparator === "\t" && !isTermSepaEditing}
                                        onClick={() => {
                                            setIsTermSepaEditing(false);
                                        }}
                                    />
                                    <FormControlLabel
                                        value=","
                                        control={<Radio sx={{color: "white"}}/>}
                                        label="Comma"
                                        checked={termSeparator === "," && !isTermSepaEditing}
                                        onClick={() => {
                                            setIsTermSepaEditing(false);
                                        }}
                                    />
                                    <Box sx={{display: "flex", alignItems: "center", mt: 1}}>
                                        <FormControlLabel
                                            value={termSepaInput}
                                            control={<Radio sx={{color: "white"}}/>}
                                            label=""
                                            checked={isTermSepaEditing}
                                            onClick={() => setIsTermSepaEditing(true)}
                                        />
                                        <TextField
                                            placeholder="-"
                                            value={termSepaInput}
                                            onChange={handleTermSepaInputChange}
                                            onClick={() => setIsTermSepaEditing(true)}
                                            sx={{
                                                backgroundColor: "white",
                                                borderRadius: "5px",
                                                width: "50px",
                                                ml: 1,
                                            }}
                                        />
                                    </Box>
                                </RadioGroup>
                            </Box>

                            {/* Right Section */}
                            <Box>
                                <FormLabel sx={{fontSize: "16px", fontWeight: "bold"}}>
                                    Between any cards
                                </FormLabel>
                                <RadioGroup
                                    onChange={handleCardSeparatorChange}
                                    defaultValue="\n"
                                >
                                    <FormControlLabel
                                        value="\n"
                                        control={<Radio sx={{color: "white"}}/>}
                                        label="New Line"
                                        checked={cardSeparator === "\n" && !isCardSepaEditing}
                                        onClick={() => {
                                            setIsCardSepaEditing(false);
                                        }}
                                    />
                                    <FormControlLabel
                                        value=";"
                                        control={<Radio sx={{color: "white"}}/>}
                                        label="Semicolon"
                                        checked={cardSeparator === ";" && !isCardSepaEditing}
                                        onClick={() => {
                                            setIsCardSepaEditing(false);
                                        }}
                                    />
                                    <Box sx={{display: "flex", alignItems: "center", mt: 1}}>
                                        <FormControlLabel
                                            value={cardSepaInput}
                                            control={<Radio sx={{color: "white"}}/>}
                                            label=""
                                            checked={isCardSepaEditing}
                                            onClick={() => setIsCardSepaEditing(true)}
                                        />
                                        <TextField
                                            placeholder="\\n\\n"
                                            value={cardSepaInput}
                                            onChange={handleCardSepaInputChange}
                                            onClick={() => setIsCardSepaEditing(true)}
                                            sx={{
                                                backgroundColor: "white",
                                                borderRadius: "5px",
                                                width: "100px",
                                                ml: 1,
                                            }}
                                        />
                                    </Box>
                                </RadioGroup>
                            </Box>
                        </Box>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={hasImage}
                                              onChange={() => handleHasImageChange(!hasImage)}
                                    />
                                }
                                label="Has Image"/>
                        </FormGroup>
                    </>
                }
                <Box p={1} width="100%">
                    <Button
                        onClick={handleOnSave}
                        sx={{
                            ...props.onSaveButtonStyles,
                        }}
                    >
                        Save
                    </Button>
                </Box>
            </Box>
        </>
    );
};

export default ImportTextComp;
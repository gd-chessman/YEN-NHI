import React, {useEffect, useRef, useState} from "react";
import {
    Box,
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton,
    Input,
    InputAdornment,
    ListItem, Tooltip,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import ParallelogramOverlay from "../../components/ParallelogramOverlay/ParallelogramOverlay.jsx";
import {Image} from "react-bootstrap";
import {BiPencil} from "react-icons/bi";
import {CheckCircle} from "@mui/icons-material";
import List from "@mui/material/List";
import {uploadToFirebase} from "../../utils/firebaseUtils.js";
import {storage} from "../../configs/firebaseConfig.js";
import {mapPlanByRole} from "src/roles/roles.js";
import ModalUpdateImage from "src/pages/profile/ModalUpdateImage.jsx";
import api from "src/apis/api.js";
import {toast} from "react-toastify";
import ModalOtpConfirm from "src/pages/profile/ModalOtpConfirm.jsx";


const UserProfile = () => {
    const theme = useTheme();
    const isChangeAvatarAbosuteDisplay = useMediaQuery(theme.breakpoints.up("sm"));

    const [avatar, setAvatar] = useState(null); // Blob

    const [openModalUpdateAvatar, setOpenModalUpdateAvatar] = useState(false);

    const [openModalConfirm, setOpenModalConfirm] = useState(false);

    const [retrySendOtpSecs, setRetrySendOtpSecs] = useState(0);

    const [openModalChangeEmail, setOpenModalChangeEmail] = useState(false);

    const [userInformation, setUserInformation] = useState({});

    const [editingUserInfo, setEditingUserInfo] = useState({});

    const [editingState, setEditingState] = useState({});

    const [analysisUser, setAnalysisUser] = useState({});

    const handleEditingUserInfoChange = (type, value) => {
        setEditingUserInfo((prev) => ({...prev, [type]: value}));
    };

    const handleAnalysisUserChange = (type, value) => {
        setAnalysisUser((prev) => ({...prev, [type]: value}));
    };

    const loadUserInfo = async () => {
        const resUserInfo = await api.get("/v1/auth/user-info");
        setUserInformation(resUserInfo.data);
        setEditingUserInfo(resUserInfo.data);
        // console.log(resUserInfo.data);
        localStorage.setItem("user", JSON.stringify(resUserInfo.data));
    };

    const loadAnalysisUser = async () => {

    };

    const isEditing = (stateName, currentData, editingData) => {
        return editingState[stateName] || currentData !== editingData;
    };

    const handleUpdateImage = async () => {
        try {
            const downloadUrl = await uploadToFirebase(storage, avatar, "images", null, null);
            await api.put("/v1/users/change-basic-information", {avatar: downloadUrl});
            toast.success("Update avatar successfully.");
            await loadUserInfo();
        } catch (err) {
            console.log(err);
            toast.error("Update avatar failed.");
        }
    };

    useEffect(() => {
        loadUserInfo().finally();
    }, []);

    return (
        <>
            {/* Container chính */}
            <Box className="h-full m-5 flex flex-col">
                {/* Phần header có overlay & avatar */}
                <Box className="w-full relative overflow-hidden h-[180px] md:h-[220px] min-h-[180px] md:min-h-[220px]">
                    <Box className="w-full h-[150px] m-0 relative overflow-hidden">
                        <Box className="absolute top-0 left-0 w-[1000px] h-[1000px]">
                            <ParallelogramOverlay/>
                        </Box>
                    </Box>

                    <Box
                        className="absolute top-[50px] left-1/2 w-[120px] md:w-[150px] h-[120px] md:h-[150px] border-4 border-white rounded-full overflow-hidden z-[100] transform -translate-x-1/2"
                    >

                        <Image
                            src={userInformation.avatar || "https://static.vecteezy.com/system/resources/previews/009/890/457/non_2x/user-icon-for-web-site-login-head-sign-icon-design-free-vector.jpg"}
                            width="100%"
                            height="100%"
                            className="w-full h-full object-cover"
                            roundedCircle
                        />
                    </Box>

                    {isChangeAvatarAbosuteDisplay && (
                        <Box
                            // Dùng tailwind active: để mô phỏng hiệu ứng scale & shadow thay vì onMouse*
                            className="absolute top-[100px] right-[50px] bg-[#E0E0FE] rounded-[27px] shadow-[0_0_8px_#BABEFD] z-[100] cursor-pointer active:scale-95 active:shadow-[0_0_5px_rgba(165,181,207,0.1)] transition-transform"
                            onClick={() => setOpenModalUpdateAvatar(true)}
                        >
                            <Box className="mx-[10px] text-base text-[#0E22E9] flex items-center">
                                <BiPencil className="mr-[10px]"/>
                                Change profile picture
                            </Box>
                        </Box>
                    )}
                </Box>

                {/* Phần nút thay đổi avatar khi màn hình nhỏ */}
                <Box className="mt-[0.2rem] w-full flex flex-col justify-center items-center">
                    {!isChangeAvatarAbosuteDisplay && (
                        <Box
                            className="bg-[#E0E0FE] rounded-[27px] shadow-[0_0_8px_#BABEFD] z-[100] cursor-pointer mb-[0.5rem] active:scale-95 active:shadow-[0_0_5px_rgba(165,181,207,0.1)] transition-transform"
                            onClick={() => setOpenModalUpdateAvatar(true)}
                        >
                            <Box className="mx-[10px] text-base text-[#0E22E9] flex items-center">
                                <BiPencil className="mr-[10px]"/>
                                Change profile picture
                            </Box>
                        </Box>
                    )}

                    {/* Tên người dùng và icon xác nhận */}
                    <Box className="w-full flex justify-center items-center text-[2rem] font-black">
                        {`${userInformation.firstname} ${userInformation.lastname}`}
                        <CheckCircle className="ml-[0.5rem] text-blue-500" sx={{fontSize: 30}}/>
                    </Box>

                    {/* Thống kê */}
                    <Box
                        className="flex flex-col sm:flex-row justify-center items-center text-[1.2rem] font-bold gap-[1rem]">
                        <Box className="rounded-[1.5rem] bg-[#E0E0FE] px-[1.2rem] py-[0.6rem]">
                            0 public sets
                        </Box>
                        <Box className="rounded-[1.5rem] bg-[#E0E0FE88] px-[1.2rem] py-[0.6rem]">
                            0 classes
                        </Box>
                        <Box className="rounded-[1.5rem] bg-[#E0E0FE] px-[1.2rem] py-[0.6rem]">
                            0 streak days
                        </Box>
                    </Box>
                </Box>

                <Button sx={{
                    fontSize: '16px',
                    color: 'red',
                    textTransform: 'none',
                    backgroundColor: 'blue',
                    margin: '2rem 0px'
                }}
                        onClick={() => {
                            setOpenModalConfirm(true);
                        }}
                >
                    Test
                </Button>

                {/* Account Information */}
                <Box className="text-[1.2rem] font-bold mt-4">Account information</Box>
                <Box className="flex flex-col w-full mt-2">
                    {/* Username */}
                    <Box className="flex flex-col md:flex-row w-full mb-2 gap-2">
                        <Box
                            className="rounded-[15px] sm:bg-[#E0E0FE] flex-shrink-0 basis-1/4 sm:flex block justify-center items-center text-base">
                            Username
                        </Box>
                        <Tooltip
                            title="You can't change the username after creating the account."
                            arrow
                            followCursor
                            componentsProps={{
                                tooltip: {
                                    sx: {
                                        fontSize: '1rem',
                                        backgroundColor: 'red',
                                    }
                                },
                                arrow: {
                                    sx: {
                                        color: 'red',
                                    },
                                },
                            }}
                        >
                            <Input
                                disableUnderline={true}
                                type="text"
                                disabled
                                className="bg-[#F8F8FF] rounded-[15px] p-[20px] outline-none w-full text-base"
                                value={userInformation.username}
                            />
                        </Tooltip>
                    </Box>

                    {/* Email */}
                    <Box className="flex flex-col md:flex-row w-full mb-2 gap-2">
                        <Box
                            className="rounded-[15px] sm:bg-[#E0E0FE] flex-shrink-0 basis-1/4 sm:flex block justify-center items-center text-base">
                            Email
                        </Box>
                        <Input
                            disableUnderline={true}
                            type="email"
                            disabled
                            value={userInformation.email}
                            placeholder="Enter your email"
                            className="bg-[#F8F8FF] rounded-[15px] p-[20px] outline-none w-full text-base "
                            sx={{
                                '& .MuiInputBase-input.Mui-disabled': {
                                    color: 'white', // Giữ màu chữ nguyên bản
                                    mixBlendMode: 'difference',
                                    opacity: 1, // Ngăn mờ đi
                                    WebkitTextFillColor: 'inherit', // Đảm bảo màu chữ không bị ảnh hưởng trên Webkit
                                },
                            }}
                            endAdornment={
                                <InputAdornment position="end">
                                    <Box
                                        className="flex items-center text-base text-[#0E22E9] bg-[#E0E0FE] rounded-[27px] shadow-[0_0_8px_#BABEFD] z-[100] cursor-pointer pl-[1.2rem] pr-[1.2rem] active:scale-95 active:shadow-[0_0_5px_rgba(165,181,207,0.1)] transition-transform">
                                        <BiPencil className="mr-[10px]"/>
                                        Edit
                                    </Box>
                                </InputAdornment>
                            }
                        />
                    </Box>

                    {/* Password */}
                    <Box className="flex flex-col md:flex-row w-full mb-2 gap-2">
                        <Box
                            className="rounded-[15px] sm:bg-[#E0E0FE] flex-shrink-0 basis-1/4 sm:flex block justify-center items-center text-base">
                            Password
                        </Box>
                        <Box className="relative w-full h-full">
                            <Input
                                disableUnderline={true}
                                type="password"
                                placeholder="Enter your password"
                                disabled
                                sx={{
                                    '& .MuiInputBase-input.Mui-disabled': {
                                        color: 'white', // Giữ màu chữ nguyên bản
                                        mixBlendMode: 'difference',
                                        opacity: 1, // Ngăn mờ đi
                                        WebkitTextFillColor: 'inherit', // Đảm bảo màu chữ không bị ảnh hưởng trên Webkit
                                    },
                                }}
                                value={userInformation.haspassword ? "******" : undefined}
                                className="bg-[#F8F8FF] rounded-[15px] p-[20px] outline-none w-full text-base "
                                endAdornment={
                                    <InputAdornment position="end">
                                        <Box
                                            className="flex items-center text-base text-[#0E22E9] bg-[#E0E0FE] rounded-[27px] shadow-[0_0_8px_#BABEFD] z-[100] cursor-pointer pl-[1.2rem] pr-[1.2rem] active:scale-95 active:shadow-[0_0_5px_rgba(165,181,207,0.1)] transition-transform">
                                            <BiPencil className="mr-[10px]"/>
                                            Change password
                                        </Box>
                                    </InputAdornment>
                                }
                            />
                        </Box>
                    </Box>
                </Box>

                {/* User Information */}
                <Box className="text-[1.2rem] font-bold mt-2">User information</Box>
                <Box className="flex flex-col w-full mt-2">
                    {/* First name */}
                    <Box className="flex flex-col md:flex-row w-full mb-2 gap-2">
                        <Box
                            className="rounded-[15px] sm:bg-[#E0E0FE] flex-shrink-0 basis-1/4 sm:flex block justify-center items-center text-base">
                            First name
                        </Box>
                        <Input
                            disableUnderline={true}
                            type="text"
                            placeholder="Enter your firstname"
                            className="bg-[#F8F8FF] rounded-[15px] p-[20px] outline-none w-full text-base "
                            endAdornment={
                                <InputAdornment position="end">
                                    <Box
                                        className="flex items-center text-base text-[#0E22E9] bg-[#E0E0FE] rounded-[27px] shadow-[0_0_8px_#BABEFD] z-[100] cursor-pointer pl-[1.2rem] pr-[1.2rem] active:scale-95 active:shadow-[0_0_5px_rgba(165,181,207,0.1)] transition-transform"
                                        onClick={() => {
                                        }}
                                    >
                                        <BiPencil className="mr-[10px]"/>
                                        Edit
                                    </Box>
                                </InputAdornment>
                            }
                        />
                    </Box>

                    {/* Last name */}
                    <Box className="flex flex-col md:flex-row w-full mb-2 gap-2">
                        <Box
                            className="rounded-[15px] sm:bg-[#E0E0FE] flex-shrink-0 basis-1/4 sm:flex block justify-center items-center text-base"
                            onClick={() => {
                            }}
                        >
                            Last name
                        </Box>
                        <Input
                            disableUnderline={true}
                            type="text"
                            placeholder="Enter your lastname"
                            className="bg-[#F8F8FF] rounded-[15px] p-[20px] outline-none w-full text-base "
                            endAdornment={
                                <InputAdornment position="end">
                                    <Box
                                        className="flex items-center text-base text-[#0E22E9] bg-[#E0E0FE] rounded-[27px] shadow-[0_0_8px_#BABEFD] z-[100] cursor-pointer pl-[1.2rem] pr-[1.2rem] active:scale-95 active:shadow-[0_0_5px_rgba(165,181,207,0.1)] transition-transform">
                                        <BiPencil className="mr-[10px]"/>
                                        Edit
                                    </Box>
                                </InputAdornment>
                            }
                        />
                    </Box>

                    {/* Gender */}
                    <Box className="flex flex-col md:flex-row w-full mb-2 gap-2">
                        <Box
                            className="rounded-[15px] sm:bg-[#E0E0FE] flex-shrink-0 basis-1/4 sm:flex block justify-center items-center text-base"
                        >
                            Gender
                        </Box>
                        <Input
                            disableUnderline={true}
                            type="checkbox"
                            className="bg-[#F8F8FF] rounded-[15px] p-[20px] outline-none w-full text-base"
                        />
                    </Box>

                    {/* Birthday */}
                    <Box className="flex flex-col md:flex-row w-full mb-2 gap-2">
                        <Box
                            className="rounded-[15px] sm:bg-[#E0E0FE] flex-shrink-0 basis-1/4 sm:flex block justify-center items-center text-base">
                            Birthday
                        </Box>
                        <Input
                            disableUnderline={true}
                            type="date"
                            className="bg-[#F8F8FF] rounded-[15px] p-[20px] outline-none w-full text-base"
                        />
                    </Box>

                    {/* Phone number */}
                    <Box className="flex flex-col md:flex-row w-full mb-2 gap-2">
                        <Box
                            className="rounded-[15px] sm:bg-[#E0E0FE] flex-shrink-0 basis-1/4 sm:flex block justify-center items-center text-base">
                            Phone number
                        </Box>
                        <Input
                            disableUnderline={true}
                            type="tel"
                            placeholder="Enter your phone number"
                            className="bg-[#F8F8FF] rounded-[15px] p-[20px] outline-none w-full text-base "
                            endAdornment={
                                <InputAdornment position="end">
                                    <Box
                                        className="flex items-center text-base text-[#0E22E9] bg-[#E0E0FE] rounded-[27px] shadow-[0_0_8px_#BABEFD] z-[100] cursor-pointer pl-[1.2rem] pr-[1.2rem] active:scale-95 active:shadow-[0_0_5px_rgba(165,181,207,0.1)] transition-transform"
                                        onClick={() => {
                                        }}
                                    >
                                        <BiPencil className="mr-[10px]"/>
                                        Edit
                                    </Box>
                                </InputAdornment>
                            }
                        />
                    </Box>

                    {/* Subscription */}
                    <Box className="flex flex-col md:flex-row w-full mb-2 gap-2">
                        <Box
                            className="rounded-[15px] sm:bg-[#E0E0FE] flex-shrink-0 basis-1/4 sm:flex block justify-center items-center text-base">
                            Subscription
                        </Box>
                        <Input
                            disableUnderline={true}
                            type="text"
                            readOnly
                            className="bg-[#F8F8FF] rounded-[15px] p-[20px] outline-none w-full text-base "
                            endAdornment={
                                <InputAdornment position="end">
                                    <Box
                                        className="flex items-center text-base text-[#0E22E9] bg-[#E0E0FE] rounded-[27px] shadow-[0_0_8px_#BABEFD] z-[100] cursor-pointer pl-[1.2rem] pr-[1.2rem] active:scale-95 active:shadow-[0_0_5px_rgba(165,181,207,0.1)] transition-transform">
                                        <BiPencil className="mr-[10px]"/>
                                        Choose other plans
                                    </Box>
                                </InputAdornment>
                            }
                        />
                    </Box>
                </Box>

                {/*/!* Payment Information *!/*/}
                {/*<Box className="text-[1.2rem] font-bold mt-2">Payment information</Box>*/}
                {/*<Box className="text-[1.2rem] font-bold mt-2 w-full text-center">*/}
                {/*    /!*Manage by Strip*!/*/}
                {/*    /!*<Elements*!/*/}
                {/*    /!*    stripe={stripePromise}*!/*/}
                {/*    /!*    options={{ clientSecret: "pi_3QbCheIGukEbv88M0Fco6apO" }}*!/*/}
                {/*    /!*>*!/*/}
                {/*    /!*    <PaymentElement id="payment-element" />*!/*/}
                {/*    /!*</Elements>*!/*/}
                {/*</Box>*/}

                <Box className="text-[1.2rem] font-bold mt-2 text-red-500">
                    Danger Zone
                </Box>

                <List className="rounded-[10px] border-2 border-red-500 max-w-full mt-[0.8rem]">
                    <ListItem className="p-[1.4rem] flex flex-col sm:flex-row flex-wrap items-center gap-2">
                        <Box className="text-[1.2rem] flex-1 whitespace-normal break-words flex flex-col">
                            <Box>Delete this account</Box>
                            <Box className="font-normal text-base">
                                Once you delete this account, there is no going back. Please be certain.
                            </Box>
                            <Box className="font-normal text-sm italic">
                                This action can take more time to complete.
                            </Box>
                        </Box>

                        <Button
                            sx={{
                                fontSize: "1rem",
                                fontFamily: "inherit",
                                border: "2px solid red",
                                color: "red",
                                borderRadius: "0.5rem",
                                textTransform: "none", // Ngăn viết hoa tự động
                            }}
                        >
                            Delete this account
                        </Button>
                    </ListItem>
                </List>
            </Box>

            <ModalUpdateImage
                isOpening={openModalUpdateAvatar}
                setIsOpening={setOpenModalUpdateAvatar}
                imagePreview={avatar}
                onAvatarChange={(data) => setAvatar(data)}
                onUserAgree={() => {
                    handleUpdateImage().then().catch();
                }}
            />

            <ModalOtpConfirm
                isOpening={openModalConfirm}
                setIsOpening={setOpenModalConfirm}
                retrySendEmailSecs={retrySendOtpSecs}
                setRetrySendEmailSecs={setRetrySendOtpSecs}
            />
        </>
    );
};

export default UserProfile;
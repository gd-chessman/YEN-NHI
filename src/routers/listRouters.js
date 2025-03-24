import FreeView from "../pages/free-user/FreeView";
import FreeStudy from "../pages/free-user/FreeStudy";
import NotFound from "../components/NotFound.jsx";
import {Dashboard} from "../scenes/index.js";
import MyFlashcard from "../scenes/my-flashcard/MyFlashcard";
import Arena from "../components/Arena.jsx";
import CardDeadline from "../components/DeadlineCard/CardDeadline.jsx";
import AddNewSet from "../pages/add-new-set/AddNewSet.jsx";
import ViewSet from "../scenes/view-detail-set/ViewSet.jsx";
import FlashcardTest from "src/components/FlashcardTest/FlashcardTest.jsx";
import DetailFolder from "src/pages/detail-folder/DetailFolder.jsx";
import UpdateSet from "src/pages/update-set/UpdateSet.jsx";
import SetupTest from "src/pages/setup-test/SetupTest.js";
import LobbyRoom from "src/components/kn-arena/pages/LobbyRoom.jsx";
import CountDown from "src/components/kn-arena/pages/CountDown.jsx";
import ChooseAnswer from "src/components/kn-arena/pages/ChooseAnswer.jsx";
import Ranking from "src/components/kn-arena/pages/Ranking.jsx";
import FinalRanking from "src/components/kn-arena/pages/FinalRanking.jsx";
import Podium from "src/components/kn-arena/pages/Podium.jsx";
import BackgroundArea from "src/components/kn-arena/background/background-area.jsx";
import RoomCode from "src/pages/kn-arena/RoomCode.jsx";
import KickOff from "src/pages/kn-arena/KickOff.jsx";
import {LobbyProvider} from "src/context/LobbyContext.jsx";
import RoomGame from "src/pages/kn-arena/RoomGame.jsx";
import UserManagement from "src/pages/admin/user/UserManagement.jsx";
import DashboardAdmin from "src/pages/admin/dashboard-admin/DashboardAdmin.jsx";
import CategorySetManagement from "src/pages/admin/set-categories/CategorySetManagement.jsx";
import SetManagement from "src/pages/admin/set-flashcard/SetFlashcard.jsx";
import ViewSetGuess from "src/scenes/view-detail-set-card-guess/ViewSetGuess.jsx";
import DetailListSet from "../pages/detail-list-set/DetailListSet.jsx";
import UserProfile from "../pages/profile/UserProfile.jsx";
import {Route} from "react-router-dom";
import SignUp from "../scenes/register/SignUp.jsx";
import Login from "../scenes/login/Login.jsx";
import Matching from "../pages/matching/index.jsx";

export const guestRoutes = [
    {
        path: '/',
        component: <FreeView/>,
    },
    // {
    //     path: '/guest-study',
    //     component: <FreeStudy/>,
    // },
    {
        path: 'set/detail/:id',
        component: <ViewSetGuess/>,
    },
    {
        path: '/register',
        component: <SignUp/>,
    },
    {
        path: '/login',
        component: <Login/>,
    },
    {
        path: '*',
        component: <NotFound/>,
    },
];

export const userRoutes = [
    {
        path: '',
        component: <Dashboard/>,
        private: true,
    },
    {
        path: 'flashcard',
        component: <MyFlashcard/>,
        private: true,
    },
    {
        path: 'arena',
        component: <Arena/>,
        private: true,
    },
    {
        path: 'deadline',
        component: <CardDeadline/>,
        private: true,
    },
    {
        path: 'create',
        component: <AddNewSet/>,
        private: true,
    },
    {
        path: 'set/detail/:id',
        component: <ViewSet/>,
        private: true,
    },
    {
        path: 'set/update/:id',
        component: <UpdateSet/>,
        private: true,
    },
    {
        path: 'set/:id/details',
        component: <FlashcardTest/>,
        private: true,
    },
    {
        path: 'folder/:id',
        component: <DetailFolder/>,
        private: true,
    },
    {
        path: 'detail-list-set',
        component: <DetailListSet/>,
        private: true,
    },
    {
        path: "set-up-test",
        component: <SetupTest/>,
        private: true,
    },
    {
        path: "set-up-test/:id",
        component: <SetupTest/>,
        private: true,
    },
    {
        path: "profile",
        component: <UserProfile/>,
        private: true,
    },
    {
        path: '*',
        component: <NotFound/>,
    },
];

export const arenaRoutes = [
    {
        path: '',
        component: <KickOff/>,
        private: true,
    },
    {
        path: 'room-code',
        component: <RoomCode/>,
        private: true,
    },
    {
        path: 'lobby-room/:id',
        component: <LobbyRoom/>,
        private: true,
    },
    {
        path: 'room-game/:id',
        component: <RoomGame/>,
        private: true,
    },
    {
        path: 'count-down',
        component: <CountDown/>,
        private: true,
    },
    {
        path: 'choose-answer',
        component: <ChooseAnswer/>,
        private: true,
    },
    {
        path: 'ranking',
        component: <Ranking/>,
        private: true,
    },
    {
        path: 'final-ranking',
        component: <FinalRanking/>,
        private: true,
    },
    {
        path: 'podium',
        component: <Podium/>,
        private: true,
    },
    {
        path: '*',
        component: <NotFound/>,
    },
];

export const matchingRoutes = [
    {
        path: '',
        component: <Matching/>,
        private: true,
    },
];

export const adminRoutes = [
    {
        path: "",
        component: <DashboardAdmin/>,
        private: true,
    },
    {
        path: "dashboard",
        component: <DashboardAdmin/>,
        private: true,
    },
    {
        path: "user-management",
        component: <UserManagement/>,
        private: true,
    },
    {
        path: "category-set-management",
        component: <CategorySetManagement/>,
        private: true,
    },
    {
        path: "set-management",
        component: <SetManagement/>,
        private: true,
    },
]
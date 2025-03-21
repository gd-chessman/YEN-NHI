import React from 'react';
import "./index.css";  // Đảm bảo import đúng CSS
import SvgContentLogin from "../background/ContentLogin.jsx";
import Quizcard from "../background/Quizcard.jsx";

const ImgBackgroundLogin = () => {
    return (
        <div className="image-container">
            <div className="svg-content">
                <SvgContentLogin />
            </div>
            <img src="src/assets/images/background_login.png" alt="Background Login" />
            <div className="quizcard-content">
                <Quizcard />
            </div>
        </div>
    );
};

export default ImgBackgroundLogin;

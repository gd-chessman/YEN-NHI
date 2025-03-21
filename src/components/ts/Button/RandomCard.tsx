// @ts-ignore
import React from "react";

interface RandomCardProps {
    svgSize?: number;
    buttonSize?: number;
    onClick: () => void;
}

const RandomCard: React.FC<RandomCardProps> = ({ svgSize = 24, buttonSize = 50, onClick }) => {
    return (
        <div
            className="button-control"
            onClick={onClick}
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderBottom: "5px solid #e0e0fe",
                backgroundColor: "white",
                width: `${buttonSize}px`,
                height: `${buttonSize}px`,
                borderRadius: "15px",
                cursor: "pointer",
            }}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width={svgSize}
                height={svgSize}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="icon icon-tabler icons-tabler-outline icon-tabler-shuffle"
            >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M18 4l3 3l-3 3"/>
                <path d="M18 20l3 -3l-3 -3"/>
                <path d="M3 7h3a5 5 0 0 1 5 5a5 5 0 0 0 5 5h5"/>
                <path d="M21 7h-5a5 5 0 0 0 -5 5a5 5 0 0 1 -5 5h-3"/>
            </svg>
        </div>
    );
};

export default RandomCard;

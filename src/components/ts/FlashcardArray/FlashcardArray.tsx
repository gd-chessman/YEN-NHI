import React, {useCallback, useEffect, useState} from "react";
import FlashcardArrayProps from "../../../interfaces/IFlashcardArray";
import Flashcard from "../Flashcard/Flashcard";
import "./FlashcardArray.scss";
import Previous from "../Button/Previous";
import Recall from "../Button/Recall";
import Minimize from "../Button/Minimize";
import Remember from "../Button/Remember";
import Reset from "../Button/Reset";
import Return from "../Button/Return";
import Maximize from "../Button/Maximize";
import Next from "../Button/Next";
import ShowCount from "../ShowCount/ShowCount";
import Progress from "../ProgressStudy/Progress";
import {Link, useNavigate} from "react-router-dom";
import RandomCard from "../Button/RandomCard";
import {shuffleArrayFromIndex} from "../../../utils/shuffleArrayFromIndex.jsx";
import Share from "../Button/Share";
import PencelEdit from "../Button/PencilEdit";
import DeleteSet from "../Button/DeleteSet";


function FlashcardArray({
                            cards,
                            onCardChange = () => {
                            },
                            onCardFlip = () => {
                            },
                            frontCardStyle = {},
                            frontContentStyle = {},
                            backCardStyle = {},
                            backContentStyle = {},
                            forwardRef = {current: null},
                            FlashcardArrayStyle = {},
                            currentCardFlipRef,
                            cycle = false,
                            onStudy = false,
                            minimize = () => {
                            },
                            maximize = () => {
                            },
                            onProgressStudy = () => {
                            },
                            onUpdateCards = () => {
                            },
                            onSound = () => {
                            },
                            showCount = true,
                            styleProgress,
                            heightCard,
                            canEdit = false,
                            canDelete = false,
                            canFavorite = false,
                            flipped = false,
                            cardIndex,
                            onChangedMark = (index, marked) => {
                            },
                            onCardStatusChange = (idCard, statusProgress) => {
                            },
                            onRandom = () => {
                            },
                            onResetCard = () => {
                            },
                            share = () => {
                            },
                            setId = null,
                            onDeleteSet = () => {
                            },
                        }: FlashcardArrayProps) {
    const navigate = useNavigate();

    const [cardNumber, setCardNumber] = useState(0);
    const [numberRecall, setNumberRecall] = useState(0);
    const [numberRemember, setNumberRemember] = useState(0);

    const [updateCards, setUpdateCards] = useState(
        cards.map((card) => ({...card, mark: card.mark})) // Khởi tạo mark cho từng thẻ
    );

    const [cardsInDisplay, setCardsInDisplay] = useState(
        !cycle ? [-1, 0, 1] : [cards.length - 1, 0, 1]
    );
    const [isOverFlow, setIsOverFlow] = useState("");

    const placeFillerCard = (
        <Flashcard
            className="FlashcardArrayWrapper__empty"
            width="100%"
            backHTML=""
            frontHTML=""
        />
    );

    const cardsList = updateCards.map((card, index) => (
        <Flashcard
            key={index}
            frontHTML={card.frontHTML}
            backHTML={card.backHTML}
            manualFlipRef={cardNumber === index ? currentCardFlipRef : {current: null}}
            frontCardStyle={{...card.frontCardStyle, ...frontCardStyle}}
            frontContentStyle={{...card.frontContentStyle, ...frontContentStyle}}
            backCardStyle={{...card.backCardStyle, ...backCardStyle}}
            backContentStyle={{...card.backContentStyle, ...backContentStyle}}
            className={card.className}
            height={heightCard || card.height || "100%"}
            width={card.width || "100%"}
            style={card.style}
            onCardFlip={(state) => {
                onCardFlip(card.id, index, state);
                setIsOverFlow("hidden");
                setTimeout(() => {
                    setIsOverFlow("");
                }, 3);
            }}
            onMarkChange={(marked) => handleMarkChange(card.id, marked)}
            isMarked={card.mark} // cập nhập mark cho phần tử flashcard khi mảng card có giá trị mới
            onSaveEdit={(front: string | JSX.Element, back: string | JSX.Element) => handleSaveEdit(card.id, front, back)}
            onSound={(content: string) => onSound(content)} // sử dụng htmlToText sẽ ho trợ đổi html sang string thuần
            img={card.img}
            canEdit={canEdit}
            canFavorite={canFavorite}
            flipped={flipped}
        />
    ));

    const handleSaveEdit = (id: number, front: string | JSX.Element, back: string | JSX.Element) => {
        setUpdateCards((prevCards) => (
            prevCards.map((card) =>
                card.id === id ? {...card, frontHTML: front, backHTML: back} : card
            )
        ))
    }

    const numberOfCards =
        cardsList.length !== undefined ? cardsList.length - 1 : 0;

    const resetArray = () => {
        setCardsInDisplay(!cycle ? [-1, 0, 1] : [cards.length - 1, 0, 1]);
        setCardNumber(0);
        onResetCard();
    };

    const nextCard = useCallback(() => {
        const currentCardNumber =
            cardNumber + 1 < numberOfCards ? cardNumber + 1 : numberOfCards;

        if (currentCardNumber < numberOfCards) {
            setIsOverFlow("hidden");
            setTimeout(() => {
                setIsOverFlow("");
            }, 90);
        }
        if (cycle) {
            setCardsInDisplay((prevState) => {
                setCardNumber(prevState[1] + 1 < cards.length ? prevState[1] + 1 : 0);
                return [
                    prevState[0] + 1 < cards.length ? prevState[0] + 1 : 0,
                    prevState[1] + 1 < cards.length ? prevState[1] + 1 : 0,
                    prevState[2] + 1 < cards.length ? prevState[2] + 1 : 0,
                ];
            });
        } else {
            setCardNumber(currentCardNumber);
            setCardsInDisplay(
                currentCardNumber < numberOfCards
                    ? [currentCardNumber - 1, currentCardNumber, currentCardNumber + 1]
                    : [numberOfCards - 1, numberOfCards, -1]
            );
        }

        onCardChange(cards[currentCardNumber].id, currentCardNumber + 1);
    }, [cardNumber, cycle, numberOfCards]);

    const prevCard = useCallback(() => {
        const currentCardNumber = cardNumber - 1 >= 0 ? cardNumber - 1 : 0;

        if (currentCardNumber !== 0) {
            setIsOverFlow("hidden");
            setTimeout(() => {
                setIsOverFlow("");
            }, 90);
        }

        if (cycle) {
            setCardsInDisplay((prevState) => {
                const activeCard =
                    prevState[1] - 1 < 0 ? cards.length - 1 : prevState[1] - 1;

                setCardNumber(
                    prevState[1] - 1 >= 0 ? prevState[1] - 1 : cards.length - 1
                );

                return [
                    activeCard - 1 < 0 ? cards.length - 1 : activeCard - 1,
                    activeCard,
                    activeCard + 1 < cards.length ? activeCard + 1 : 0,
                ];
            });
        } else {
            setCardNumber(currentCardNumber);
            setCardsInDisplay(
                currentCardNumber === 0
                    ? [-1, 0, 1]
                    : [currentCardNumber - 1, currentCardNumber, currentCardNumber + 1]
            );
        }
        onCardChange(cards[currentCardNumber].id, currentCardNumber + 1);
    }, [cardNumber, cycle, numberOfCards]);

    useEffect(() => {
        if (forwardRef.current) {
            forwardRef.current.nextCard = nextCard;
            forwardRef.current.prevCard = prevCard;
            forwardRef.current.resetArray = resetArray;
        }
    });
    const handleMarkChange = (index: number, marked: boolean) => {
        setUpdateCards((prevCards) =>
            prevCards.map((card) =>
                card.id === index ? {...card, mark: marked} : card
            )
        );
        onUpdateCards(updateCards);
        onChangedMark(index, marked);
    };
    useEffect(() => {
        onUpdateCards(updateCards);
    }, [updateCards]);
    const handleRecall = () => {
        const currentCardIndex = cardNumber;
        const currentCard = updateCards[currentCardIndex];
        const isRemembered = currentCard.isRemembered;

        if (isRemembered !== false) {
            const updatedCard = {...currentCard, isRemembered: false};
            setUpdateCards((prevCards) =>
                prevCards.map((card, index) =>
                    index === currentCardIndex ? updatedCard : card
                )
            );
            setNumberRecall((prev) => prev + 1);
            if (isRemembered === true && numberRemember > 0) {
                setNumberRemember((prev) => prev - 1);
            }
            onCardStatusChange(currentCard.id, false);
        }

        nextCard();
    };

    const handleRemember = () => {
        const currentCardIndex = cardNumber;
        const currentCard = updateCards[currentCardIndex]; // Use the updated cards array
        const isRemembered = currentCard.isRemembered;

        if (isRemembered !== true) {
            const updatedCard = {...currentCard, isRemembered: true};
            setUpdateCards((prevCards) =>
                prevCards.map((card, index) =>
                    index === currentCardIndex ? updatedCard : card
                )
            );
            setNumberRemember((prev) => prev + 1);
            if (isRemembered === false && numberRecall > 0) {
                setNumberRecall((prev) => prev - 1);
            }
            onCardStatusChange(currentCard.id, true);
        }

        nextCard();
    };

    useEffect(() => {
        onProgressStudy(numberRemember, numberRecall);
    }, [numberRecall, numberRemember]);

    useEffect(() => {
        setUpdateCards(
            cards.map((card) => ({...card, mark: card.mark})) // Khởi tạo mark cho từng thẻ
        );
    }, [cards]);


    useEffect(() => {
        if (!onStudy && cardIndex) {
            const activeIndex = updateCards.length - 1 < cardIndex ? updateCards.length - 1 :
                cardIndex < 0 ? 0 : cardIndex;
            setCardNumber(activeIndex);
            setCardsInDisplay(
                cycle ?
                    [activeIndex - 1 >= 0 ? activeIndex - 1 : updateCards.length - 1,
                        activeIndex,
                        activeIndex + 1 < updateCards.length ? activeIndex + 1 : 0,] :
                    [activeIndex - 1, activeIndex,
                        activeIndex + 1 < updateCards.length - 1 ? activeIndex + 1 : -1,]
            );
        }
    }, [cardIndex]);

    const handleShuffleCards = () => {
        const cardsShuffled = shuffleArrayFromIndex(updateCards, cardNumber);
        setUpdateCards(cardsShuffled);
        onRandom();
    };

    const handleMoveToEdit = () => {
        if (setId !== null) {
            navigate(`/user/set/update/${setId}`);
        }
    };
    return (
        <div className="FlashcardArrayWrapper" style={FlashcardArrayStyle}>
            {/*{*/}
            {/*    onStudy &&*/}
            {/*    <Progress totalRecall={numberRecall} totalRemember={numberRemember} styleProgress={styleProgress}/>*/}
            {/*}*/}
            <div
                className="FlashcardArrayWrapper__CardHolder"
                style={{overflow: isOverFlow, height: "fit-content"}}
            >
                {cardsInDisplay[0] !== -1
                    ? cardsList[cardsInDisplay[0]]
                    : placeFillerCard}
                {cardsList[cardsInDisplay[1]]}
                {cardsInDisplay[2] !== -1
                    ? cardsList[cardsInDisplay[2]]
                    : placeFillerCard}
            </div>
            {(onStudy) && (
                <div className="FlashcardArrayWrapper__controls">
                    <Previous onClick={prevCard}/>
                    <span style={{color: "#babefd"}}>Pre </span>
                    <Recall onClick={handleRecall}/>
                    {
                        showCount &&
                        <ShowCount currentPage={cardNumber + 1} totalPages={cardsList.length}/>
                    }

                    <RandomCard onClick={handleShuffleCards}/>
                    <Minimize onClick={minimize}/>
                    <Remember onClick={handleRemember}/>
                    <Reset onClick={resetArray}/>
                </div>
            )}
            {
                !onStudy && (
                    <div className="FlashcardArrayWrapper__controls">
                        <Maximize onClick={maximize}/>
                        <Return onClick={prevCard}/>

                        {
                            showCount &&
                            <ShowCount currentPage={cardNumber + 1} totalPages={cardsList.length}/>
                        }
                        {
                            canEdit &&
                            <PencelEdit onClick={handleMoveToEdit} />
                        }
                        <Next onClick={nextCard}/>
                        <Reset onClick={resetArray}/>
                        <Share onClick={share}/>
                        {
                            canDelete && <DeleteSet onClick={onDeleteSet}/>
                        }
                    </div>
                )
            }

        </div>
    );
}

export default FlashcardArray;

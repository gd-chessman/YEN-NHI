"use client"

import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import api from "../../apis/api"

export default function Matching() {
  const [data, setData] = useState([])
  const [searchParams] = useSearchParams()
  const [currentRound, setCurrentRound] = useState("ROUND_1")
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isGameCompleted, setIsGameCompleted] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [shuffledAnswers, setShuffledAnswers] = useState([])
  const [incorrectPair, setIncorrectPair] = useState({ question: null, answer: null })
  const navigate = useNavigate()
  const setId = searchParams.get("setId")
  const newMatching = searchParams.get("new")

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (newMatching == 1) {
          await api.post(`/v1/matching/${setId}`)
          const newParams = new URLSearchParams(searchParams)
          newParams.delete("new")
          navigate(`?${newParams.toString()}`, { replace: true })
        }
        const response = await api.get(`/v1/matching`)
        setData(response.data)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  // Group data by round
  const groupedByRound = data.reduce((acc, item) => {
    const round = item.roundNumber
    if (!acc[round]) {
      acc[round] = []
    }
    acc[round].push(item)
    return acc
  }, {})

  // Shuffle answers when round changes or data loads
  useEffect(() => {
    if (groupedByRound[currentRound] && groupedByRound[currentRound].length > 0) {
      // Only shuffle if we haven't already or if the round changed
      if (shuffledAnswers.length === 0 || shuffledAnswers.length !== groupedByRound[currentRound].length) {
        // Create a shuffled array of indices
        const indices = [...Array(groupedByRound[currentRound].length).keys()]
        // Fisher-Yates shuffle algorithm
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[indices[i], indices[j]] = [indices[j], indices[i]]
        }
        setShuffledAnswers(indices)
      }
    }
  }, [currentRound, groupedByRound, shuffledAnswers.length])

  // Check round completion and progress
  useEffect(() => {
    if (groupedByRound[currentRound]) {
      const isRoundCompleted = groupedByRound[currentRound].every((item) => item.isCorrect)

      if (isRoundCompleted) {
        const rounds = Object.keys(groupedByRound)
        const currentRoundIndex = rounds.indexOf(currentRound)

        if (currentRoundIndex < rounds.length - 1) {
          // Move to next round and reset progress
          setCurrentRound(rounds[currentRoundIndex + 1])
          setSelectedQuestion(null)
          setSelectedAnswer(null)
        } else {
          // All rounds completed
          setIsGameCompleted(true)
        }
      }
    }
  }, [data, currentRound, groupedByRound])

  // Check if selected question and answer form a pair
  useEffect(() => {
    if (selectedQuestion !== null && selectedAnswer !== null) {
      const questionItem = groupedByRound?.[currentRound]?.[selectedQuestion]
      // Get the actual item from the shuffled index
      const actualAnswerIndex = shuffledAnswers[selectedAnswer]
      const answerItem = groupedByRound?.[currentRound]?.[actualAnswerIndex]

      if (questionItem && answerItem && questionItem.flashcard.answer === answerItem.flashcard.answer) {
        // Correct match
        setCorrectAnswers(questionItem.matchingId)
        // Update the data to mark items as correct
        setData((prevData) =>
          prevData.map((item) => {
            if (item.matchingId === questionItem.matchingId || item.matchingId === answerItem.matchingId) {
              return { ...item, isCorrect: true }
            }
            return item
          }),
        )
      } else {
        // Incorrect match - set the incorrect pair
        setIncorrectPair({ question: selectedQuestion, answer: selectedAnswer })

        // Reset incorrect pair after 0.5 seconds
        setTimeout(() => {
          setIncorrectPair({ question: null, answer: null })
        }, 500)
      }

      // Reset selections after a short delay
      setTimeout(() => {
        setSelectedQuestion(null)
        setSelectedAnswer(null)
      }, 500)
    }
  }, [selectedQuestion, selectedAnswer, groupedByRound, currentRound, shuffledAnswers])

  useEffect(() => {
    if (correctAnswers !== 0) {
      const fetchData = async () => {
        try {
          await api.put(`/v1/matching/${correctAnswers}`)
        } catch (error) {
          console.error("Error fetching data:", error)
        }
      }

      fetchData()
    }
  }, [correctAnswers])

  // Round selection component
  const RoundSelector = () => {
    const rounds = Object.keys(groupedByRound)
    return (
      <div className="w-11/12 relative flex items-center h-6 px-3 py-2 bg-[#e0e0fe] rounded-3xl mx-auto text-center font-semibold">
        {rounds.map((round, index) => (
          <div
            key={round}
            className={`absolute ${
              index === 0 ? "left-1/3" : index === 1 ? "left-2/3" : "right-0"
            } bg-[#c4b5fd] text-white rounded-full size-10 flex items-center justify-center cursor-pointer ${
              currentRound === round ? "bg-violet-700" : ""
            }`}
            onClick={() => setCurrentRound(round)}
          >
            {index + 1}
          </div>
        ))}
      </div>
    )
  }

  // Render completion modal
  const CompletionModal = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-100">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center">
          <h2 className="text-2xl font-bold text-violet-700 mb-4">Congratulations!</h2>
          <p className="text-lg mb-6">You have successfully completed all rounds of the matching game.</p>
          <button
            className="bg-violet-600 text-white px-6 py-2 rounded-lg hover:bg-violet-700 transition"
            onClick={() => {
              navigate(-1) // Go back to previous page
            }}
          >
            Finish
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {isGameCompleted && <CompletionModal />}
      <header className="w-full fixed z-50 top-0 h-[4.8125rem] bg-[#ededff] shadow-[0px_10px_60px_0px_rgba(0,0,0,0.15)]" />
      <main className="bg-[#ededff] h-svh mt-16 py-16">
        <RoundSelector />

        <div className="grid grid-cols-2 gap-4 w-11/12 mx-auto mt-12">
          {/* Column 1 - Questions */}
          <div className="flex flex-col gap-4">
            {groupedByRound?.[currentRound]?.map((item, index) => (
              <QuestionItem
                key={item.matchingId}
                item={item}
                index={index}
                isSelected={selectedQuestion === index}
                isMatched={item.isCorrect}
                isIncorrect={incorrectPair.question === index}
                onSelect={() => {
                  if (!item.isCorrect) {
                    setSelectedQuestion(index)
                  }
                }}
              />
            ))}
          </div>

          {/* Column 2 - Answers (Shuffled) */}
          <div className="flex flex-col gap-4">
            {shuffledAnswers.map((originalIndex, shuffledIndex) => {
              const item = groupedByRound?.[currentRound]?.[originalIndex]
              return item ? (
                <AnswerItem
                  key={item.matchingId}
                  item={item}
                  index={shuffledIndex}
                  isSelected={selectedAnswer === shuffledIndex}
                  isMatched={item.isCorrect}
                  isIncorrect={incorrectPair.answer === shuffledIndex}
                  onSelect={() => {
                    if (!item.isCorrect) {
                      setSelectedAnswer(shuffledIndex)
                    }
                  }}
                />
              ) : null
            })}
          </div>
        </div>
      </main>
    </>
  )
}

// Component for Question
function QuestionItem({ item, index, isSelected, isMatched, isIncorrect, onSelect }) {
  return (
    <div
      className={`flex gap-2 cursor-pointer transition-all duration-300 rounded-full
                ${isMatched ? "opacity-20 pointer-events-none" : ""}
                ${isIncorrect ? "bg-red-200" : isSelected ? "bg-violet-200 scale-[1.02]" : "hover:bg-violet-50"}`}
      onClick={onSelect}
    >
      <span
        className={`w-20 h-16 flex items-center rounded-2xl shadow-[0px_3px_0px_0px_rgba(186,190,253,1.00)] border-2 
                ${
                  isIncorrect
                    ? "bg-red-500 text-white border-red-600"
                    : isSelected
                      ? "bg-violet-500 text-white border-violet-600"
                      : "bg-indigo-100 text-violet-300 border-violet-300"
                } 
                text-center justify-center text-3xl font-bold`}
      >
        {index + 1}
      </span>
      <div
        className={`w-full flex items-center px-4 h-16 rounded-2xl shadow-md border-2 
                ${
                  isIncorrect
                    ? "bg-red-100 border-red-500"
                    : isSelected
                      ? "bg-violet-100 border-violet-500"
                      : "bg-indigo-100 border-violet-300"
                }`}
      >
        {item.flashcard.question.split("\n\n")[0]}
      </div>
    </div>
  )
}

// Component for Answer
function AnswerItem({ item, index, isSelected, isMatched, isIncorrect, onSelect }) {
  return (
    <div
      className={`flex gap-2 cursor-pointer transition-all duration-300 rounded-full
                ${isMatched ? "opacity-20 pointer-events-none" : ""}
                ${isIncorrect ? "bg-red-200" : isSelected ? "bg-violet-200 scale-[1.02]" : "hover:bg-violet-50"}`}
      onClick={onSelect}
    >
      <span
        className={`w-20 h-16 flex items-center rounded-2xl shadow-[0px_3px_0px_0px_rgba(186,190,253,1.00)] border-2 
                ${
                  isIncorrect
                    ? "bg-red-500 text-white border-red-600"
                    : isSelected
                      ? "bg-violet-500 text-white border-violet-600"
                      : "bg-indigo-100 text-violet-300 border-violet-300"
                } 
                text-center justify-center text-3xl font-bold`}
      >
        {String.fromCharCode(65 + index)}
      </span>
      <div
        className={`w-full flex items-center px-4 h-16 rounded-2xl shadow-md border-2 
                ${
                  isIncorrect
                    ? "bg-red-100 border-red-500"
                    : isSelected
                      ? "bg-violet-100 border-violet-500"
                      : "bg-indigo-100 border-violet-300"
                }`}
      >
        {item.flashcard.answer}
      </div>
    </div>
  )
}


import { useState } from "react"
import { useNavigate } from "react-router-dom";

export default function PracticeComplete() {
  const [isAnimating, setIsAnimating] = useState(true);
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#1f3246] text-white">
      <div className="w-full max-w-md px-4 py-8">
        {/* Characters */}
        <div className="mb-6 flex items-end justify-center space-x-4">
          {/* Green Owl Character */}
          <div className="relative">
            <div className="h-20 w-16 rounded-full bg-[#5ac451]">
              <div className="absolute -top-1 left-1/2 h-8 w-8 -translate-x-1/2 rounded-full bg-[#5ac451]"></div>
              <div className="absolute left-1/2 top-3 h-3 w-3 -translate-x-[8px] rounded-full bg-white"></div>
              <div className="absolute left-1/2 top-3 h-3 w-3 translate-x-[2px] rounded-full bg-white"></div>
              <div className="absolute left-1/2 top-3 h-1.5 w-1.5 -translate-x-[7px] rounded-full bg-black"></div>
              <div className="absolute left-1/2 top-3 h-1.5 w-1.5 translate-x-[3px] rounded-full bg-black"></div>
              <div className="absolute left-1/2 top-8 h-2 w-4 -translate-x-1/2 rounded-full bg-[#f9a825]"></div>
            </div>
            <div className="absolute bottom-0 left-1/2 h-2 w-16 -translate-x-1/2 rounded-md bg-[#333]"></div>
          </div>

          {/* Character with headband */}
          <div className="relative">
            <div className="h-24 w-16 rounded-full bg-[#8b5d3b]">
              <div className="absolute -top-2 left-0 h-4 w-full bg-[#f9a825]"></div>
              <div className="absolute left-1/2 top-6 h-2 w-8 -translate-x-1/2 rounded-full bg-white"></div>
              <div className="absolute left-1/2 top-6 h-1 w-6 -translate-x-1/2 rounded-full bg-[#8b5d3b]"></div>
              <div className="absolute bottom-0 left-0 h-12 w-full bg-[#4a9cf5]"></div>
            </div>
            <div className="absolute bottom-0 left-1/2 h-2 w-16 -translate-x-1/2 rounded-md bg-[#333]"></div>
          </div>

          {/* Sparkle effect */}
          <div className="absolute right-1/3 top-1/3">
            <div className={`${isAnimating ? 'animate-spin-slow' : ''}`}>
              <div className="h-1 w-6 bg-yellow-300"></div>
              <div className="h-6 w-1 -translate-y-[14px] translate-x-[10px] rotate-90 bg-pink-500"></div>
              <div className="h-1 w-6 -translate-y-[28px] translate-x-[0px] rotate-45 bg-green-400"></div>
              <div className="h-6 w-1 -translate-y-[42px] translate-x-[10px] rotate-[135deg] bg-blue-400"></div>
            </div>
          </div>
        </div>

        {/* Practice Complete Text */}
        <h1 className="mb-8 text-center text-3xl font-bold text-yellow-400">
          Practice Complete!
        </h1>

        {/* Stats Boxes */}
        <div className="mb-12 flex justify-between gap-4">
          {/* XP Box */}
          <div className="flex-1 overflow-hidden rounded-xl border-4 border-yellow-400">
            <div className="bg-yellow-400 py-2 text-center font-bold">
              TOTAL XP
            </div>
            <div className="flex items-center justify-center space-x-2 bg-[#1a2a3a] py-4">
              {/* Custom Zap icon */}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="h-6 w-6 text-yellow-400"
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
              <span className="text-2xl font-bold text-yellow-400">10</span>
            </div>
          </div>

          {/* Score Box */}
          <div className="flex-1 overflow-hidden rounded-xl border-4 border-green-400">
            <div className="bg-green-400 py-2 text-center font-bold">
              AMAZING
            </div>
            <div className="flex items-center justify-center space-x-2 bg-[#1a2a3a] py-4">
              {/* Custom CheckCircle icon */}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="h-6 w-6 text-green-400"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span className="text-2xl font-bold text-green-400">100%</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:space-x-4 sm:space-y-0">
          <button 
            className="rounded-md border border-gray-500 bg-transparent px-4 py-2 text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
          >
            REVIEW LESSON
          </button>
          <button 
            className="rounded-md bg-green-400 px-4 py-2 font-bold text-black transition-colors hover:bg-green-500"
            onClick={()=> navigate(-1)}
          >
            CONTINUE
          </button>
        </div>
      </div>
    </div>
  )
}

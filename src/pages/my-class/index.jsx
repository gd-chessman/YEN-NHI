import React from 'react'
import { BiSearch } from 'react-icons/bi'

const myClasses = [
    { id: 1, name: "Software Architecture & Design", members: 12, items: 34 },
    { id: 2, name: "Machine Learning Basics", members: 20, items: 45 },
    { id: 3, name: "Full Stack Web Development", members: 15, items: 38 },
    { id: 4, name: "Data Structures & Algorithms", members: 18, items: 27 },
    { id: 5, name: "UI/UX Design Principles", members: 10, items: 22 },
    { id: 6, name: "Cyber Security Essentials", members: 14, items: 30 },
];

const joinedClasses = [
    { id: 7, name: "Cloud Computing", members: 16, items: 40 },
    { id: 8, name: "Artificial Intelligence", members: 22, items: 50 },
    { id: 9, name: "Blockchain Fundamentals", members: 13, items: 29 },
    { id: 10, name: "Mobile App Development", members: 19, items: 35 },
    { id: 11, name: "Game Development", members: 17, items: 28 },
];

export default function MyClass() {
    return (
        <main className="flex-1 px-6 py-4">
            {/* Search Bar */}
            <div className="relative max-w-5xl mx-auto mb-6">
                <input
                    type="text"
                    placeholder="Search your classes"
                    className="w-full pl-4 pr-10 py-3 rounded-lg bg-white focus:outline-none"
                />
                <button className="absolute right-3 border-none transform -translate-y-1/2 top-1/2 bg-transparent">
                    <BiSearch size={20} color='blue' />
                </button>
            </div>

            {/* My Classes Section */}
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">My classes</h2>
                    <div className="relative">
                        <select className="appearance-none bg-[#e0e0fe] px-4 py-1 pr-8 rounded-lg text-sm font-medium">
                            <option>Date modified</option>
                            <option>Alphabetical</option>
                            <option>Recently used</option>
                        </select>
                        <div className="absolute right-2 top-2 pointer-events-none flex ">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M4 6L8 10L12 6"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Class Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {myClasses.map((cls) => (
                        <div key={cls.id} className="bg-white p-4 rounded-lg">
                            <h3 className="text-lg font-bold mb-4">{cls.name}</h3>
                            <div className="flex justify-between">
                                <span className="text-sm">{cls.members} members</span>
                                <span className="text-sm bg-[#e0e0fe] px-3 py-1 rounded-full">{cls.items} items</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Joined Classes Section */}
                <h2 className="text-2xl font-bold mb-4">Joined classes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {joinedClasses.map((cls) => (
                        <div key={cls.id} className="bg-white p-4 rounded-lg">
                            <h3 className="text-lg font-bold mb-4">{cls.name}</h3>
                            <div className="flex justify-between">
                                <span className="text-sm">{cls.members} members</span>
                                <span className="text-sm bg-[#e0e0fe] px-3 py-1 rounded-full">{cls.items} terms</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}

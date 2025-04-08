import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, { useState, useEffect } from 'react';
import { BiSearch, BiSolidFolder } from 'react-icons/bi';
import { IoAddOutline, IoSearchOutline, IoShareOutline } from "react-icons/io5";
import { useForm } from 'react-hook-form';
import api from "../../apis/api";
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function MyClassList() {
    const [showModal, setShowModal] = useState(false);
    const [myClasses, setMyClasses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    // Gọi API khi component mount
    useEffect(() => {
        fetchData();
    }, []);

    // Hàm lấy dữ liệu từ API
    const fetchData = async () => {
        try {
            // Lấy dữ liệu myClasses
            const myClassesResponse = await api.get("/v1/my-class/me");
            setMyClasses(myClassesResponse.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const onSubmit = async (data) => {
        console.log("Form Data:", data);
        try {
            const res = await api.post("/v1/my-class", data);
            reset(); // Reset form sau khi submit
            fetchData(); // Gọi lại API để cập nhật danh sách
        } catch (error) {
            console.error("Error submitting data:", error);
        }
    };

    // Hàm xử lý khi nhấn nút chia sẻ
    const handleShareClass = async (classId) => {
        try {
            // TODO: Implement share functionality
            toast.info('Share functionality coming soon!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } catch (error) {
            console.error(`Error sharing class ${classId}:`, error);
            toast.error('Failed to share class', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    };

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
                        <div className="absolute right-2 top-2 pointer-events-none flex">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myClasses.map((myClass) => (
                        <Link 
                            key={myClass.myClassId}
                            to={`/user/my-class/${myClass.myClassId}/folder`}
                            className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden no-underline"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <BiSolidFolder className="text-[#4f46e5] text-2xl mr-3" />
                                        <h3 className="text-lg font-medium text-gray-900">{myClass.title}</h3>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleShareClass(myClass.myClassId);
                                            }}
                                            className="group relative inline-flex items-center justify-center p-1.5 rounded-full hover:bg-gray-50 transition-colors duration-200 focus:outline-none border-0"
                                            title="Share class"
                                        >
                                            <IoShareOutline className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
                                            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                                Share class
                                            </span>
                                        </button>
                                    </div>
                                </div>
                                <p className="mt-2 text-sm text-gray-500 line-clamp-2">{myClass.description}</p>
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-sm bg-[#e0e0fe] px-3 py-1 rounded-full text-[#4f46e5]">
                                        {myClass.items || 0} items
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <button className='fixed bottom-10 right-10 bg-[#0e22e9] p-2.5 flex border-none rounded' onClick={() => setShowModal(true)}>
                <IoAddOutline size={24} color='white' />
            </button>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title style={{ fontWeight: "700" }}>Create My class</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2'>
                        <input className='w-full outline-none p-2 ' placeholder='Tiêu đề' {...register("title", { required: "Tiêu đề không được để trống!" })} />
                        <input className='w-full outline-none p-2 ' placeholder='Mô tả' {...register("description", { required: "Mô tả không được để trống!" })} />
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" type='submit'>
                                Add
                            </Button>
                        </Modal.Footer>
                    </form>
                </Modal.Body>
            </Modal>
            <ToastContainer />
        </main>
    );
}
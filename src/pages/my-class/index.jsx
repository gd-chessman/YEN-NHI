import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, { useState, useEffect } from 'react';
import { BiSearch } from 'react-icons/bi';
import { IoAddOutline } from "react-icons/io5";
import { useForm } from 'react-hook-form';
import api from "../../apis/api";
import { Link } from 'react-router-dom';

export default function MyClass() {
    const [isModal, setIsModal] = useState(false);
    const [myClasses, setMyClasses] = useState([]);
    const [joinedClasses, setJoinedClasses] = useState([]);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();


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

            // Lấy dữ liệu joinedClasses
            const joinedClassesResponse = await api.get("/v1/joined-classes");
            setJoinedClasses(joinedClassesResponse.data);
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {myClasses.map((cls) => (
                        
                        <Link className='text-black no-underline' to={`/user/my-class/${cls.myClassId}/folder`}>
                            <div key={cls.myClassId} className="bg-white p-4 rounded-lg">
                                <h3 className="text-lg font-bold mb-4">{cls.title}</h3>
                                <p className='font-normal'>{cls.description}</p>
                                <div className="flex justify-between">
                                    <span className="text-sm">{cls.members} members</span>
                                    <span className="text-sm bg-[#e0e0fe] px-3 py-1 rounded-full">{cls.items} items</span>
                                </div>
                            </div>
                        </Link>
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
            <button className='fixed bottom-10 right-10 bg-[#0e22e9] p-2.5 flex border-none rounded' onClick={() => setIsModal(true)}>
                <IoAddOutline size={24} color='white' />
            </button>
            <Modal show={isModal} onHide={() => setIsModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title style={{ fontWeight: "700" }}>Create My class</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2'>
                        <input className='w-full outline-none p-2 ' placeholder='Tiêu đề' {...register("title", { required: "Tiêu đề không được để trống!" })} />
                        <input className='w-full outline-none p-2 ' placeholder='Mô tả' {...register("description", { required: "Mô tả không được để trống!" })} />
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setIsModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" type='submit'>
                                Add
                            </Button>
                        </Modal.Footer>
                    </form>
                </Modal.Body>
            </Modal>
        </main>
    );
}
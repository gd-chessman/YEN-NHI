import React, { useState, useEffect } from 'react'
import { IoFolderOutline, IoSearchOutline } from 'react-icons/io5'
import { BiSolidFolder } from 'react-icons/bi'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from "../../apis/api";
import { useParams, Link } from 'react-router-dom';
import { SiGoogleclassroom } from 'react-icons/si';
import { IoCopyOutline } from 'react-icons/io5';

export default function JoinClassFolder() {
  const [folders, setFolders] = useState([]);
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [classInfo, setClassInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('folders');
  const { id: classId } = useParams();

  // Hàm gọi API để lấy thông tin class
  const fetchClassInfo = async () => {
    try {
      const response = await api.get(`/v1/my-class/${classId}/room`);
      setClassInfo(response.data);
    } catch (error) {
      console.error("Error fetching class info:", error);
    }
  };

  // Hàm gọi API để lấy danh sách folder của class
  const fetchFolders = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/v1/my-class/${classId}/folders`);
      console.log(response)
      setFolders(response.data || []);
    } catch (error) {
      console.error("Error fetching folders:", error);
      toast.error('Failed to fetch folders', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setLoading(false);
    }
  };

  // Hàm gọi API để lấy danh sách set của class
  const fetchSets = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/v1/my-class/${classId}/sets`);
      console.log(response)
      setSets(response.data || []);
    } catch (error) {
      console.error("Error fetching sets:", error);
      toast.error('Failed to fetch sets', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi component mount
  useEffect(() => {
    fetchClassInfo();
    fetchFolders();
    fetchSets();
  }, [classId]);

  return (
    <div className="min-h-screen bg-[#ededff]">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Header */}
      <div className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <SiGoogleclassroom className="text-[#4f46e5] text-3xl" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{classInfo?.title || 'Classroom'}</h1>
                <p className="text-sm text-gray-500">
                  {activeTab === 'folders' ? `${folders.length} folders` : `${sets.length} sets`}
                </p>
                {classInfo && (
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                    Code Class: <span className="font-medium text-[#4f46e5]">{classInfo.classCode}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(classInfo.classCode);
                        toast.success('Class code copied to clipboard!', {
                          position: "top-right",
                          autoClose: 2000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                          theme: "light",
                        });
                      }}
                      className="inline-flex items-center border-none p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none"
                      title="Copy class code"
                    >
                      <IoCopyOutline className="h-4 w-4 text-gray-500 hover:text-[#4f46e5]" />
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='shadow-md w-11/12 h-1 mx-auto'></div>

      {/* Main Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {/* Tabs */}
            <div className="mb-6">
              <div className="inline-block bg-white rounded-lg p-1">
                <nav className="flex space-x-2">
                  <button
                    onClick={() => setActiveTab('folders')}
                    className={`flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-medium text-sm transition-all duration-200 border-none ${
                      activeTab === 'folders'
                        ? 'bg-[#4f46e5] text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <IoFolderOutline className={`h-4 w-4 transition-colors duration-200 ${
                      activeTab === 'folders' ? 'text-white' : 'text-gray-500'
                    }`} />
                    <span>Folders</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('sets')}
                    className={`flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-medium text-sm transition-all duration-200 border-none ${
                      activeTab === 'sets'
                        ? 'bg-[#4f46e5] text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <svg 
                      className={`h-4 w-4 transition-colors duration-200 ${
                        activeTab === 'sets' ? 'text-white' : 'text-gray-500'
                      }`}
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <line x1="3" y1="9" x2="21" y2="9" />
                      <line x1="9" y1="21" x2="9" y2="9" />
                    </svg>
                    <span>Sets</span>
                  </button>
                </nav>
              </div>
            </div>

            {/* Content Grid */}
            {activeTab === 'folders' ? (
              loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4f46e5]"></div>
                </div>
              ) : folders.length === 0 ? (
                <div className="text-center py-12">
                  <IoFolderOutline className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No folders</h3>
                  <p className="mt-1 text-sm text-gray-500">No folders available in this class.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {folders.map((folder) => (
                    <Link 
                      key={folder.folderId}
                      to={`/user/folder/${folder.folderId}`}
                      className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden no-underline"
                    >
                      <div className="p-6">
                        <div className="flex items-center">
                          <BiSolidFolder className="text-[#4f46e5] text-2xl mr-3" />
                          <h3 className="text-lg font-medium text-gray-900">{folder.title}</h3>
                        </div>
                        <p className="mt-2 text-sm text-gray-500 line-clamp-2">{folder.description}</p>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#e0e0fe] text-[#4f46e5]">
                            {folder.items} items
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )
            ) : (
              loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4f46e5]"></div>
                </div>
              ) : sets.length === 0 ? (
                <div className="text-center py-12">
                  <svg 
                    className="mx-auto h-12 w-12 text-gray-400"
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="9" y1="21" x2="9" y2="9" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No sets</h3>
                  <p className="mt-1 text-sm text-gray-500">No sets available in this class.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sets.map((set) => (
                    <Link 
                      key={set.setId}
                      to={`/user/set/detail/${set.setId}`}
                      className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden no-underline"
                    >
                      <div className="p-6">
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-900">{set.title}</h3>
                        </div>
                        <p className="mt-2 text-sm text-gray-500 line-clamp-2">{set.descriptionSet}</p>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#e0e0fe] text-[#4f46e5]">
                              {set.categoryName}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )
            )}
          </div>

          {/* Members Sidebar */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Class Members</h3>
              <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
                {classInfo?.members?.map((member, index) => (
                  <div key={member.userId} className="p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3">
                    <span className="text-sm text-gray-500 w-6">{index + 1}.</span>
                    <p className="text-sm font-medium text-gray-900 my-auto">
                      {member.firstName} {member.lastName}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

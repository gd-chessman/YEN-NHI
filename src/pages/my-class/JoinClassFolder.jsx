import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal';
import { IoAddOutline, IoFolderOutline, IoSearchOutline } from 'react-icons/io5'
import { BiSolidFolder } from 'react-icons/bi'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from "../../apis/api";
import { useParams, Link } from 'react-router-dom';

export default function JoinClassFolder() {
  const [isModal, setIsModal] = useState(false);
  const [folders, setFolders] = useState([]);
  const [userFolders, setUserFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [classInfo, setClassInfo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { id: classId } = useParams();

  // Hàm gọi API để lấy thông tin class
  const fetchClassInfo = async () => {
    try {
      const response = await api.get(`/v1/my-class/${classId}`);
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

  // Hàm gọi API để lấy danh sách folder của người dùng
  const fetchUserFolders = async () => {
    try {
      const response = await api.get('/v1/folder/user');
      setUserFolders(response.data);
    } catch (error) {
      console.error("Error fetching user folders:", error);
    }
  };

  // Hàm xử lý khi nhấn nút "Add"
  const handleAddFolder = async (folderId) => {
    try {
      const response = await api.put(`/v1/my-class/${classId}/add-folder/${folderId}`);
      console.log(`Folder ${folderId} added successfully:`, response.data);
      toast.success('Folder added successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      fetchFolders();
      setIsModal(false);
    } catch (error) {
      console.error(`Error adding folder ${folderId}:`, error);
      toast.error('Failed to add folder', {
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

  // Hàm xử lý khi nhấn nút "Remove"
  const handleRemoveFolder = async (folderId) => {
    try {
      const response = await api.delete(`/v1/my-class/${classId}/remove-folder/${folderId}`);
      console.log(`Folder ${folderId} removed successfully:`, response.data);
      toast.success('Folder removed successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      fetchFolders();
    } catch (error) {
      console.error(`Error removing folder ${folderId}:`, error);
      toast.error('Failed to remove folder', {
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

  // Lọc folder theo search term và kiểm tra folder đã tồn tại
  const filteredUserFolders = userFolders.filter(folder => {
    // Kiểm tra folder có tồn tại trong class chưa
    const isFolderExists = folders.some(existingFolder => existingFolder.folderId === folder.folderId);
    
    // Lọc theo search term và folder chưa tồn tại
    return (
      (folder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      folder.description?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      !isFolderExists
    );
  });

  // Gọi API khi component mount
  useEffect(() => {
    fetchClassInfo();
    fetchFolders();
  }, [classId]);

  // Gọi API lấy danh sách folder của người dùng khi modal mở
  useEffect(() => {
    if (isModal) {
      fetchUserFolders();
    }
  }, [isModal]);

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
      <div className=" shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <BiSolidFolder className="text-[#4f46e5] text-3xl" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{classInfo?.title || 'Classroom folder'}</h1>
                <p className="text-sm text-gray-500">{folders.length} folders</p>
              </div>
            </div>
            <button 
              onClick={() => setIsModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4f46e5] hover:bg-[#4338ca] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5] transition-colors"
            >
              <IoAddOutline className="mr-2" size={20} />
              Add Folder
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4f46e5]"></div>
          </div>
        ) : folders.length === 0 ? (
          <div className="text-center py-12">
            <IoFolderOutline className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No folders</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a new folder.</p>
            <div className="mt-6">
            </div>
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
        )}
      </div>

      {/* Add Folder Modal */}
      <Modal show={isModal} onHide={() => setIsModal(false)} size="lg">
        <Modal.Header closeButton className="border-b border-gray-200">
          <Modal.Title className="text-xl font-semibold text-gray-900">Add folder to class</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-6">
          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IoSearchOutline className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#4f46e5] focus:border-[#4f46e5] sm:text-sm"
              placeholder="Search folders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Folders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredUserFolders.map((folder) => (
              <div 
                key={folder.folderId} 
                className="bg-white border border-gray-200 rounded-lg p-4 hover:border-[#4f46e5] transition-colors duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <BiSolidFolder className="text-[#4f46e5] text-2xl mr-3 mt-1" />
                    <div>
                      <h4 className="text-base font-medium text-gray-900">{folder.title}</h4>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">{folder.description}</p>
                      {folder.myClasses && folder.myClasses.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-900">Used in classes:</p>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {folder.myClasses.map((myClass) => (
                              <span key={myClass.myClassId} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#e0e0fe] text-[#4f46e5]">
                                {myClass.title}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    className="ml-4 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-[#4f46e5] hover:bg-[#4338ca] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5] transition-colors"
                    onClick={() => handleAddFolder(folder.folderId)}
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredUserFolders.length === 0 && (
            <div className="text-center py-8">
              <IoFolderOutline className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No folders found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? "Try adjusting your search" : "All your folders are already added to this class"}
              </p>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  )
}

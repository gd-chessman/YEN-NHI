import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal';
import { IoAddOutline } from 'react-icons/io5'
import api from "../../apis/api";
import { useParams } from 'react-router-dom';

export default function MyFolder() {
  const [isModal, setIsModal] = useState(false);
  const [folders, setFolders] = useState([]); // State để lưu danh sách folder
  const [loading, setLoading] = useState(false); // State để hiển thị trạng thái loading
  const { id: classId } = useParams(); // Lấy classId từ URL

  // Hàm gọi API để lấy danh sách folder
  const fetchFolders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/v1/folder/user');
      setFolders(response.data); // Lưu dữ liệu vào state
    } catch (error) {
      console.error("Error fetching folders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý khi nhấn nút "Add"
  const handleAddFolder = async (folderId) => {
    try {
      const response = await api.put(`/v1/my-class/${classId}/add-folder/${folderId}`);
      console.log(`Folder ${folderId} added successfully:`, response.data);
      alert(`Folder added successfully!`);
    } catch (error) {
      console.error(`Error adding folder ${folderId}:`, error);
      alert(`Failed to add folder.`);
    }
  };

  // Gọi API khi modal được mở
  useEffect(() => {
    if (isModal) {
      fetchFolders();
    }
  }, [isModal]);

  return (
    <>
      <h3 className='mt-8 px-4'>Classroom folder</h3>
      <div className="grid grid-cols-4 gap-4 p-4  min-h-screen">
        <div className="shadow-md rounded-lg p-4 h-max">Column 1</div>
        <div className="shadow-md rounded-lg p-4 h-max">Column 2</div>
        <div className="shadow-md rounded-lg p-4 h-max">Column 3</div>
        <div className="shadow-md rounded-lg p-4 h-max">Column 4</div>
      </div>

      <button className='fixed bottom-10 right-10 bg-[#0e22e9] p-2.5 flex border-none rounded' onClick={() => setIsModal(true)}>
        <IoAddOutline size={24} color='white' />
      </button>
      <Modal show={isModal} onHide={() => setIsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontWeight: "700" }}>Add folder to class</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul>
              {folders.map((folder) => (
                <li key={folder.folderId} className="flex justify-between items-center mb-2">
                  <span>{folder.title}</span>
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded border-none"
                    onClick={() => handleAddFolder(folder.folderId)}
                  >
                    Add
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Modal.Body>
      </Modal>
    </>
  )
}

import React, {useState, useEffect, useRef} from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    IconButton,
    Typography,
    FormControlLabel,
    Switch,
    MenuItem
} from '@mui/material';
import {Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon} from '@mui/icons-material';
import {toast} from "react-toastify";
import api from "src/apis/api.js";

function SetManagement() {
    const [categories, setCategories] = useState([{}]);
    const [setCards, setSetCards] = useState([{}]);
    const [openSetModal, setOpenSetModal] = useState(false);
    const [openDeleteSetModal, setOpenDeleteSetModal] = useState(false);
    const [openCardModal, setOpenCardModal] = useState(false);
    const [openDeleteCardModal, setOpenDeleteCardModal] = useState(false);
    const [selectedSet, setSelectedSet] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null);

    const DEFAULT_PAGE = 0;
    const DEFAULT_ITEMS_PER_PAGE = 10;

    const [totalSets, setTotalSets] = useState(100);
    const [currentPageSetCard, setCurrentPageSetCard] = useState(DEFAULT_PAGE);
    const [rowsPerPageSetCard, setRowsPerPageSetCard] = useState(DEFAULT_ITEMS_PER_PAGE);

    const setsTableRef = useRef(null);

    const [users, setUsers] = useState([]);

    const defaultSetInfo = {
        setId: 0,
        title: '',
        descriptionSet: '',
        createdAt: null,
        updatedAt: null,
        isApproved: null,
        isAnonymous: false,
        sharingMode: true,
        firstName: '',
        lastName: '',
        userName: '',
        userId: null,
        avatar: '',
        categoryId: 1,
        categoryName: '',
        totalCard: 0
    };

    const defaultCardInfo = {
        cardId: null,
        question: '',
        answer: '',
    };

    const handleOpenSetModal = async (setCard = null) => {
        if (setCard) {
            setFormSetData({
                ...setCard,
                categoryId: categories.find((c) => setCard.categoryName === c.categoryName).categoryId,
            });
            setSelectedSet(setCard);
        } else {
            setFormSetData(defaultSetInfo);
            setSelectedSet(null);
        }
        setOpenSetModal(true);
    };

    const handleOpenSetDeleteModal = async (setCard) => {
        setSelectedSet(setCard);
        setOpenDeleteSetModal(true);
    };

    const handleCloseSetModal = () => {
        setSelectedSet(null);
        setOpenSetModal(false);
    };

    const fetchUsers = async () => {
        try {
            const resListUsers = await api.get("/v1/users/data");
            setUsers(resListUsers.data);
            // console.log(resListUsers.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load list of users");
        }
    };

    const handleCloseSetDeleteModal = () => {
        setSelectedSet(null);
        setOpenDeleteSetModal(false);
    };

    const handleOpenCardModal = async (card = null) => {

    };

    const handleOpenCardDeleteModal = async (card) => {

    };

    const handleCloseCardModal = async () => {
    };

    const handleCloseCardDeleteModal = async () => {
    };

    const [formSetData, setFormSetData] = useState(defaultSetInfo);
    const [formCardData, setFormCardData] = useState(defaultCardInfo);

    const fetchCategories = async () => {
        try {
            const resListCategories = await api.get("/v1/category/list");
            setCategories(resListCategories.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load list of categories");
        }
    };

    const fetchSets = async () => {
        try {
            const resListSets = await api.get("/v1/set/list");
            // console.log(resListSets.data);
            setSetCards(resListSets.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load list of categories");
        }
    };

    const handleInputSetChange = (e) => {
        const {name, value} = e.target;
        setFormSetData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleInputCardChange = (e) => {
        const {name, value} = e.target;
        setFormCardData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const createSet = async (payload) => {
        await api.post(`/v1/set/create`, payload);
    };

    const updateSet = async (payload) => {
        await api.put(`/v1/set/update`, payload);
    };

    const deleteSet = async (id) => {
        await api.delete(`/v1/set/delete/${id}`);
    };

    const handleSubmitSet = async() => {
        try {
            const payload = {
                ...formSetData,
            };

            let msg = "";

            console.log(payload);

            if (selectedSet) {
                // Call API to update set
                await updateSet(payload);
                msg = "Updated successfully";
            } else {
                // Call API to create set
                await createSet(payload);
                msg = "Created successfully";
            }

            toast.success(msg);
            // Refresh users list
            await fetchSets();
            handleCloseSetModal();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDeleteSet = async() => {
        try {
            await deleteSet(selectedSet.setId);
            await fetchSets();
            toast.success("Deleted successfully");
            handleCloseSetDeleteModal();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchCategories().then().catch();
        fetchUsers().then().catch();
        fetchSets().then().catch();
    }, []);

    return (
        <>
            <Box sx={{p: 3}}>
                <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2}}>
                    <Typography variant="h5" component="h1">
                        Set Management
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon/>}
                        onClick={() => handleOpenSetModal()}
                    >
                        Add new set
                    </Button>
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Description set</TableCell>
                                <TableCell>Is anonymous</TableCell>
                                <TableCell>Sharing mode</TableCell>
                                <TableCell>User</TableCell>
                                <TableCell>Category name</TableCell>
                                <TableCell>Total card</TableCell>
                                <TableCell>Created at</TableCell>
                                <TableCell>Updated at</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {setCards.map((s) => (
                                <TableRow key={s.setId}>
                                    <TableCell>{s.title}</TableCell>
                                    <TableCell>{s.descriptionSet ?? 'Not set'}</TableCell>
                                    <TableCell>{s.isAnonymous ? 'true' : 'false'}</TableCell>
                                    <TableCell>{s.sharingMode ? 'true' : 'false'}</TableCell>
                                    <TableCell>{s.firstName || s.lastName ?
                                        `${s.firstName || ''} ${s.lastName || ''}` : s.userName}</TableCell>
                                    <TableCell>{s.categoryName}</TableCell>
                                    <TableCell>{s.totalCard}</TableCell>
                                    <TableCell>{s.createdAt}</TableCell>
                                    <TableCell>{s.updatedAt}</TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleOpenSetModal(s)}
                                        >
                                            <EditIcon/>
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleOpenSetDeleteModal(s)}
                                        >
                                            <DeleteIcon/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Add/Edit Modal */}
                <Dialog
                    open={openSetModal}
                    onClose={handleCloseSetModal}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        {selectedSet ? 'Edit Set' : 'Add New set'}
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{pt: 2, display: 'grid', gap: 2, gridTemplateColumns: 'repeat(2, 1fr)'}}>
                            <TextField
                                label="Title"
                                name="title"
                                value={formSetData.title}
                                onChange={handleInputSetChange}
                                sx={{gridColumn: '1 / -1'}}
                                required
                            />
                            <TextField
                                label="Description set"
                                name="descriptionSet"
                                value={formSetData.descriptionSet}
                                onChange={handleInputSetChange}
                                sx={{gridColumn: '1 / -1'}}
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formSetData.isAnonymous}
                                        onChange={(e) => setFormSetData(prev => ({...prev, isAnonymous : e.target.checked}))}
                                        name="isAnonymous"
                                    />
                                }
                                label="Is anonymous"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formSetData.sharingMode}
                                        onChange={(e) => setFormSetData(prev => ({...prev, sharingMode: e.target.checked}))}
                                        name="sharingMode"
                                    />
                                }
                                label="Sharing mode"
                            />
                            <TextField
                                select
                                label="Category"
                                name="categoryId"
                                value={formSetData.categoryId}
                                onChange={(event) => {
                                    const selectedCategoryId = Number(event.target.value); // Lấy userId từ event
                                    const selectedCategory = categories.find((c) => c.categoryId === selectedCategoryId); // Tìm role dựa trên roleId
                                    if (selectedCategory) {
                                        setFormSetData((prevState) => ({
                                            ...prevState,
                                            categoryId: selectedCategory.categoryId, // Cập nhật userId
                                            categoryName: selectedCategory.categoryName, // Cập nhật username
                                        }));
                                    }
                                }}
                                required
                            >
                                {categories.map((c) => (
                                    <MenuItem key={c.categoryId} value={c.categoryId}>
                                        {c.categoryName}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                select
                                label="Username"
                                name="userId"
                                value={formSetData.userId}
                                onChange={(event) => {
                                    const selectedUserId = Number(event.target.value); // Lấy userId từ event
                                    const selectedUsername = users.find((u) => u.userId === selectedUserId); // Tìm role dựa trên roleId
                                    if (selectedUsername) {
                                        setFormSetData((prevState) => ({
                                            ...prevState,
                                            userId: selectedUsername.userId, // Cập nhật userId
                                            userName: selectedUsername.username, // Cập nhật username
                                        }));
                                    }
                                }}
                                required
                            >
                                {users.map((user) => (
                                    <MenuItem key={user.userId} value={user.userId}>
                                        {user.username}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseSetModal}>Cancel</Button>
                        <Button onClick={handleSubmitSet} variant="contained">
                            {selectedSet ? 'Update' : 'Add'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Delete Confirmation Modal */}
                <Dialog open={openDeleteCardModal} onClose={handleCloseSetDeleteModal}>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to delete set card: {selectedSet?.title}?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseSetDeleteModal}>Cancel</Button>
                        <Button onClick={handleDeleteSet} color="error" variant="contained">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </>
    );
}

export default SetManagement;
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
    MenuItem, TablePagination
} from '@mui/material';
import {Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon} from '@mui/icons-material';
import {toast} from "react-toastify";
import api from "src/apis/api.js";

function CategorySetManagement() {
    const [categories, setCategories] = useState([{}]);
    const [openModal, setOpenModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formData, setFormData] = useState({
        categoryId: null,
        categoryName: '',
    });

    const DEFAULT_PAGE = 0;
    const DEFAULT_ITEMS_PER_PAGE = 10;

    const [totalElements, setTotalElements] = useState(100);
    const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);
    const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);

    const categoriesTableRef = useRef(null);

    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage);
        categoriesTableRef.current && (categoriesTableRef.current.style.opacity = "0.5");
        categoriesTableRef.current && (categoriesTableRef.current.style.pointerEvents = "none");
        fetchCategories({
            page: newPage, size: rowsPerPage,
        }).finally(
            () => {
                categoriesTableRef.current && (categoriesTableRef.current.style.opacity = "1");
                categoriesTableRef.current && (categoriesTableRef.current.style.pointerEvents = "auto");
            }
        );
    };

    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setCurrentPage(DEFAULT_PAGE);
        categoriesTableRef.current && (categoriesTableRef.current.style.opacity = "0.5");
        categoriesTableRef.current && (categoriesTableRef.current.style.pointerEvents = "none");
        fetchCategories({
            page: DEFAULT_PAGE, size: newRowsPerPage,
        }).finally(
            () => {
                categoriesTableRef.current && (categoriesTableRef.current.style.opacity = "1");
                categoriesTableRef.current && (categoriesTableRef.current.style.pointerEvents = "auto");
            }
        );
    };

    const fetchCategories = async ({page, size}) => {
        try {
            const resListCategories = await api.get("/v1/category/list-pagination", {
                params: {
                    page: page,
                    size: size,
                }
            });
            console.log(resListCategories.data);
            setCategories(resListCategories.data.content);
            setTotalElements(resListCategories.data.totalElements)
        } catch (error) {
            console.error(error);
            toast.error("Failed to load list of categories");
        }
    };

    // Fetch categories from API
    useEffect(() => {
        fetchCategories({page: DEFAULT_PAGE, size: DEFAULT_ITEMS_PER_PAGE}).then().catch();
    }, []);

    const handleOpenModal = (category = null) => {
        if (category) {
            setFormData({
                ...category,
            });
            setSelectedCategory(category);
        } else {
            setFormData({
                categoryId: null,
                categoryName: '',
            });
            setSelectedCategory(null);
        }
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedCategory(null);
    };

    const handleOpenDeleteModal = (user) => {
        setSelectedCategory(user);
        setOpenDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
        setSelectedCategory(null);
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const beforeSubmit = (payload) => {
        let error = "";
        if (!payload) {
            toast.error("Cannot have data");
            throw new Error();
        }
        console.log("In payload...");
        if ((error = !payload.categoryName?.trim() && "You do not input category")) {
            toast.error(`Error role: ${error}`);
            throw new Error();
        }
    }

    const updateCategory = async (payload) => {
        console.log(payload);
        await api.put("/v1/category/update", payload);
    };

    const createCategory = async (payload) => {
        await api.post("/v1/category/create", payload);
    };

    const deleteCategory = async (id) => {
        await api.delete(`/v1/category/delete/${id}`);
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                ...formData,
            };

            beforeSubmit(payload);

            let msg = "";

            console.log(payload);

            if (selectedCategory) {
                // Call API to update category
                await updateCategory(payload);
                msg = "Updated successfully";
            } else {
                // Call API to create category
                await createCategory(payload);
                msg = "Created successfully";
            }

            toast.success(msg);
            // Refresh users list
            await fetchCategories();
            handleCloseModal();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteCategory(selectedCategory.categoryId);
            await fetchCategories();
            toast.success("Deleted successfully");
            handleCloseDeleteModal();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <Box sx={{p: 3}}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2}}>
                <Typography variant="h5" component="h1">
                    Category set Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon/>}
                    onClick={() => handleOpenModal()}
                >
                    Add new category
                </Button>
            </Box>

            <TableContainer component={Paper} ref={categoriesTableRef}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Category Id</TableCell>
                            <TableCell>Category Name</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map((c) => (
                            <TableRow key={c.categoryId}>
                                <TableCell>{c.categoryId}</TableCell>
                                <TableCell>{c.categoryName}</TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleOpenModal(c)}
                                    >
                                        <EditIcon/>
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleOpenDeleteModal(c)}
                                    >
                                        <DeleteIcon/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={totalElements}
                page={currentPage}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            {/* Add/Edit Modal */}
            <Dialog
                open={openModal}
                onClose={handleCloseModal}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    {selectedCategory ? 'Edit category' : 'Add New category'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{pt: 2, display: 'grid', gap: 2, gridTemplateColumns: 'repeat(2, 1fr)'}}>
                        <TextField
                            label="Category Name"
                            name="categoryName"
                            value={formData.categoryName}
                            onChange={handleInputChange}
                            sx={{gridColumn: '1 / -1'}}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {selectedCategory ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={openDeleteModal} onClose={handleCloseDeleteModal}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete category: {selectedCategory?.categoryId}?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteModal}>Cancel</Button>
                    <Button onClick={handleDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default CategorySetManagement;
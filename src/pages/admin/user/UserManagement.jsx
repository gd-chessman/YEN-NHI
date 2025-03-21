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
    MenuItem,
    TablePagination,
} from '@mui/material';
import {Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon} from '@mui/icons-material';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider, DatePicker} from '@mui/x-date-pickers';
import dayjs from "dayjs";
import {toast} from "react-toastify";
import {MuiTelInput} from 'mui-tel-input';
import api from "src/apis/api.js";
import {validateEmail, validateName, validatePassword, validateUsername} from "src/utils/validate.js";

function UserManagement() {
    const DEFAULT_PAGE = 0;
    const DEFAULT_ITEMS_PER_PAGE = 10;

    const [totalElements, setTotalElements] = useState(100);
    const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);
    const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);

    const usersTableRef = useRef(null);

    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage);
        usersTableRef.current && (usersTableRef.current.style.opacity = "0.5");
        usersTableRef.current && (usersTableRef.current.style.pointerEvents = "none");
        fetchUsers({
            page: newPage, size: rowsPerPage,
        }).finally(
            () => {
                usersTableRef.current && (usersTableRef.current.style.opacity = "1");
                usersTableRef.current && (usersTableRef.current.style.pointerEvents = "auto");
            }
        );
    };

    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setCurrentPage(DEFAULT_PAGE);
        usersTableRef.current && (usersTableRef.current.style.opacity = "0.5");
        usersTableRef.current && (usersTableRef.current.style.pointerEvents = "none");
        fetchUsers({
            page: DEFAULT_PAGE, size: newRowsPerPage,
        }).finally(
            () => {
                usersTableRef.current && (usersTableRef.current.style.opacity = "1");
                usersTableRef.current && (usersTableRef.current.style.pointerEvents = "auto");
            }
        );
    };

    const [users, setUsers] = useState([{}]);

    const [roles, setRoles] = useState([]); // Assuming you'll fetch roles from API

    const [openModal, setOpenModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        userId: null,
        address: '',
        avatar: '',
        dateOfBirth: null,
        email: '',
        enabled: true,
        username: '',
        password: '',
        gender: true,
        phoneNumber: '',
        userCode: '',
        firstName: '',
        lastName: '',
        roleId: null,
        roleName: '',
    });

    const fetchRoles = async () => {
        try {
            const resListRoles = await api.get("/v1/roles");
            setRoles(resListRoles.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load list of roles");
        }
    };

    const fetchUsers = async ({page, size}) => {
        try {
            const resListUsers = await api.get("/v1/users/data", {
                params: {
                    page: page,
                    size: size,
                }
            });
            setUsers(resListUsers.data.content);
            setTotalElements(resListUsers.data.totalElements);
            console.log(resListUsers.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load list of users");
        }
    };

    // Fetch users from API
    useEffect(() => {
        fetchRoles().then().catch();
        fetchUsers({page: DEFAULT_PAGE, size: DEFAULT_ITEMS_PER_PAGE}).then().catch();
    }, []);

    const handleOpenModal = (user = null) => {
        if (user) {
            setFormData({
                ...user,
            });
            setSelectedUser(user);
        } else {
            setFormData({
                userId: null,
                address: '',
                avatar: '',
                dateOfBirth: null,
                email: '',
                enabled: true,
                username: '',
                gender: true,
                password: '',
                phoneNumber: '',
                userCode: '',
                firstName: '',
                lastName: '',
                roleId: null,
                roleName: '',
            });
            setSelectedUser(null);
        }
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedUser(null);
    };

    const handleOpenDeleteModal = (user) => {
        setSelectedUser(user);
        setOpenDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
        setSelectedUser(null);
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
        if ((error = validateName(payload.firstName))) {
            toast.error(`Error first name: ${error}`);
            throw new Error();
        }
        console.log(error);
        if ((error = validateName(payload.lastName))) {
            toast.error(`Error last name: ${error}`);
            throw new Error();
        }
        if ((error = validateUsername(payload.username))) {
            toast.error(`Error username: ${error}`);
            throw new Error();
        }
        if ((error = validateEmail(payload.email))) {
            toast.error(`Error email: ${error}`);
            throw new Error();
        }
        if (payload.password && (error = validatePassword(payload.password))) {
            toast.error(`Error password: ${error}`);
            throw new Error();
        }
        if ((error = !payload.roleId && "You do not choose role")) {
            toast.error(`Error role: ${error}`);
            throw new Error();
        }
    }

    const updateUser = async (payload) => {
        console.log(payload);
        await api.put(`/v1/admin/users/update-user/${payload.userId}`, payload);
    };

    const createUser = async (payload) => {
        await api.post("/v1/admin/users/create-user", payload);
    };

    const deleteUser = async (id) => {
        await api.delete(`/v1/admin/users/delete-user/${id}`);
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                ...formData,
            };

            beforeSubmit(payload);

            let msg = "";

            console.log(payload);

            if (selectedUser) {
                // Call API to update user
                await updateUser(payload);
                msg = "Updated successfully";
            } else {
                // Call API to create user
                if (!payload.password?.trim()) {
                    toast.error(`Empty password`);
                    throw new Error();
                }
                await createUser(payload);
                msg = "Created successfully";
            }

            toast.success(msg);
            // Refresh users list
            await fetchUsers({page: currentPage, size: rowsPerPage});
            handleCloseModal();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteUser(selectedUser.userId);
            await fetchUsers(currentPage, rowsPerPage);
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
                    User Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon/>}
                    onClick={() => handleOpenModal()}
                >
                    Add User
                </Button>
            </Box>

            <TableContainer component={Paper} ref={usersTableRef}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Username</TableCell>
                            <TableCell>Full Name</TableCell>
                            <TableCell>Birthdate</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.userId}>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.firstName || user.lastName ?
                                    `${user.firstName || ''} ${user.lastName || ''}` : 'Not set'}</TableCell>
                                <TableCell>{`${!user.dateOfBirth ? 'Not set' : dayjs(user.dateOfBirth).format("MM/DD/YYYY")}`}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.phoneNumber ?? 'Not set'}</TableCell>
                                <TableCell>{user.roleName ? user.roleName : 'Unknown role'}</TableCell>
                                <TableCell>{user.enabled ? 'Active' : 'Inactive'}</TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleOpenModal(user)}
                                    >
                                        <EditIcon/>
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleOpenDeleteModal(user)}
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
                    {selectedUser ? 'Edit User' : 'Add New User'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{pt: 2, display: 'grid', gap: 2, gridTemplateColumns: 'repeat(2, 1fr)'}}>
                        <TextField
                            label="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                        />
                        <TextField
                            label="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                        />
                        <MuiTelInput
                            value={formData.phoneNumber}
                            onChange={(e) => handleInputChange({
                                target: {
                                    name: 'phoneNumber',
                                    value: e,
                                }
                            })
                            }
                            label="Phone Number"
                            name="phoneNumber"
                        />
                        <TextField
                            select
                            label="Role"
                            name="roleId"
                            value={formData.roleId}
                            onChange={(event) => {
                                const selectedRoleId = Number(event.target.value); // Lấy roleId từ event
                                const selectedRole = roles.find((role) => role.roleId === selectedRoleId); // Tìm role dựa trên roleId
                                if (selectedRole) {
                                    setFormData((prevState) => ({
                                        ...prevState,
                                        roleId: selectedRole.roleId, // Cập nhật roleId
                                        roleName: selectedRole.roleName, // Cập nhật roleName
                                    }));
                                }
                            }}
                            required
                        >
                            {roles.map((role) => (
                                <MenuItem key={role.roleId} value={role.roleId}>
                                    {role.roleName}
                                </MenuItem>
                            ))}
                        </TextField>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Date of Birth"
                                value={formData.dateOfBirth && dayjs(formData.dateOfBirth)}
                                maxDate={dayjs().tz(dayjs.tz.guess()).subtract(1, "day")}
                                onChange={(newValue) => {
                                    const formatDateTime = newValue
                                        .format("YYYY-MM-DD");
                                    setFormData(prev => ({...prev, dateOfBirth: formatDateTime}));
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                        <TextField
                            label="Address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                        />
                        <TextField
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                            sx={{gridColumn: '1 / -1'}}
                        />
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            sx={{gridColumn: '1 / -1'}}
                        />
                        <TextField
                            label="Password"
                            name="password"
                            type={!showPassword ? "password" : "text"}
                            onChange={handleInputChange}
                            required
                            placeholder={selectedUser ? '**************' : ''}
                            sx={{gridColumn: '1 / -1'}}
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.enabled}
                                    onChange={(e) => setFormData(prev => ({...prev, enabled: e.target.checked}))}
                                    name="enabled"
                                />
                            }
                            label="Enabled"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.gender}
                                    onChange={(e) => setFormData(prev => ({...prev, gender: e.target.checked}))}
                                    name="gender"
                                />
                            }
                            label="Gender"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {selectedUser ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={openDeleteModal} onClose={handleCloseDeleteModal}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete user: {selectedUser?.username}?
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

export default UserManagement;
import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    useMediaQuery,
    useTheme,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { Header } from '../../../components';
import { QuestionAnswer, Delete } from '@mui/icons-material';
import { tokens } from '../../../../theme/theme';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import botAdminService from '../../../../service/BotAdminService';

const DynamicFacts = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMdDevices = useMediaQuery('(min-width: 724px)');
    const isXsDevices = useMediaQuery('(max-width: 436px)');
    const [isAddFactOpen, setIsAddFactOpen] = useState(false);
    const [newFactType, setNewFactType] = useState('');
    const [newFactValue, setNewFactValue] = useState('');
    const [dynamicFacts, setDynamicFacts] = useState([]);
    const [loadingFacts, setLoadingFacts] = useState(true);
    const [errorLoadingFacts, setErrorLoadingFacts] = useState(null);
    const [deleteByType, setDeleteByType] = useState('');
    const [isDeleteByTypeOpen, setIsDeleteByTypeOpen] = useState(false);

    useEffect(() => {
        const fetchDynamicFacts = async () => {
            try {
                const response = await botAdminService.getDynamicFacts();
                setDynamicFacts(response.data.items); // Access the 'items' array
                setLoadingFacts(false);
            } catch (error) {
                console.error('Error fetching dynamic facts:', error);
                setErrorLoadingFacts('Failed to load dynamic facts.');
                setLoadingFacts(false);
            }
        };

        fetchDynamicFacts();
    }, []);

    const handleAddFactOpen = () => {
        setIsAddFactOpen(true);
        setNewFactType('');
        setNewFactValue('');
    };

    const handleAddFactClose = () => {
        setIsAddFactOpen(false);
    };

    const handleAddFactSubmit = async () => {
        if (!newFactType || !newFactValue) {
            toast.error('Please enter both fact type and value.');
            return;
        }
        try {
            await botAdminService.addDynamicFact(newFactType, newFactValue);
            toast.success('Successfully added dynamic fact!');
            handleAddFactClose();
            const response = await botAdminService.getDynamicFacts();
            setDynamicFacts(response.data.items); // Access the 'items' array
        } catch (error) {
            console.error('Error adding dynamic fact:', error);
            toast.error('Failed to add dynamic fact.');
        }
    };

    const handleDeleteAllFacts = async () => {
        if (window.confirm('Are you sure you want to delete all dynamic facts?')) {
            try {
                await botAdminService.deleteAllDynamicFacts();
                toast.success('Successfully deleted all dynamic facts!');
                setDynamicFacts([]);
            } catch (error) {
                console.error('Error deleting all dynamic facts:', error);
                toast.error('Failed to delete all dynamic facts.');
            }
        }
    };

    const handleDeleteByTypeOpen = () => {
        setIsDeleteByTypeOpen(true);
        setDeleteByType('');
    };

    const handleDeleteByTypeClose = () => {
        setIsDeleteByTypeOpen(false);
    };

    const handleDeleteFactsByTypeSubmit = async () => {
        if (!deleteByType) {
            toast.error('Please select a fact type to delete.');
            return;
        }
        if (window.confirm(`Are you sure you want to delete all facts of type: ${deleteByType}?`)) {
            try {
                await botAdminService.deleteDynamicFactsByType(deleteByType);
                toast.success(`Successfully deleted all facts of type: ${deleteByType}!`);
                const response = await botAdminService.getDynamicFacts();
                setDynamicFacts(response.data.items); // Access the 'items' array
                handleDeleteByTypeClose();
            } catch (error) {
                console.error(`Error deleting dynamic facts of type ${deleteByType}:`, error);
                toast.error(`Failed to delete dynamic facts of type ${deleteByType}.`);
            }
        }
    };

    return (
        <Box m="20px">
            <ToastContainer />
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Dynamic Facts" />
                <Box display="flex" alignItems="center">
                    {!isXsDevices && (
                        <>
                            <Button
                                variant="contained"
                                sx={{
                                    color: '#fcfcfc',
                                    fontSize: isMdDevices ? '14px' : '10px',
                                    fontWeight: 'bold',
                                    p: '10px 20px',
                                    mt: '18px',
                                    mr: '10px',
                                    transition: '.3s ease',
                                }}
                                startIcon={<QuestionAnswer />}
                                onClick={handleAddFactOpen}
                            >
                                Add Fact
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                sx={{
                                    fontSize: isMdDevices ? '14px' : '10px',
                                    fontWeight: 'bold',
                                    p: '10px 20px',
                                    mt: '18px',
                                    transition: '.3s ease',
                                    '&:hover': {
                                        backgroundColor: theme.palette.error.dark,
                                    },
                                }}
                                startIcon={<Delete />}
                                onClick={handleDeleteAllFacts}
                            >
                                Delete All
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{
                                    fontSize: isMdDevices ? '14px' : '10px',
                                    fontWeight: 'bold',
                                    p: '10px 20px',
                                    mt: '18px',
                                    ml: '10px',
                                    transition: '.3s ease',
                                }}
                                onClick={handleDeleteByTypeOpen}
                            >
                                Delete by Type
                            </Button>
                        </>
                    )}
                </Box>
            </Box>

            <Dialog open={isAddFactOpen} onClose={handleAddFactClose}>
                <DialogTitle>Add Dynamic Fact</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="fact_type"
                        label="Fact Type"
                        type="text"
                        fullWidth
                        value={newFactType}
                        onChange={(e) => setNewFactType(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="fact_value"
                        label="Fact Value"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        value={newFactValue}
                        onChange={(e) => setNewFactValue(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddFactClose}>Cancel</Button>
                    <Button onClick={handleAddFactSubmit} variant="contained">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isDeleteByTypeOpen} onClose={handleDeleteByTypeClose}>
                <DialogTitle>Delete Dynamic Facts by Type</DialogTitle>
                <DialogContent>
                    {dynamicFacts.length > 0 ? (
                        <FormControl fullWidth margin="dense">
                            <InputLabel id="delete-by-type-label">Fact Type</InputLabel>
                            <Select
                                labelId="delete-by-type-label"
                                id="delete-by-type"
                                value={deleteByType}
                                label="Fact Type"
                                onChange={(e) => setDeleteByType(e.target.value)}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {[...new Set(dynamicFacts.map((fact) => fact.fact_type))].map(
                                    (type) => (
                                        <MenuItem key={type} value={type}>
                                            {type}
                                        </MenuItem>
                                    )
                                )}
                            </Select>
                        </FormControl>
                    ) : (
                        <Box mt={2}>
                            <p>No dynamic facts available to delete by type.</p>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteByTypeClose}>Cancel</Button>
                    <Button
                        onClick={handleDeleteFactsByTypeSubmit}
                        variant="contained"
                        color="error"
                        disabled={!deleteByType}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Box mt="40px">
                <h2>Dynamic Facts</h2>
                {loadingFacts ? (
                    <p>Loading dynamic facts...</p>
                ) : errorLoadingFacts ? (
                    <p style={{ color: 'red' }}>{errorLoadingFacts}</p>
                ) : dynamicFacts.length > 0 ? (
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="dynamic facts table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Fact Type</TableCell>
                                    <TableCell>Fact Value</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {dynamicFacts.map((fact, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {fact.fact_type}
                                        </TableCell>
                                        <TableCell>{fact.fact_value}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <p>No dynamic facts available.</p>
                )}
            </Box>
        </Box>
    );
};

export default DynamicFacts;
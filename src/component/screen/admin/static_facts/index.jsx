import React, { useState } from 'react';
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
} from '@mui/material';
import { Header } from '../../../components';
import { QuestionAnswer } from '@mui/icons-material';
import { tokens } from '../../../../theme/theme';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import botAdminService from '../../../../service/BotAdminService';

const StaticFacts = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMdDevices = useMediaQuery('(min-width: 724px)');
    const isXsDevices = useMediaQuery('(max-width: 436px)');
    const [isStaticFactsOpen, setIsStaticFactsOpen] = useState(false);
    const [newPattern, setNewPattern] = useState('');
    const [newResponse, setNewResponse] = useState('');

    const handleStaticFactsOpen = () => {
        setIsStaticFactsOpen(true);
        setNewPattern('');
        setNewResponse('');
    };

    const handleStaticFactsClose = () => {
        setIsStaticFactsOpen(false);
    };

    const handleAddStaticFact = async () => {
        try {
            await botAdminService.addStaticFact(newPattern, newResponse);
            toast.success('Successfully added static fact!');
            handleStaticFactsClose();
        } catch (error) {
            console.error('Error adding static fact:', error);
            toast.error('Failed to add static fact.');
        }
    };

    return (
        <Box m="20px">
            <ToastContainer />
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Add Static Fact" />
                <Box display="flex" alignItems="center">
                    {!isXsDevices && (
                        <>
                            <Button
                                variant="contained"
                                sx={{
                                    bgcolor: colors.grey[600],
                                    color: '#fcfcfc',
                                    fontSize: isMdDevices ? '14px' : '10px',
                                    fontWeight: 'bold',
                                    p: '10px 20px',
                                    mt: '18px',
                                    transition: '.3s ease',
                                    ':hover': { bgcolor: colors.grey[700] },
                                }}
                                startIcon={<QuestionAnswer />}
                                onClick={handleStaticFactsOpen}
                            >
                                Add Static Fact
                            </Button>
                        </>
                    )}
                </Box>
            </Box>

            <Dialog open={isStaticFactsOpen} onClose={handleStaticFactsClose}>
                <DialogTitle>Add Static Fact</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="pattern"
                        label="Pattern"
                        type="text"
                        fullWidth
                        value={newPattern}
                        onChange={(e) => setNewPattern(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="response"
                        label="Response"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        value={newResponse}
                        onChange={(e) => setNewResponse(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleStaticFactsClose}>Cancel</Button>
                    <Button onClick={handleAddStaticFact} variant="contained">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default StaticFacts;

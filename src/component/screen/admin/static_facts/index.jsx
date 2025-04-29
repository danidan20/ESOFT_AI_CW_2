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
  IconButton,
} from '@mui/material';
import { Header } from '../../../components';
import { QuestionAnswer, Delete, Edit } from '@mui/icons-material';
import { tokens } from '../../../../theme/theme';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import botAdminService from '../../../../service/BotAdminService';

const StaticFacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMdDevices = useMediaQuery('(min-width: 724px)');
  const isXsDevices = useMediaQuery('(max-width: 436px)');
  const [isAddStaticFactOpen, setIsAddStaticFactOpen] = useState(false);
  const [isEditStaticFactOpen, setIsEditStaticFactOpen] = useState(false);
  const [newPattern, setNewPattern] = useState('');
  const [newResponse, setNewResponse] = useState('');
  const [staticFacts, setStaticFacts] = useState([]);
  const [loadingFacts, setLoadingFacts] = useState(true);
  const [errorLoadingFacts, setErrorLoadingFacts] = useState(null);
  const [currentPatternToEdit, setCurrentPatternToEdit] = useState('');
  const [editPattern, setEditPattern] = useState('');
  const [editResponse, setEditResponse] = useState('');

  useEffect(() => {
    const fetchStaticFacts = async () => {
      try {
        const response = await botAdminService.getStaticFacts();
        setStaticFacts(response.data.items);
        setLoadingFacts(false);
      } catch (error) {
        console.error('Error fetching static facts:', error);
        setErrorLoadingFacts('Failed to load static facts.');
        setLoadingFacts(false);
      }
    };

    fetchStaticFacts();
  }, []);

  const handleStaticFactsOpen = () => {
    setIsAddStaticFactOpen(true);
    setNewPattern('');
    setNewResponse('');
  };

  const handleStaticFactsClose = () => {
    setIsAddStaticFactOpen(false);
  };

  const handleAddStaticFact = async () => {
    try {
      await botAdminService.addStaticFact(newPattern, newResponse);
      toast.success('Successfully added static fact!');
      handleStaticFactsClose();
      const response = await botAdminService.getStaticFacts();
      setStaticFacts(response.data.items);
    } catch (error) {
      console.error('Error adding static fact:', error);
      toast.error('Failed to add static fact.');
    }
  };

  const handleEditStaticFactOpen = (pattern, response) => {
    setCurrentPatternToEdit(pattern);
    setEditPattern(pattern);
    setEditResponse(response);
    setIsEditStaticFactOpen(true);
  };

  const handleEditStaticFactClose = () => {
    setIsEditStaticFactOpen(false);
    setCurrentPatternToEdit('');
    setEditPattern('');
    setEditResponse('');
  };

  const handleUpdateStaticFact = async () => {
    try {
      await botAdminService.updateStaticFact(currentPatternToEdit, editPattern, editResponse);
      toast.success(`Successfully updated static fact "${currentPatternToEdit}"!`);
      handleEditStaticFactClose();
      const response = await botAdminService.getStaticFacts();
      setStaticFacts(response.data.items);
    } catch (error) {
      console.error(`Error updating static fact "${currentPatternToEdit}":`, error);
      toast.error(`Failed to update static fact "${currentPatternToEdit}".`);
    }
  };

  const handleDeleteStaticFact = async (pattern) => {
    if (window.confirm(`Are you sure you want to delete the static fact with pattern "${pattern}"?`)) {
      try {
        await botAdminService.deleteStaticFact(pattern);
        toast.success(`Successfully deleted static fact "${pattern}"!`);
        const response = await botAdminService.getStaticFacts();
        setStaticFacts(response.data.items);
      } catch (error) {
        console.error(`Error deleting static fact "${pattern}":`, error);
        toast.error(`Failed to delete static fact "${pattern}".`);
      }
    }
  };

  return (
    <Box m="20px">
      <ToastContainer />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Static Facts" />
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
                onClick={handleStaticFactsOpen}
              >
                Add Static Fact
              </Button>
            </>
          )}
        </Box>
      </Box>

      <Dialog open={isAddStaticFactOpen} onClose={handleStaticFactsClose}>
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

      <Dialog open={isEditStaticFactOpen} onClose={handleEditStaticFactClose}>
        <DialogTitle>Edit Static Fact</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="editPattern"
            label="Pattern"
            type="text"
            fullWidth
            value={editPattern}
            onChange={(e) => setEditPattern(e.target.value)}
          />
          <TextField
            margin="dense"
            id="editResponse"
            label="Response"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={editResponse}
            onChange={(e) => setEditResponse(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditStaticFactClose}>Cancel</Button>
          <Button onClick={handleUpdateStaticFact} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Box mt="40px">
        <h2>Static Facts</h2>
        {loadingFacts ? (
          <p>Loading static facts...</p>
        ) : errorLoadingFacts ? (
          <p style={{ color: 'red' }}>{errorLoadingFacts}</p>
        ) : staticFacts.length > 0 ? (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="static facts table">
              <TableHead>
                <TableRow>
                  <TableCell>Pattern</TableCell>
                  <TableCell>Response</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {staticFacts.map((fact, index) => (
                  <TableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {fact.pattern}
                    </TableCell>
                    <TableCell>{fact.response}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditStaticFactOpen(fact.pattern, fact.response)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteStaticFact(fact.pattern)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <p>No static facts available.</p>
        )}
      </Box>
    </Box>
  );
};

export default StaticFacts;
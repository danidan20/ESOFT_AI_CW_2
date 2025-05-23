import { useState, useEffect } from "react";
import * as React from "react";
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
} from "@mui/material";
import { Header } from "../../../components";
import { QuestionAnswer } from "@mui/icons-material";
import { tokens } from '../../../../theme/theme';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import botAdminService from "../../../../service/BotAdminService";

const TeachMe = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMdDevices = useMediaQuery("(min-width: 724px)");
  const isXsDevices = useMediaQuery("(max-width: 436px)");
  const [isTeachMeOpen, setIsTeachMeOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [learnedResponses, setLearnedResponses] = useState([]);
  const [loadingLearnedResponses, setLoadingLearnedResponses] = useState(true);
  const [errorLoadingResponses, setErrorLoadingResponses] = useState(null);

  useEffect(() => {
    const fetchLearnedResponses = async () => {
      try {
        const data = await botAdminService.getLearnedResponses();
        setLearnedResponses(data.data.items);
        setLoadingLearnedResponses(false);
      } catch (error) {
        console.error("Error fetching learned responses:", error);
        setErrorLoadingResponses("Failed to load learned responses.");
        setLoadingLearnedResponses(false);
      }
    };

    fetchLearnedResponses();
  }, []); 

  const handleTeachMeOpen = () => {
    setIsTeachMeOpen(true);
    setNewQuestion("");
    setNewAnswer("");
  };

  const handleTeachMeClose = () => {
    setIsTeachMeOpen(false);
  };

  const handleTeachMeSubmit = async () => {
    try {
      await botAdminService.teachMe(newQuestion, newAnswer);
      toast.success('Successfully taught the bot!');
      handleTeachMeClose();
      const data = await botAdminService.getLearnedResponses();
      setLearnedResponses(data.data.items);
    } catch (error) {
      console.error("Error teaching the bot:", error);
      toast.error('Failed to teach the bot.');
    }
  };

  return (
    <Box m="20px">
      <ToastContainer />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Teach Me" />
        <Box display="flex" alignItems="center">
          {!isXsDevices && (
            <>
              <Button
                variant="contained"
                sx={{
                  color: "#fcfcfc",
                  fontSize: isMdDevices ? "14px" : "10px",
                  fontWeight: "bold",
                  p: "10px 20px",
                  mt: "18px",
                  transition: ".3s ease",
                }}
                startIcon={<QuestionAnswer />}
                onClick={handleTeachMeOpen}
              >
                Teach Me
              </Button>
            </>
          )}
        </Box>
      </Box>

      <Dialog open={isTeachMeOpen} onClose={handleTeachMeClose}>
        <DialogTitle>Teach the Bot</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="question"
            label="Question"
            type="text"
            fullWidth
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
          />
          <TextField
            margin="dense"
            id="answer"
            label="Answer"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTeachMeClose}>Cancel</Button>
          <Button onClick={handleTeachMeSubmit} variant="contained">Teach</Button>
        </DialogActions>
      </Dialog>

      <Box mt="40px">
        <h2>Learned Responses</h2>
        {loadingLearnedResponses ? (
          <p>Loading learned responses...</p>
        ) : errorLoadingResponses ? (
          <p style={{ color: 'red' }}>{errorLoadingResponses}</p>
        ) : learnedResponses.length > 0 ? (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="learned responses table">
              <TableHead>
                <TableRow>
                  <TableCell>Question</TableCell>
                  <TableCell>Answer</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {learnedResponses.map((item, index) => (
                  <TableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {item.question}
                    </TableCell>
                    <TableCell>{item.answer}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <p>No learned responses yet.</p>
        )}
      </Box>
    </Box>
  );
};

export default TeachMe;
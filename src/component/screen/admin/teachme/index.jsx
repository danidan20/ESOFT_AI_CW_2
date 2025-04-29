import { useState } from "react";
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
} from "@mui/material";
import { Header } from "../../../components";
import { QuestionAnswer } from "@mui/icons-material";
import { tokens } from '../../../../theme/theme';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import botAdminService from "../../../../service/BotAdminService";

const TeachMe = () => { // Changed component name to TeachMe
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMdDevices = useMediaQuery("(min-width: 724px)");
  const isXsDevices = useMediaQuery("(max-width: 436px)");
  const [isTeachMeOpen, setIsTeachMeOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

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
    } catch (error) {
      console.error("Error teaching the bot:", error);
      toast.error('Failed to teach the bot.');
    }
  };


  return (
    <Box m="20px">
      <ToastContainer />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Teach Me" /> {/* Changed title to "Teach Me" */}
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
    </Box>
  );
};

export default TeachMe; 
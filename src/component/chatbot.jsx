import React, { useState, useRef, useEffect } from 'react';
import {
  TextField,
  Button,
  Paper,
  Typography,
  CircularProgress,
  Box,
  IconButton,
  useMediaQuery,
  createTheme,
  ThemeProvider,
  Fab,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import apiService from '../service/bot_service';
import { blueGrey } from '@mui/material/colors';
import { AnimatePresence, motion } from 'framer-motion';

const darkBlueTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: blueGrey,
    secondary: {
      main: blueGrey[700],
    },
    background: {
      default: blueGrey[900],
      paper: blueGrey[800],
    },
    text: {
      primary: '#fff',
    },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: blueGrey,
    secondary: {
      main: blueGrey[300],
    },
    background: {
      default: blueGrey[100],
      paper: '#fff',
    },
    text: {
      primary: blueGrey[900],
    },
  },
});

const StyledChatContainer = styled(motion.div)(({ theme, open }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(3),
  marginLeft: 'auto',
  marginRight: theme.spacing(3),
  maxWidth: '400px',
  width: '95%',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.palette.mode === 'dark' ? 'none' : '0px 4px 12px rgba(0, 0, 0, 0.2)',
  position: 'fixed',
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  transformOrigin: 'bottom right',
  [theme.breakpoints.down('sm')]: {
    maxWidth: '95%',
    left: theme.spacing(1),
    right: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    bottom: theme.spacing(1),
  },
}));

const StyledChatHeader = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(3),
  color: theme.palette.text.primary, 
  fontWeight: 700,
  letterSpacing: '0.5px',
}));

const StyledMessageArea = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflowY: 'auto',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.background.paper,
  maxHeight: '300px',
}));
const MessageBubble = styled(motion.div)(({ theme, role }) => ({
  padding: theme.spacing(1.5, 2),
  borderRadius: theme.shape.borderRadius * 2,
  maxWidth: '70%',
  marginBottom: theme.spacing(1.5),
  wordBreak: 'break-word',
  backgroundColor:
    role === 'user'
      ? theme.palette.primary.main
      : theme.palette.secondary.main,
  color: theme.palette.primary.contrastText,
}));

const StyledInputArea = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1.5),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius * 2,
    '& fieldset': {
      borderColor: theme.palette.mode === 'dark' ? blueGrey[600] : blueGrey[400],
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.light,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const StyledSendButton = styled(IconButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const Chatbot = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = prefersDarkMode ? darkBlueTheme : lightTheme;
  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', content: 'Hello! How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (open && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, open]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const aiResponseData = await apiService.sendMessageToAI(input);
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: aiResponseData.response,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleChatbot = () => {
    setOpen(!open);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          position: 'fixed',
          bottom: theme.spacing(3),
          right: theme.spacing(3),
          zIndex: 1000,
        }}
      >
        <AnimatePresence>
          {open && (
            <StyledChatContainer
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <StyledChatHeader variant="h6">AI Chatbot</StyledChatHeader>
                <IconButton onClick={toggleChatbot} size="small">
                  <CloseIcon />
                </IconButton>
              </Box>

              <StyledMessageArea component={Paper} elevation={0}>
                <AnimatePresence>
                  {messages.map((msg) => (
                    <Box
                      key={msg.id}
                      display="flex"
                      justifyContent={msg.role === 'user' ? 'flex-end' : 'flex-start'}
                      alignItems="flex-start"
                      mb={2}
                    >
                      {msg.role === 'assistant' && (
                        <Avatar sx={{ mr: 1, bgcolor: theme.palette.secondary.main }}>AI</Avatar>
                      )}
                      <MessageBubble
                        role={msg.role}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Typography variant="body2">{msg.content}</Typography>
                      </MessageBubble>
                      {msg.role === 'user' && (
                        <Avatar sx={{ ml: 1, bgcolor: theme.palette.primary.light }}>You</Avatar>
                      )}
                    </Box>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </StyledMessageArea>

              <StyledInputArea component={Paper} elevation={0}>
                <StyledTextField
                  fullWidth
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder="Type a message..."
                  disabled={loading}
                  variant="outlined"
                  size="small"
                />
                <StyledSendButton color="primary" onClick={handleSend} disabled={loading}>
                  {loading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
                </StyledSendButton>
              </StyledInputArea>
            </StyledChatContainer>
          )}
        </AnimatePresence>

        {!open && (
          <Fab color="primary" aria-label="chat" onClick={toggleChatbot}>
            <ChatIcon />
          </Fab>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default Chatbot;
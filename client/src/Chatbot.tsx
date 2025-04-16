import * as React from "react";
import { useState, useEffect, useRef } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import AppTheme from "./theme/AppTheme";
import DashboardNavBar from "./components/DashboardNavBar";
import { 
  Box, 
  Card, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Paper, 
  CircularProgress, 
  Avatar, 
  IconButton,
  Divider
} from "@mui/material";
import { 
  Send as SendIcon, 
  ArrowBack as ArrowBackIcon, 
  Code as CodeIcon, 
  Download as DownloadIcon 
} from "@mui/icons-material";
import axios from "axios";

interface Message {
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function Chatbot(props: { disableCustomTheme?: boolean }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [careerGoal, setCareerGoal] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const token = localStorage.getItem("github_token");

  // Initial bot message
  useEffect(() => {
    const welcomeMessage: Message = {
      content: "Hello! I'm your AI Tech Advisor. How can I help you with your tech career today?",
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  // Fetch user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (token) {
          const response = await axios.get("https://api.github.com/user", {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          const username = response.data.login;
          setUsername(username);
          
          const userResponse = await axios.get("http://localhost:8087/api/users/get-career-goal", {
            params: { uid: username }
          });
          
          const careerGoal = Array.isArray(userResponse.data) 
            ? userResponse.data[0]?.careerGoal 
            : userResponse.data.careerGoal;
          
          setCareerGoal(careerGoal);
          
          if (careerGoal) {
            const goalMessage: Message = {
              content: `I see your career goal is to become a ${careerGoal}. Feel free to ask me about technology recommendations or learning resources related to this path.`,
              sender: 'bot',
              timestamp: new Date(Date.now() + 1000) // Add 1 second to ensure it appears after welcome
            };
            setMessages(prev => [...prev, goalMessage]);
          }
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    
    fetchUserInfo();
  }, [token]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const navigateToRecommendations = () => {
    window.location.href = "/";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      // Send request to recommendation API
      const response = await axios.post('http://localhost:8001/recommend', {
        query: input,
        max_results: 3,
        temperature: 0.7,
        max_tokens: 200
      });
      
      // Add bot response with context
      const botResponse: Message = {
        content: response.data.recommendation,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      
    //   // If the response included context, add it as a separate message
    //   if (response.data.context && response.data.context.length > 0) {
    //     const contextMessage: Message = {
    //       content: `Based on: ${response.data.context.join(', ')}`,
    //       sender: 'bot',
    //       timestamp: new Date()
    //     };
    //     setMessages(prev => [...prev, contextMessage]);
    //   }
      
    } catch (error) {
      console.error("Error getting response:", error);
      const errorMessage: Message = {
        content: "Sorry, I encountered an error processing your request. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <DashboardNavBar />
      
      {/* Layout Container */}
      <Box sx={{ display: "flex", flexDirection: "column", mt: 8, pt: 2, backgroundColor: 'transparent', px: 4, height: "calc(100vh - 80px)" }}>
        
        {/* Header */}
        <Box 
          sx={{ 
            p: 2, 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between",
            backgroundColor: "#e8f4fc",
            borderRadius: 0,
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
          }}
        >
          <IconButton 
            color="primary" 
            onClick={navigateToRecommendations}
            sx={{ mr: 1 }}
          >
            <ArrowBackIcon />
          </IconButton>
          
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
            AI Tech Advisor
          </Typography>
          
          <Avatar 
            sx={{ 
              bgcolor: '#0088FE', 
              width: 40, 
              height: 40 
            }}
          >
            <CodeIcon />
          </Avatar>
        </Box>
        
        {/* Chat Container */}
        <Card 
          sx={{ 
            p: 2, 
            mt: 3,
            mb: 3, 
            borderRadius: 3, 
            boxShadow: 3, 
            backgroundColor: "#f5f5f5", 
            width: "100%",
            flexGrow: 1,
            display: "flex",
            flexDirection: "column"
          }}
        >
          {/* Messages Area */}
          <Box 
            sx={{ 
              flexGrow: 1, 
              overflow: "auto", 
              mb: 2,
              p: 2
            }}
          >
            {messages.map((message, index) => (
              <Box 
                key={index} 
                sx={{ 
                  display: "flex", 
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  mb: 2
                }}
              >
                {message.sender === 'bot' && (
                  <Avatar 
                    sx={{ 
                      bgcolor: '#0088FE', 
                      mr: 1,
                      alignSelf: 'flex-end'
                    }}
                  >
                    <CodeIcon />
                  </Avatar>
                )}
                
                <Paper 
                  sx={{ 
                    p: 2, 
                    maxWidth: '70%',
                    backgroundColor: message.sender === 'user' ? '#0088FE' : '#ffffff',
                    color: message.sender === 'user' ? '#ffffff' : 'inherit',
                    borderRadius: message.sender === 'user' 
                      ? '20px 20px 5px 20px' 
                      : '20px 20px 20px 5px'
                  }}
                >
                  <Typography variant="body1">
                    {message.content}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      display: 'block', 
                      textAlign: message.sender === 'user' ? 'right' : 'left',
                      mt: 1,
                      opacity: 0.7
                    }}
                  >
                    {formatTime(message.timestamp)}
                  </Typography>
                </Paper>
                
                {message.sender === 'user' && (
                  <Avatar 
                    sx={{ 
                      ml: 1,
                      alignSelf: 'flex-end'
                    }}
                  >
                    {username?.charAt(0)?.toUpperCase() || 'U'}
                  </Avatar>
                )}
              </Box>
            ))}
            
            {/* Loading indicator */}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#0088FE', mr: 1 }}>
                  <CodeIcon />
                </Avatar>
                <Paper sx={{ p: 2, backgroundColor: '#ffffff', borderRadius: '20px 20px 20px 5px' }}>
                  <CircularProgress size={20} />
                </Paper>
              </Box>
            )}
            
            {/* Ref for auto-scroll */}
            <div ref={messagesEndRef} />
          </Box>
          
          <Divider />
          
          {/* Input Area */}
          <Box sx={{ display: "flex", pt: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Ask about tech stacks, career recommendations, or learning resources..."
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              multiline
              maxRows={3}
              sx={{ 
                mr: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 4
                }
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              sx={{ 
                borderRadius: 4, 
                px: 3,
                backgroundColor: '#0088FE',
                '&:hover': {
                  backgroundColor: '#0066cc'
                }
              }}
            >
              <SendIcon />
            </Button>
          </Box>
        </Card>
        
      </Box>
    </AppTheme>
  );
}
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';  // Import cors
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3001;
const messagesFilePath = path.join(__dirname, './messages.json');

// Use CORS middleware
app.use(cors({
  origin: 'http://localhost:3000',  // Allow requests from React frontend
}));

app.use(bodyParser.json());

// Load existing messages
const loadMessages = () => {
  if (fs.existsSync(messagesFilePath)) {
    const data = fs.readFileSync(messagesFilePath, 'utf-8');
    return JSON.parse(data);
  }
  return [];
};

// Save messages
const saveMessages = (messages: string[]) => {
  fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2));
};

// Get messages
app.get('/messages', (req, res) => {
  const messages = loadMessages();
  res.json(messages);
});

// Post a new message
app.post('/messages', (req, res) => {
  const newMessage = req.body.message as string;
  if (!newMessage) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const messages = loadMessages();
  messages.push(newMessage);
  saveMessages(messages);

  res.status(201).json({ message: 'Message saved' });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

const express = require('express');
const app = express();
const path = require('path');

// Middleware to parse incoming JSON requests
app.use(express.json()); // For POST requests with JSON payloads
app.use(express.static('public')); // Serve static files from the "public" folder

// Simulated message store
let messages = [];

// Serve the HTML file when accessing the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "myApp2.html"));
});

// Long Polling route to check for new messages
app.get('/new-messages', (req, res) => {
    if (messages.length > 0) {
        // If there are messages, send them immediately
        res.json(messages);
        messages = []; // Clear messages after sending
    } else {
        // If no messages, keep the connection open (simulate long polling)
        const interval = setInterval(() => {
            if (messages.length > 0) {
                res.json(messages); // Respond with messages
                messages = []; // Clear messages
                clearInterval(interval); // End the connection after sending
            }
        }, 1000); // Check every second for new messages
    }
});

// POST route to accept custom message from the client
app.post('/send-message', (req, res) => {
    const newMessage = req.body.message; // Get the message from the request body
    if (newMessage) {
        messages.push({ text: newMessage });
        res.send('Message sent');
    } else {
        res.status(400).send('No message provided');
    }
});

app.listen(3030, () => {
    console.log('Server running on http://localhost:3030');
});

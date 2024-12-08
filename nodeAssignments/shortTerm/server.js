const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

app.use(cors());
app.use(bodyParser.json());

let messages = []; // Store chat messages

// Serve the chat HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "chatApp.html"));
});

// Endpoint to get messages
app.get("/messages", (req, res) => {
    const since = parseInt(req.query.since || "0", 10); // Get messages after this timestamp
    const newMessages = messages.filter(msg => msg.timestamp > since);
    res.json({ messages: newMessages });
});

// Endpoint to post a new message
app.post("/messages", (req, res) => {
    const { username, message } = req.body;
    if (!username || !message) {
        return res.status(400).json({ error: "Username and message are required" });
    }

    const timestamp = Date.now();
    messages.push({ username, message, timestamp });

    res.status(201).json({ success: true });
});

// Start the server
app.listen(3030, () => {
    console.log("Server is running on http://localhost:3030");
});


//Short Polling: The client repeatedly checks the server for new data.

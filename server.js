const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');


const app = express();
const port = 8900; // Write here your designated port

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

let latestData = {
    temperature: null,
    humidity: null,
    battery: null,
    motion: 'Unknown'
};

// Alert state (default is OFF)
let alertState = false;

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'sender@gmail.com',
        pass: 'Your_generated_pass',
    },
});

// Function to send email alerts
const sendEmailAlert = (message) => {
    const mailOptions = {
        from: 'sender@gmail.com',
        to: 'reception@gmail.com',
        subject: 'Sensor Alert',
        text: "This is your alert message, motion detected",
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

// Endpoint to retrieve the alert state
app.get('/alert-state', (req, res) => {
    res.json({ alertState });
});

// Endpoint to update the alert state
app.post('/alert-state', (req, res) => {
    const { state } = req.body;
    if (typeof state === 'boolean') {
        alertState = state;
        res.json({ message: 'Alert state updated', alertState });
    } else {
        res.status(400).json({ error: 'Invalid state value' });
    }
});

// Define a POST route to receive and process sensor data
app.post('/', (req, res) => {
    if (req.body && req.body.data) {
        try {
            // Convert Base64 to Buffer
            const buffer = Buffer.from(req.body.data, 'base64');
            const hex = buffer.toString('hex');
            console.log('Raw data (Hex):', hex);

            if (hex.length === 22) {
                // Extract temperature, humidity, battery data from the hex string
                const tempHex = hex.substring(4, 8); // 2 bytes after '0367'
                const humidityHex = hex.substring(12, 14); // 1 byte after '0468'
                const batteryHex = hex.substring(18, 22); // 2 bytes after '00ff'

                const tempDec = parseInt(tempHex, 16);
                const humidityDec = parseInt(humidityHex, 16);
                const batteryDec = parseInt(batteryHex, 16);

                // Calculate the values
                latestData.temperature = tempDec * 0.1;
                latestData.humidity = humidityDec * 0.5;
                latestData.battery = batteryDec * 0.01;

            } else if (hex.length === 6) {
                // Motion detection
                const motionpatternIndex = hex.indexOf('0a00');
                if (motionpatternIndex !== -1) {
                    const motionHex = hex.slice(motionpatternIndex + 4, motionpatternIndex + 6); // 1 byte after '0a00'
                    const motionDecimal = parseInt(motionHex, 16);
                    latestData.motion = motionDecimal === 0 ? 'No motion' : 'Motion detected';

                    // Send email if motion is detected
                    if (latestData.motion === 'Motion detected' && alertState) {
                        sendEmailAlert('Motion detected by the sensor!');
                    }
                } else {
                    latestData.motion = 'Unknown';
                }
            } else {
                console.log('Hex string is not enough, skipping processing.');
            }
            res.status(200).json({ message: 'Data processed successfully', latestData });

        } catch (error) {
            console.error('Error converting data from Base64 to Hex:', error);
            res.status(500).send('Error processing data');
        }
    } else {
        console.log('Data field not found in request body');
        res.status(400).send('Bad Request');
    }
});

// Endpoint to provide the latest sensor data
app.get('/data', (req, res) => {
    res.json(latestData);
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
const dir = './uploads';
if (!fs_1.default.existsSync(dir)) {
    fs_1.default.mkdirSync(dir);
}
const privateKeyPath = '/etc/letsencrypt/live/api.eogmethanedetection.us/privkey.pem';
const certificatePath = '/etc/letsencrypt/live/api.eogmethanedetection.us/cert.pem';
const caBundlePath = '/etc/letsencrypt/live/api.eogmethanedetection.us/chain.pem';
const sslOptions = {
    key: fs_1.default.readFileSync('/home/rohanchugh14/sslcert/privkey.pem'),
    cert: fs_1.default.readFileSync('/home/rohanchugh14/sslcert/fullchain.pem')
};
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const httpsServer = https_1.default.createServer(sslOptions, app);
// add cors middleware
const port = 3001;
app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});
// Set up multer to handle file uploads
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
// Define the endpoint
app.post('/upload', upload.fields([
    { name: 'weather', maxCount: 1 },
    { name: 'sensor', maxCount: 1 }
]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req);
    console.log(req.files);
    console.log("made it here");
    // Assuming files are named 'file1.csv' and 'file2.csv'
    const file1 = req.files.weather[0].path;
    const file2 = req.files.sensor[0].path;
    // Call your Python script here
    const pythonScriptPath = './src/script.py';
    const pythonProcess = (0, child_process_1.spawn)('python3', [pythonScriptPath, file1, file2]);
    let output = "";
    pythonProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
        output += data;
        // Here you would ideally send this data to the client.
        // For real-time progress updates, consider using websockets or server-sent events.
    });
    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        // Handle error data
    });
    pythonProcess.on('close', (code) => {
        console.log(`Child process exited with code ${code}`);
        // Finalize the response once the script has finished running
        if (code === 0) {
            // Send the output to the client here
            // add output to res
            res.send({ output });
            // res.send('Files processed successfully.');
        }
        else {
            res.status(500).send('An error occurred while processing files.');
        }
    });
}));
// Start the server
httpsServer.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});

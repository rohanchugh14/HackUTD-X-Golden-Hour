import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import { spawn } from 'child_process';
import fs from 'fs';
import https from 'https'
import {v4 as uuidv4} from 'uuid'


const dir = './uploads';

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}


const sslOptions = {
  key: fs.readFileSync('/home/rohanchugh14/sslcert/privkey.pem'),
  cert: fs.readFileSync('/home/rohanchugh14/sslcert/fullchain.pem')
};


const app = express();
const jobs = new Map();
app.use(cors());
const httpsServer = https.createServer(sslOptions, app);
// add cors middleware
const port = 3001;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from the backend!');
});

// Set up multer to handle file uploads
const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, 'uploads/');
  },
  filename: function (req: any, file: any, cb: any) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});
const upload = multer({ storage: storage });

// Define the endpoint
app.post('/upload', upload.fields([
  { name: 'weather', maxCount: 1 },
  { name: 'sensor', maxCount: 1 }
]), async (req: any, res: Response) => {
  

    // Assuming files are named 'file1.csv' and 'file2.csv'
    const file1 = req.files.weather[0].path;
    const file2 = req.files.sensor[0].path;
    const jobID = file1.filename; 
    // Call your Python script here
    const pythonScriptPath = './src/script.py';
    const pythonProcess = spawn('python3', [pythonScriptPath, file1, file2]);
    let output = ""
    pythonProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
      output += data
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
        res.send({output})
        // res.send('Files processed successfully.');
      } else {
        res.status(500).send('An error occurred while processing files.');
      }
    });
});

// Start the server
httpsServer.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});

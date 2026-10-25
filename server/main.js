import cookieParser from 'cookie-parser';
import cors from 'cors';
import dns from "dns";
import dotenv from "dotenv";
import express from 'express';
import { connectDB } from './src/config/db.js';
import authRouter from './src/routes/auth.route.js';
import morgan from 'morgan';
dotenv.config()
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const port = process.env.PORT || 5000
const app = express()

app.use(morgan("dev"))
app.use(cors({
    origin:["http://localhost:5173","*"],
    // origin tells the browser which website (protocol + host + port) is allowed to access the backend's response.
    credentials:true
//     Credentials are things that identify or authenticate the user, such as: Cookies (most common),  HTTP Authentication headers (Basic Auth, Digest Auth) ,TLS client certificates (rare)
}))

app.use(express.json())
app.use(cookieParser())
// reads the cookies sent by the browser and makes them available in req.cookie

app.use('/api',authRouter)

app.listen(port,()=>{
    connectDB()
    console.log(`the port is lister on ${port}`);
    
})

// express.json()=> req.body
// multer => req.file 
// checkAuth=> req.userId
// cookieParser => res.cookie

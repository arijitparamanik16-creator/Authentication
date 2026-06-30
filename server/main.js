import express from 'express'
import dotenv from "dotenv"
import { connectDB } from './config/db.js'
dotenv.config()
import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'

const port = process.env.PORT || 5000
const app = express()
app.use(cors({
    origin:"http://localhost:5173",
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

import express from 'express'
import { Router } from 'express'
import { getUserData, login, logOut, signUp } from '../controllers/auth.controller.js'
import { upload } from '../middlewares/multer.js'
import { checkAuth } from '../middlewares/checkAuth.js'

const authRouter = express(Router())

authRouter.get('/',(req,res)=>{
    res.send("welcome to authentication Backend project")
})

// route, middleware , function 
authRouter.post('/signUp',upload.single("profileImage"), signUp)
// single("profileImage") tells Multer to accept only one uploaded file from the form field named "profileImage".
authRouter.post('/login', login)
authRouter.get('/logOut', logOut)
authRouter.get('/getuserData',checkAuth, getUserData)


export default authRouter
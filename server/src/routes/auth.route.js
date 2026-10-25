import express from 'express'
import { Router } from 'express'
import {  signUp,logOut , login,refreshToken, logOutAll, verifyEmail, getUserData} from '../controllers/auth.controller.js'
import { upload } from '../middlewares/multer.js'
import {checkAuthRefresh, checkAuthAccess} from '../middlewares/checkAuth.js'
const authRouter = express(Router())

authRouter.get('/',(req,res)=>{
    res.send("welcome to authentication Backend project")
})

// route, middleware , function 
authRouter.post('/signup',upload.single("profileImage"), signUp)
authRouter.get('/refreshtoken',checkAuthRefresh, refreshToken)
// single("profileImage") tells Multer to accept only one uploaded file from the form field named "profileImage".
authRouter.post('/login', login)
authRouter.get('/logout', logOut)
authRouter.get('/logoutall', checkAuthRefresh, logOutAll)
authRouter.post('/verifyemail', verifyEmail)
authRouter.get('/getuserdata',checkAuthAccess, getUserData)

export default authRouter

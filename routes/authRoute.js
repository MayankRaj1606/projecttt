import express from 'express'
import { forgotPasswordController, registerController, sendOtpController, updateProfileController } from '../controllers/authController.js'
import { loginController, testController } from '../controllers/authController.js'
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js'

//router object
const router = express.Router()

//routing
//Register || METHOD POST
router.post('/register', registerController)


//LOGIN || POST
router.post('/login', loginController)

// Forgot Password
router.post('/forgot-password', forgotPasswordController)

//send-otp
router.post('/send-otp', sendOtpController);

//test routes
router.get('/test', requireSignIn, isAdmin, testController)

//protected user route auth
router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
})

//protected Admin-Dasboard/route
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
})

//update profile
router.put("/profile", requireSignIn, updateProfileController);


export default router;
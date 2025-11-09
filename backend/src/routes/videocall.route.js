import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { endVideoCall, getVideoCall, leaveVideoCall, postCreateVideoCall } from '../controllers/videocall.controller.js';


const doSomething = () => console.log("do something")

const router = express.Router()

router.use(protectRoute)

router.post('/create', postCreateVideoCall )
router.post('/leave',leaveVideoCall)
router.post('/end', endVideoCall)

router.get('/join/:callId', getVideoCall)
// router.get('/:callId', );


export default router;
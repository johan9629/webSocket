import { Router } from "express";

const router = Router();

router.get('/chat', (req, res) => { 
    const data = {};
    res.render('chat', data);
});  

export default router;
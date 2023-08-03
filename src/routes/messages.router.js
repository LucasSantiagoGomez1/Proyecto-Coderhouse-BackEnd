import { Router } from "express";
import messagesController from "../controllers/messages.controller.js";

let router = Router()

router.get("/", messagesController.getMessages)

router.post("/", messagesController.addMessage)

export default router
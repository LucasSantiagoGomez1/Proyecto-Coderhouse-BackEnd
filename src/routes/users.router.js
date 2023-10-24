import { Router } from "express"
import usersController from "../controllers/users.controller.js"
import passport from "passport"
import uploader from "../middlewares/multer.js"
import { adminRoleAuth } from "./middlewares/roles.middlewares.js"

const router = Router()

const multerFields = [
  {name: 'profiles'},
  {name: 'products'},
  {name: 'identification', maxCount: 1},
  {name: 'address', maxCount: 1},
  {name: 'accountState', maxCount: 1}
]

router.post(
  '/premium/:uid',
  passport.authenticate('jwt', { session: false }),
  usersController.changeRole
)

router.post(
  '/:uid/documents',
  uploader.fields(multerFields),
  usersController.updateDocuments
)

router.get('/', usersController.getAllUsers)

router.delete(
  '/',
  passport.authenticate('jwt', {session: false}),
  adminRoleAuth,
  usersController.deleteInactiveUsers
)

router.delete(
  '/:uid',
  passport.authenticate('jwt', {session: false}),
  adminRoleAuth,
  usersController.deleteUser
)

export default router
import { Router } from 'express';
import passport from 'passport';
import viewsController from '../controllers/views.controller.js';

const router = Router();

router.get('/', viewsController.home)

router.get('/realtimeproducts', viewsController.realTimeProducts)

router.get('/chat', viewsController.chat)

router.get('/products', passport.authenticate('jwt', { session: false }), viewsController.products)

router.get('/carts/:cid', viewsController.cart)

router.get('/login', viewsController.login)

router.get('/register', viewsController.register)

router.get(
  '/resetPassword',
  passport.authenticate('jwtRequestPassword', {session: false, failureRedirect: 'requestResetPassword'}),
  viewsController.resetPassword
)

router.get('/requestResetPassword', viewsController.requestResetPassword)

export default router;
import { Router } from "express";
import __dirname from "../utils.js";
import cartsController from "../controllers/carts.controller.js";

const router = Router();

router.get('/', cartsController.getCarts)

router.get('/:cid', cartsController.getCartById)

router.post('/', cartsController.createCart)

router.post('/:cid/product/:pid', cartsController.addProductToCart)

router.delete('/:cid/products/:pid', cartsController.deleteProductFromCart)

router.delete('/:cid', cartsController.deleteAllProductsFromCart)

router.put('/:cid', cartsController.replaceProductsFromCart)

router.put('/:cid/products/:pid', cartsController.updateProductQuantityFromCart)

export default router
import express from 'express'
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js'
import {
    createProductController, deleteProductController, getAllUsersController, getProductController,
    getSingleProductController, productCountController, productFiltersController, productListController, productPhotoController,
    updateProductController
} from '../controllers/productController.js'
import formidable from 'express-formidable'

const router = express.Router()

//routes
router.post('/create-product',  formidable(), createProductController)

router.put('/update-product/:pid', requireSignIn, isAdmin, formidable(), updateProductController)

router.get('/get-product', getProductController)


//fetching single product
router.get("/get-product/:slug", getSingleProductController)


router.get('/product-photo/:pid', productPhotoController)



//delete product
router.delete("/delete-product/:pid", requireSignIn,  deleteProductController);


//filter product
router.get("/product-filters" , productFiltersController)

//product count
router.get("/product-count", productCountController);

//product per page
router.get("/product-list/:page", productListController);


//users data
router.get("/get-users", getAllUsersController);

export default router

import { Router } from 'express';
import fileUpload from 'express-fileupload';
import {validUpdate,validLiquor } from '../helpers/validations';
import Liquor from '../controllers/liquors';
import { checkToken } from '../helpers/auth';
const router = Router();
router.use(fileUpload({
    useTempFiles: true,
  }));
router.get('/Orders',Liquor.getOrderedLiquor);
router.post('/',checkToken, validLiquor, Liquor.addLiquor);
router.post('/:liquorID', checkToken, Liquor.orderLiquor);
router.patch('/:liquorID', checkToken, validUpdate, Liquor.updateLiquor);
router.patch('/confirm/:liquorID', Liquor.confirmOrder);
router.delete('/:liquorID', checkToken, Liquor.deleteLiquor);
router.get('/',Liquor.getAllLiquors);
router.get('/owner/',checkToken, Liquor.getAllLiquors);
router.get('/liquor/:beer_ID', Liquor.getOneLiquor);
router.get('/beers/:category_ID',Liquor.getAllLiquors)

export default router;
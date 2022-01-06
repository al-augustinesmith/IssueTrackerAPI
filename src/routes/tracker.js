import { Router } from 'express';
import fileUpload from 'express-fileupload';
import {validUpdate,validIssue } from '../helpers/validations';
import Issues from '../controllers/issues';
import { checkToken } from '../helpers/auth';
const router = Router();
router.use(fileUpload({
    useTempFiles: true,
  }));
router.post('/',checkToken, validIssue, Issues.addIssue);
router.patch('/:issueID', checkToken, validUpdate, Issues.updateIssue);
router.delete('/:issueID', checkToken, Issues.deleteIssue);
// router.get('/',Issues.getAllIssues);

export default router;
import { Router } from 'express';
import fileUpload from 'express-fileupload';
import {validUpdate,validIssue } from '../helpers/validations';
import Issue from '../controllers/issues';
import { checkToken } from '../helpers/auth';
const router = Router();
router.use(fileUpload({
    useTempFiles: true,
  }));
router.post('/',checkToken, validIssue, Issue.addIssue);
router.patch('/:issueID', checkToken, validUpdate, Issue.updateIssue);
router.patch('/confirm/:IssueID', Issue.confirmOrder);
router.delete('/:issueID', checkToken, Issue.deleteIssue);
router.get('/',Issue.getAllIssues);

export default router;
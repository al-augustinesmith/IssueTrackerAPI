import { Router } from "express";
import fileUpload from "express-fileupload";
import { validUpdate, validIssue, validProject } from "../helpers/validations";
import Track from "../controllers/track";
import { checkToken } from "../helpers/auth";
const router = Router();
router.use(
  fileUpload({
    useTempFiles: true,
  })
);
router.post("/project", checkToken, validProject, Track.addProject);
router.post("/issue", checkToken, validIssue, Track.addIssue);
router.patch("/:issueID", checkToken, validUpdate, Track.updateIssue);
router.delete("/:issueID", checkToken, Track.deleteIssue);
// router.get('/',Issues.getAllIssues);

export default router;

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
router.patch("issue/:issueID", checkToken, validUpdate, Track.updateIssue);
router.delete("issue/:issueID", checkToken, Track.deleteIssue);
router.get("/issues", Track.getAllIssues);

export default router;

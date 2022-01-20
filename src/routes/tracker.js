import { Router } from "express";
import fileUpload from "express-fileupload";
import { getRecentProjects } from "../config/database";
import { validUpdate, validIssue, validProject } from "../helpers/validations";
import Track from "../controllers/track";
import { checkToken } from "../helpers/auth";
const router = Router();
router.use(
  fileUpload({
    useTempFiles: true,
  })
);
router.post("/issuetojira", checkToken, Track.sendToJira);
router.post("/issue", checkToken, validIssue, Track.addIssue);
router.patch("issue/:issueID", checkToken, validUpdate, Track.updateIssue);
router.delete("issue/:issueID", checkToken, Track.deleteIssue);
router.get("/issues", Track.getAllIssues);
router.get("/projects", getRecentProjects);

export default router;

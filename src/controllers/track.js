import { serverResponse, serverError } from "../helpers/Response";
import imageUpload from "../middleware/cloudinary";
import db from "../database";
import { sendIssueToJira } from "../config/database";
const Track = {
  async addIssue(req, res) {
    try {
      const { id } = req.tokenData;
      let screenshot =
        req.files != (null || undefined)
          ? await imageUpload(req.files.screenshot)
          : req.body.screenshot || "";
      const { title, description, projectID } = req.body;
      const table = "issues";
      const columns = `reporter, title, description,projectID,screenshot`;
      const condition = `WHERE reporter ='${id}' AND projectID='${projectID}' AND title='${title}' AND description='${description}'`;
      const values = `'${id}','${title}', '${description}','${projectID}', '${screenshot}'`;
      db.dataCreate(res, table, columns, values, condition)
        .then((response) => {
          return response;
        })
        .catch((err) => {
          return serverError(res, err);
        });
    } catch (err) {
      return serverError(res, err);
    }
  },
  async sendToJira(req, res) {
    try {
      const { title, description, projectID } = req.body;
      return sendIssueToJira(res, title, description, projectID);
    } catch (err) {
      return serverError(res, err);
    }
  },
  async updateIssue(req, res) {
    try {
      let screenshot =
          req.files != (null || undefined)
            ? await imageUpload(req.files.screenshot)
            : req.body.screenshot || "",
        columns = null,
        i_name = null,
        i_description = null,
        i_screenshot = null;
      const { id, isadmin } = req.tokenData;
      const { issueID } = req.params;
      const { title, description } = req.body;
      if (process.env.NODE_ENV === "test") {
        columns = `title='${title}', description= ${description}, screenshot='${screenshot}'`;
      } else {
        i_name = title ? `title='${title}',` : "";
        i_description = description ? `description='${description}',` : "";
        i_screenshot = `screenshot='${screenshot}'`;
        columns = `${i_name} ${i_description} ${i_screenshot}`;
      }
      db.updateIssue(res, columns, id, isadmin, issueID)
        .then((response) => {
          return response;
        })
        .catch((err) => {
          return serverError(res);
        });
    } catch (err) {
      return serverError(res);
    }
  },
  deleteIssue(req, res) {
    try {
      const { id, isadmin } = req.tokenData;
      const { issueID } = req.params;
      db.deleteIssue(res, id, isadmin, issueID)
        .then((response) => {
          return response;
        })
        .catch((err) => {
          return serverError(res);
        });
    } catch (err) {
      return serverError(res);
    }
  },
  getAllIssues(req, res) {
    try {
      const columns = `I.id,I.title,I.description, I.screenshot,I.projectID,I.idate, u.first_name,u.last_name`;
      let condition = `WHERE u.id=I.reporter`;
      if (req.tokenData) {
        const { id } = req.tokenData;
        condition = `WHERE u.id=I.reporter AND u.id = '${id}'`;
      }
      db.findIssue(columns, condition)
        .then((response) => {
          if (!response.length)
            return serverResponse(
              res,
              404,
              ...["status", 404, "message", `Data not fund.`]
            );

          return serverResponse(
            res,
            200,
            ...["status", 200, "message", "Ok", "data", response]
          );
        })
        .catch((err) => {
          return serverError(res);
        });
    } catch (err) {
      return serverError(res);
    }
  },
};

export default Track;

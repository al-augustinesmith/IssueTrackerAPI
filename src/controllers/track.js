import { serverResponse, serverError } from "../helpers/Response";
import imageUpload from "../middleware/cloudinary";
import db from "../database";
const Track = {
  async addProject(req, res) {
    try {
      const { id } = req.tokenData;
      const { title, description } = req.body;
      const table = "projects";
      const columns = `owner, title, description,people`;
      const condition = `WHERE owner ='${id}' AND title='${title}' AND description='${description}'`;
      const values = `'${id}','${title}', '${description}',ARRAY[${id}]`;
      db.iCreate(res, table, columns, values, condition)
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
  async addIssue(req, res) {
    try {
      const { id } = req.tokenData;
      let screenshot =
        req.files != (null || undefined)
          ? await imageUpload(req.files.screenshot)
          : req.body.screenshot || "";
      const { title, description, project } = req.body;
      const table = "issues";
      const columns = `reporter, title, description,project,screenshot`;
      const condition = `WHERE reporter ='${id}' AND project='${project}' AND title='${title}' AND description='${description}'`;
      const values = `'${id}','${title}', '${description}','${project}', '${screenshot}'`;
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
      const columns = `I.id,I.title,I.description, I.screenshot,p.title as project_name, u.email AS reporter_email`;
      let condition = `WHERE u.id=I.reporter and I.project=p.id`;
      if (req.tokenData) {
        const { id } = req.tokenData;
        condition = `WHERE u.id=I.reporter and I.project=p.id AND u.id = '${id}'`;
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

import fetch from "node-fetch";
import "dotenv/config";
import { serverResponse, serverError } from "../helpers/Response";

const MAIN_URL = process.env.JIRA_URL;
const HEADERS = {
  Authorization: `Basic ${Buffer.from(process.env.JIRA_KEY).toString(
    "base64"
  )}`,
  Accept: "application/json",
  "Content-Type": "application/json",
};
const DB =
  process.env.NODE_ENV === "development"
    ? process.env.DB_DEV_URL
    : process.env.DB_URL;

const sendIssueToJira = async (res,title, description, ID) => {
  const Data = {
    fields: {
      project: {
        id: ID,
      },
      summary: title,
      issuetype: {
        name: "Bug",
      },
      description: {
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [
              {
                text: description,
                type: "text",
              },
            ],
          },
        ],
      },
    },
  };
  await fetch(`${MAIN_URL}/rest/api/3/issue`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(Data),
  })
    .then((response) => {
      console.log(`Response: ${response.status} ${response.statusText}`);
      return response.text();
    })
    .then((text) => {
      return serverResponse(
        res,
        200,
        ...["status", 200, "message", "Ok", "data", JSON.parse(text)]
      );
    })
    .catch((err) => console.error(err));
};

const getRecentProjects = async (req, res) => {
  fetch(`${MAIN_URL}/rest/api/3/project?expand=description`, {
    method: "GET",
    headers: HEADERS,
  })
    .then((response) => {
      return response.text();
    })
    .then((text) => {
      return serverResponse(
        res,
        200,
        ...["status", 200, "message", "Ok", "data", JSON.parse(text)]
      );
    })
    .catch((err) => console.error(err));
};

export { DB, sendIssueToJira, getRecentProjects };

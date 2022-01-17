import fetch from "node-fetch";
import "dotenv/config";
import { Version2Client } from "jira.js";
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

const sendIssueToJira = async (title, description) => {
  const Data = {
    fields: {
      project: {
        key: "IT",
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
    .then((text) => console.log(text))
    .catch((err) => console.error(err));
};
const createProjectToJira = async (title, description) => {
  const Data = {
    name: title,
    description: description,
    key: title.substring(0, 2).toUpperCase(),
  };
  await fetch(`${MAIN_URL}/rest/api/3/project`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(Data),
  })
    .then((response) => {
      console.log(`Response: ${response.status} ${response.statusText}`);
      return response.text();
    })
    .then((text) => console.log(text))
    .catch((err) => console.error(err));
};
const getRecentProjects = () => {
  fetch(`${MAIN_URL}/rest/api/3/project/recent`, {
    method: "GET",
    headers: HEADERS,
  })
    .then((response) => {
      console.log(`Response: ${response.status} ${response.statusText}`);
      return response.text();
    })
    .then((text) => text)
    .catch((err) => console.error(err));
};

export { DB, sendIssueToJira, getRecentProjects, createProjectToJira };

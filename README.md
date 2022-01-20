# Issuer Tracker API
Track issue online where clients can report an issue on the project so that it can be fixed by developer ASAP.

#### Technologies
This Project was created with:
- NodeJS - A javascript server-side engine
- Express Library - A library built on Node JS
- Cloudinary - A file storage platform
- Jira - A project management platform

#### Tools and Modules
The tools and modules employed in this project are:
- Git
- yarn
- JSON Web Token
- express-fileupload
- bcryptjs
- JOI validation module

#### Development Setup
To start this project, install the required modules and dependencies locally using yarn:
##### Usage Example
##### git Clone this [Repository](https://github.com/nccharles/Pro-Lite-API.git)
```
yarn
yarn run dev:db:migrate
yarn run dev
```


#### API URL
- https://i-track.herokuapp.com/


#### User Access
Signing into the Isue Tracker platform will require a login details as:
- email: charles@example.com
- password: Passmein!

#### How to get a local copy and Use
**Clone repository**
- copy the link to the project from github website
- create a folder on local machine
- cd in to the folder and call a git init
- git clone repository
- yarn to install development dependencies


#### Endpoints
|Verb    | Endpoint                                                         | Description            |
|--------|------------------------------------------------------------------|------------------------|
|GET     |https://i-track.herokuapp.com/                                    | Welcome Endpoint       |
|POST    |https://i-track.herokuapp.com/api/v3/issue                        | report an issue        |
| GET    |https://i-track.herokuapp.com/api/v3/issues                       | Get all issues         |
| DELETE |https://i-track.herokuapp.com/api/v3/issue/{id}                   | Delete an issue        |
| GET    |https://i-track.herokuapp.com/api/v3/projects                     | Get all Projects       |
| PATCH  |https://i-track.herokuapp.com/api/v3/issue/{id}                   | Update an issue        |
| POST   |https://i-track.herokuapp.com/api/v3/auth/invite                  | Invite User            |
| POST   |https://i-track.herokuapp.com/api/v3/auth/signup/{key}            | Endpoint of Signup.    |
| POST   |https://i-track.herokuapp.com/api/v3/auth/signin                  | Endpoint of Sign in    |
| GET    |https://i-track.herokuapp.com/api/v3/auth/user                    | Get Invited User       |
| PATCH  |https://i-track.herokuapp.com/api/v3/auth/user                    | Update User            |


#### Contributor(s)
- Charles NDAYISABA
- Arsitote Katty

#### Author(s)
- Charles NDAYISABA
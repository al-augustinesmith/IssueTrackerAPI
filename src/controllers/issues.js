import { serverResponse, serverError } from "../helpers/Response";
import imageUpload from "../middleware/cloudinary";
import db from '../database'
const Issues = {
    async addIssue(req, res) {
        try {
            const { id } = req.tokenData;
            let image_url = req.files != (null || undefined) ? await imageUpload(req.files.image_url) : req.body.image_url
            const {
                issue_name,category, about
            } = req.body;
            const table = 'issue'
            const columns = `owner, issue_name,category, about,image_url`;
            const condition = `WHERE owner ='${id}' AND issue_name='${issue_name}' AND category='${category}' AND about='${about}'`;
            const values = `'${id}','${issue_name}','${category}', '${about}', '${image_url}'`;
            db.lCreate(res, table, columns, values, condition)
                .then(response => {
                    return response
                }).catch(err => {
                    return serverError(res,err);
                });
        } catch (err) {
            return serverError(res,err);
        }
    },
    async updateIssue(req, res) {
        try {
            let image_url = req.files != (null || undefined) ? await imageUpload(req.files.image_url) : req.body.image_url,
                columns = null,
                l_name = null,
                l_price = null,
                l_category = null,
                l_about = null,
                l_image_url = null;
            const { id, isadmin } = req.tokenData;
            const { issueID } = req.params;
            const {
                issue_name, price, category, about
            } = req.body;
            if (process.env.NODE_ENV === 'test') {
                columns = `issue_name='${issue_name}', category='${category}', address='${address}', about= ${about}, image_url='${image_url}'`;
            } else {
                l_name = issue_name ? `issue_name='${issue_name}',` : "";
                l_category = category ? `category='${category}',` : "";
                l_about = about ? `about='${about}',` : "";
                l_image_url = image_url ? `image_url='${image_url}'` : "";
                columns = `${l_name} ${l_category} ${l_about} ${l_image_url}`;
            }
            db.updateIssue(res, columns, id, isadmin, issueID)
                .then(response => {
                    return response
                })
                .catch(err => {
                     
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
                .then(response => {
                    return response
                })
                .catch(err => {

                    return serverError(res);
                });

        } catch (err) {
            return serverError(res);
        }
    },

  
}

export default Issues;

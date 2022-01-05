import { serverResponse, serverError } from "../helpers/Response";
import imageUpload from "../middleware/cloudinary";
import db from '../database'
const Liquors = {
    async addLiquor(req, res) {
        try {
            const { id } = req.tokenData;
            let image_url = req.files != (null || undefined) ? await imageUpload(req.files.image_url) : req.body.image_url
            const {
                liquor_name, price,category, about
            } = req.body;
            const table = 'liquor'
            const columns = `owner, liquor_name,category, about,price,image_url`;
            const condition = `WHERE owner ='${id}' AND liquor_name='${liquor_name}' AND price='${price}' AND category='${category}' AND about='${about}'`;
            const values = `'${id}','${liquor_name}','${category}', '${about}','${price}', '${image_url}'`;
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
    async updateLiquor(req, res) {
        try {
            let image_url = req.files != (null || undefined) ? await imageUpload(req.files.image_url) : req.body.image_url,
                columns = null,
                l_name = null,
                l_price = null,
                l_category = null,
                l_about = null,
                l_image_url = null;
            const { id, isadmin } = req.tokenData;
            const { liquorID } = req.params;
            const {
                liquor_name, price, category, about
            } = req.body;
            if (process.env.NODE_ENV === 'test') {
                columns = `liquor_name='${liquor_name}', category='${category}', address='${address}', about= ${about},price='${price}', image_url='${image_url}'`;
            } else {
                l_name = liquor_name ? `liquor_name='${liquor_name}',` : "";
                l_price = price ? `price='${price}',` : "";
                l_category = category ? `category='${category}',` : "";
                l_about = about ? `about='${about}',` : "";
                l_image_url = image_url ? `image_url='${image_url}'` : "";
                columns = `${l_name} ${l_category} ${l_about} ${l_price} ${l_image_url}`;
            }
            db.updateLiquor(res, columns, id, isadmin, liquorID)
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

    deleteLiquor(req, res) {
        try {
            const { id, isadmin } = req.tokenData;
            const { liquorID } = req.params;
            db.deleteLiquor(res, id, isadmin, liquorID)
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
    orderLiquor(req, res) {
        try {
            const { id } = req.tokenData;
            const { liquorID } = req.params;
            const { liquor_no, ordered_on, derivered_on } = req.body
            console.log(ordered_on)
            const columns = `o_owner,liquor_ID,liquor_no,ordered_on,derivered_on`
            db.client_order(res, columns, id, liquorID, liquor_no, ordered_on, derivered_on)
                .then(response => {
                    return response
                })
        } catch (err) {
            console.log(err.message)
            return serverError(res);
        }
    },
    confirmOrder(req, res) {
        try {
            const { id } = req.params
            db.confirm(res, id)
                .then(response => {
                    return response
                })
        } catch (err) {
            return serverError(res);
        }
    },
    getOrderedLiquor(req, res) {
        try {
            let condition = `WHERE o.o_owner=u.id`;

            if (req.tokenData) {
                const { id } = req.tokenData;
                condition = `WHERE o.o_owner=u.id AND u.id=${id}`;
            }
            db.getOrdered(res, condition)
                .then(response => {

                    if (!response.length) return serverResponse(res, 404, ...['status', 404, 'message', `Ordered not fund.`]);

                    return serverResponse(res, 200, ...['status', 200, 'message', 'Ok', 'data', response]);
                }).catch(err => {
                    return serverError(res);
                });

        } catch (err) {
            return serverError(res);
        }
    },
    getAllLiquors(req, res) {
        try {
            const columns = `l.id,c.id as catID,l.liquor_name, c.category_name AS category,b.beer_name AS type,l.price, l.about, l.created_on, l.image_url, u.email AS owner_email, u.phonenumber AS owner_phonenumber`
            let condition = `WHERE u.id=l.owner AND c.id=l.category AND b.id=c.beer_type LIMIT 30`;
            if (req.params.category_ID) {
                const { category_ID } = req.params;
                condition = `WHERE u.id=l.owner AND c.id=l.category AND b.id=c.beer_type AND l.category = '${category_ID}'`;
            }
            if (req.tokenData) {
                const { id } = req.tokenData;
                condition = `WHERE u.id=l.owner AND c.id=l.category AND b.id=c.beer_type AND u.id = '${id}'`;
            }
            db.findLiquor(columns, condition)
                .then(response => {

                    if (!response.length) return serverResponse(res, 404, ...['status', 404, 'message', `This Liquor not fund.`]);

                    return serverResponse(res, 200, ...['status', 200, 'message', 'Ok', 'data', response]);
                }).catch(err => {
                    return serverError(res);
                });

        } catch (err) {
            return serverError(res);
        }
    },
    getOneLiquor(req, res) {
        try {
            let { beer_ID} = req.params;
            const columns = `l.id,c.id as catID,l.liquor_name, c.category_name AS category,b.beer_name AS type,l.price, l.about, l.created_on, l.image_url, u.email AS owner_email, u.phonenumber AS owner_phonenumber`
            let condition = `WHERE u.id=l.owner AND c.id=l.category AND b.id=c.beer_type AND l.id='${beer_ID}'`;
            db.findLiquor(columns, condition)
                .then(response => {
                    if (!response.length) return serverResponse(res, 404, ...['status', 404, 'message', `This Liquor not fund.`]);

                    return serverResponse(res, 200, ...['status', 200, 'message', 'Ok', 'data', response]);
                })
                .catch(err => {
                    return serverError(res);
                });
        } catch (err) {
            return serverError(res);
        }
    }
}

export default Liquors;

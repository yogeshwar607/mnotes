const User = rootRequire('models').User;
const { query } = rootRequire('commons').DATABASE;

const { ValidationError } = rootRequire('commons').ERROR;

const { userDAO } = rootRequire('commons').DAO;
// const assert = require('assert');
function enrichUserObj(body, context, params) {

    if (params.s == 'individual') {
        return {

            email: body.data.email,
            password: body.data.password,
            type: params.s,
            country: body.data.country,
            first_name: body.data.first_name,
            last_name: body.data.last_name,
            dob: body.data.dob,
            mobile_no: body.data.mobile_no,
            postal_code: body.data.postal_code,
            state: body.data.state,
            city: body.data.city,
            address: body.data.address,
            nationality: body.data.nationality,
            employment_status: body.data.employment_status,
            source_of_funds: body.data.source_of_funds,
            PEP: body.data.PEP

        };
    } else if (params.s == 'corporate') {
        return {
            email: body.data.email,
            password: body.data.password,
            type: params.s,
            first_name: body.data.first_name,
            last_name: body.data.last_name,
            dob: body.data.dob,
            mobile_no: body.data.mobile_no,
            nationality: body.data.nationality,
            company_details: {
                register_type: body.data.company_details.register_type,
                company_name: body.data.company_details.company_name,
                company_entity_type: body.data.company_details.company_entity_type,
                date_of_incorporation: body.data.company_details.date_of_incorporation,
                bussiness_registration_no: body.data.company_details.bussiness_registration_no,
                proof_of_address: body.data.company_details.proof_of_address,
                type_of_industry: body.data.company_details.type_of_industry,
                annual_sales: body.data.company_details.annual_sales,
                purpose_of_transfer: body.data.company_details.purpose_of_transfer,
                overseas_branches: body.data.company_details.overseas_branches,
                expected_monthly_volume: body.data.company_details.expected_monthly_volume,
                company_registered_address: {
                    unit_no: body.data.company_details.company_registered_address,
                    address: body.data.company_details.company_registered_address,
                    postal_code: body.data.company_details.company_registered_address
                },
                acra_path: context.images,
            }



        };
    }
}


async function logic({ body, context, params }) {
    try {
        // console.log(body);
        const userObj = enrichUserObj(body, context, params);

        const user = await User.findOne({ email: userObj.email });
        if (user) throw new ValidationError('Email already exists');
        const UserOb = new User(userObj);
        let usr = await UserOb.save();

        return usr;
    } catch (e) {
        logger.error(e);
        throw e;
    }
}

function handler(req, res, next) {
    if (req.params.s == 'individual') {
        logic(req)
            .then(data => {
                res.json({
                    success: true,
                    data,
                });
            })
            .catch(err => next(err));
    } else if (req.params.s == 'corporate') {

        const storageACRA = multer.diskStorage({
            destination: function(req, file, callback) {
                callback(null, './uploads/documents/acra/');
            },
            filename: function(req, file, callback) {
                callback(null, uuid.v4() + '.jpg');
            }
        });

        const uploadACRA = multer({
            storage: storageACRA,
            fileFilter: function(req, file, callback) {

                callback(null, true)
            }
        }).array('acraStore', 2);

        uploadACRA(req, res, function(err) {
            if (err) {
                return logger.error("Error uploading file.");
            } else {

                let m = JSON.stringify(req.body);

                req.body = JSON.parse(m.slice(0, req.body.length));
                req.body.data = JSON.parse(req.body.data);


                console.log("ss", req.body.data, req.body.data.name);

                let images = req.files[0].path;

                req.context = {};

                req.context.images = images;
                logic(req).then(data => {
                        res.json({
                            success: true,
                            data,
                        });
                    })
                    .catch(err => next(err));
            }
        });

    } else if (req.params.s == "db") {
        query('SELECT Now()').then(data => {
            console.log(data);
        })





    }
}
module.exports = handler;
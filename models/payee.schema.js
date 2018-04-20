const assert = require('assert');

let Schema = null;

function init() {
    const ObjectId = Schema.Types.ObjectId;
    const logs = new Schema({
        previous: {},
    });
    const PayeeSchema = new Schema({
        user: { type: ObjectId, ref: 'user', required: true },
        first_name: { type: String },
        last_name: { type: String },
        country: { type: String },
        state: { type: String },
        city: { type: String },
        street_address: { type: String },
        mobile_no: { type: String },
        relationship: { type: String },
        bank: { type: String },
        account_no: { type: String }

    }, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

    return PayeeSchema;
}

module.exports = (schema) => {
    assert.ok(schema);
    Schema = schema;
    return init();
};
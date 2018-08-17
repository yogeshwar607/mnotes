const assert = require('assert');
let Schema = null;

function init() {
    const tagsSchema = new Schema({
        tid: {
            type: String,
            required: true,
            unique: true
        },
        tcount: {
            type: Number,
        },
        tvalue: {
            type: String,
        },
    }, {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    });

    return tagsSchema;
}

module.exports = (schema) => {
    assert.ok(schema);
    Schema = schema;
    return init();
};
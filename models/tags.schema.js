const assert = require('assert');
let Schema = null;

function init() {
    const tagsSchema = new Schema({
        tvalue: {
            type: String,
            index:true
        },
        tid: {
            type: String,
            index:true
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
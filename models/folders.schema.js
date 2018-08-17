const assert = require('assert');
let Schema = null;

function init() {
    const folderSchema = new Schema({
        // unique folder id
        fid: {
            type: String,
            required: true,
            unique: true
        },
        // folder name
        fname: {
            type: String,
            required: true
        },
    }, {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    });

    return folderSchema;
}

module.exports = (schema) => {
    assert.ok(schema);
    Schema = schema;
    return init();
};
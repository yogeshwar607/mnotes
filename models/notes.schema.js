const assert = require('assert');
let Schema = null;

function init() {
    const notesSchema = new Schema({
        nid: {
            type: String,
            required: true,
            unique: true
        },
        nname: {
            type: String,
            required: true
        },
        ntext: {
            type: String,
            required: true
        },
        ntags:[
            {
                type:String
            }
        ]
    }, {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    });

    return notesSchema;
}

module.exports = (schema) => {
    assert.ok(schema);
    Schema = schema;
    return init();
};
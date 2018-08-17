const assert = require('assert');
const cuid = require('cuid');
let Schema = null;

function init() {
    const notesSchema = new Schema({
        nid: {
            type: String,
            required: true,
            unique: true
        },
        fid: {
            type: String,
        },
        ntext: {
            type: String,
            required: true
        },
        ntags: [{
            tvalue: String,
            tid:String
        }]
    }, {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    });

    notesSchema.post('save', (doc, next) => {
        const {
            tagsDAO
        } = rootRequire('commons').DAO;

        const tagsArray = doc.ntags;

        tagsArray.map((data) => {
            new tagsDAO().save({tvalue:data.tvalue,tid:data.tid})
        })
        next();
    });

    notesSchema.pre('remove',function(next) {
       
        next();
    });

    return notesSchema;
}


module.exports = (schema) => {
    assert.ok(schema);
    Schema = schema;
    return init();
};
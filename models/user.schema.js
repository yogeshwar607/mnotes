const assert = require('assert');
let Schema = null;

function init() {
    const userSchema = new Schema({
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
    }, {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    });

    // userSchema.pre('save', function(next) {
    //     const user = this;
    //     // only hash the password if it has been modified (or is new)
    //     if (user.isNew || user.isModified('password')) {
    //         // generate a salt
    //         bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    //             if (err) return next(err);
    //             // hash the password using our new salt
    //             bcrypt.hash(user.password, salt, (err, hash) => {
    //                 if (err) return next(err);
    //                 // override the cleartext password with the hashed one
    //                 user.password = hash;
    //                 next();
    //             });
    //         });
    //     } else {
    //         return next();
    //     }
    // });

    // userSchema.methods.comparePassword = function(candidatePassword) {
    //     return new Promise((resolve, reject) => {
    //         bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    //             if (err) return reject(err);
    //             resolve(isMatch);
    //         });
    //     });
    // };

    return userSchema;
}

module.exports = (schema) => {
    assert.ok(schema);
    Schema = schema;
    return init();
};
const { database } = rootRequire('config');
var bcrypt = require('bcrypt');
const saltRounds = 10;

function query(query) {
    return new Promise((resolve, reject) => {
        // console.log(database);

        (async() => {
            const client = await database.connect()
            try {
                const res = await client.query(query)
                resolve(res.rows)

                console.log(res.rows[0])
            } finally {
                client.release()
            }
        })().catch(e => console.log(e.stack))
            // if (database.readyForQuery == true) {

        //     database.query(query)
        //         .then(result => {
        //             resolve(result.rows)
        //         })
        //         .catch(e => reject(e.stack))
        //         .then(() => database.end())


        // } else {
        // database.connect()
        //     .then(() => {
        //         database.query(query)
        //             .then(result => {
        //                 resolve(result.rows)
        //             })
        //             .catch(e => reject(e.stack))
        //             .then(() => database.end())
        //     })
        //     .catch(e => console.error('connection error', e.stack))
        // }

    });
}

function paramQuery(query, values) {
    return new Promise((resolve, reject) => {

        (async() => {
            const client = await database.connect()
            try {
                const res = await client.query(query, values)
                console.log(res.rows[0])
                resolve(res.rows)

            } finally {
                client.release()
            }
        })().catch(e => console.log(e.stack))

        // if (database.readyForQuery == true) {

        //     database.query(query, values)
        //         .then(result => {
        //             resolve(result.rows)
        //         })
        //         .catch(e => reject(e.stack))
        //         // .then(() => database.end())

        // } else {

        //     database.connect()
        //         .then(() => {
        //             database.query(query, values)
        //                 .then(result => {
        //                     resolve(result.rows)
        //                 })
        //                 .catch(e => reject(e.stack))
        //                 // .then(() => database.end())
        //         })
        //         .catch(e => console.error('connection error', e.stack))

        // }

    });

}

function encryptPassword(pass) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(pass, salt, function(err, hash) {
                resolve(hash)
            });
        });
    });
}

function decryptComparePassword(pass, hash) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(pass, hash, function(err, res) {
            resolve(res)
        });
    });
}

// query("SELECT Now()");
module.exports = {
    query,
    paramQuery,
    decryptComparePassword,
    encryptPassword

};
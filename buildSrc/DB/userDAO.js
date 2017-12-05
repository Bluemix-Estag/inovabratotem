const db = require('./database');

let database;

db.getDatabase((result) => {
    database = result;
});



/**
 * 
 * @param {Function} callback a callback funcion with 2 parameters, error and users.
 */
const getUsers = (callback) => {

    database.get(db.USERS_DOCUMENT, { revs_info: true }, (err, doc) => {
        if (err) {
            callback({ error: true, error_reason: "INTERNAL SERVER ERROR", statusCode: 500 }, null);
        } else {
            callback(null, doc);
        }
    });
}


/**
 * 
 * @param {*} email Required email to search in database.
 * @param {*} callback 
 */
const getUserByEmail = (email, callback) => {
    getUsers((error, data) => {
        if (error) {
            callback(error, null);
        } else {
            const registeredUsers = data.registeredUsers;
            let user = registeredUsers.filter(function (user) { return user.email == email.toLowerCase() })[0] || null;
            if (user) {
                callback(null, data.users[user.id]);
            } else {
                callback({ error: true, error_reason: "USER_NOT_FOUND", statusCode: 404 }, null);
            }
        }
    })
}

/**
 * 
 * @param {*} user 
 * @param {*} callback 
 */
const addUser = (user, callback) => {
    getUsers((error, doc) => {
        if (error) {
            callback(error, null)
        } else {
            doc.registeredUsers.push({ email: user.email, id: doc.registeredUsers.length + 1 });
            user.email = user.email.toLowerCase();
            doc.users[doc.registeredUsers.length] = user;
            updateDocument(doc, (err) => {
                if (err) {
                    callback({ error: true, error_reason: "INTERNAL_SERVER_ERROR", statusCode: 500 },null);
                } else {
                    callback(null, user);
                }
            })
        }
    })
}


const updateDocument = (doc, callback) => {
    database.insert(doc, db.USERS_DOCUMENT, (err, document) => {
        if (err) {
            callback(true);
        } else {
            callback(false);
        }
    })
}


module.exports = {
    getUsers,
    getUserByEmail,
    addUser
}

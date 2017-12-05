/**
 * This file contains all of the web and hybrid functions for interacting with
 * Cloudant service.
 *
 * @summary   Functions for Cloudant.
 * @author  Rabah Zeineddine
 *
 */


const fs = require('fs');

const cfenv = require('cfenv');

let vcapLocal, appEnvOpts, appEnv, database;

const DATABASE_NAME = "inovabra";
const USERS_DOCUMENT = "users";

// const EVENTS_DOCUMENT = "events";

const initDatabase = (callback) => {
    if (database == undefined) {
        fs.stat('./buildSrc/vcap.json', (err, stat) => {
            if (err && err.code === 'ENOENT') {
                console.log('No vcap.json');
                callback(true);
            } else if (err) {
                console.log('Error retrieving local vcap: ', err.code);
                callback(true);
            } else {
                vcapLocal = require('../vcap.json');
                console.log('Loaded local VCAP', vcapLocal);
                appEnvOpts = {
                    vcap: vcapLocal
                }
                initializaAppEnv(callback);
            }
        })

    } else {
        callback(false);
    }

}


const initializaAppEnv = (callback) => {
    appEnv = cfenv.getAppEnv(appEnvOpts);
    if (appEnv.isLocal) {
        require('dotenv').load();
    }

    if (appEnv.services.cloudantNoSQLDB) {
        initCloudant(callback);
    } else {
        console.log('No Cloudant service exists.');
        callback(true);
    }
}


const initCloudant = (callback) => {
    let cloudantURL = process.env.CLOUDANT_URL || appEnv.services.cloudantNoSQLDB[0].credentials.url || appEnv.getServiceCreds("Cloudant").url;
    let cloudant = require('cloudant')({
        url: cloudantURL,
        plugin: 'retry',
        retryAttempts: 10,
        retryTimeout: 500
    });

    // Create the accounts Logs if it doesn't exist
    cloudant.db.create(DATABASE_NAME, (err, body) => {
        if (err) {
            console.log(`Database already exists: ${DATABASE_NAME}`);
        } else {
            console.log(`New database created: ${DATABASE_NAME}`);
        }
    });

    database = cloudant.db.use(DATABASE_NAME);
    checkUsers();
    // checkEvents();
    callback(false);
}


const checkUsers = () => {
    database.get(USERS_DOCUMENT, { revs_info: true }, (err, doc) => {
        if (err) {
            console.log('Creating Users document...');
            creatUsersDocument();
        } else {
            console.log('Users document already exists!');
        }
    })
}



const creatUsersDocument = () => {
    let doc = {
        "users": {},
        "registeredUsers": []
    }

    database.insert(doc, USERS_DOCUMENT , (err, document) => {
        if (err) {
            console.log('Error on creating users document');
        } else {
            console.log('users document created successfully');
        }
    })
}


// const checkEvents = () => {
//     database.get(EVENTS_DOCUMENT, {revs_info: true}, (err,doc) => {
//         if (err) {
//             console.log('Creating Events document...');
//             creatEventsDocument();
//         } else {
//             console.log('Events document already exists!');
//         }
//     })
// }

// const creatEventsDocument = () => {
//     let doc = {
//         "events": []
//     }
//     database.insert(doc,EVENTS_DOCUMENT, (err, document ) => {
//         if(err){
//             console.log('Error on creating events document');
//         }else{
//             console.log('Events document created successfully!');
//         }
//     })
// }


const getDatabase = (callback) => {
    if (database == undefined) {
        initDatabase((error) => {
            if (error) {
                callback(database);
            } else {
                 callback(database);
            }
        })
    } else {
        callback(database);
    }
}




module.exports = {
    getDatabase,
    USERS_DOCUMENT
};


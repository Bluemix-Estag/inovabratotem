/**
 * This file contains all of the web and hybrid functions for interacting with
 * Cloudant service.
 *
 * @summary   Functions for Cloudant.
 * @author  Rabah Zeineddine
 *
 */


const fs = require('fs');

// const cfenv = require('cfenv');

let vcapLocal, appEnvOpts, appEnv, database;

const DATABASE_NAME = "inovabra";
const USERS_DOCUMENT = "users";
const LECTURE_DOCUMENT = "lectures";



const initCloudant = (callback) => {
    let cloudantURL = process.env.CLOUDANT_URL ;
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
    checkLectures();
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


const checkLectures = () => {
    database.get(LECTURE_DOCUMENT, {revs_info: true}, (err,doc) => {
        if (err) {
            console.log('Creating Lectures document...');
            createLecturesDocument();
        } else {
            console.log('Lectures document already exists!');
        }
    })
}

const createLecturesDocument = () => {
    let doc = {
        "lectures": []
    }

    database.insert(doc,LECTURE_DOCUMENT, (err, document ) => {
        if(err){
            console.log('Error on creating lectures document');
        }else{
            console.log('Lectures document created successfully!');
        }
    })
}


const getDatabase = (callback) => {
    if (database == undefined) {
        initCloudant((error) => {
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
    USERS_DOCUMENT,
    LECTURE_DOCUMENT
};


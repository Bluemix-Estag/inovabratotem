const db = require('./database');

const moment = require('moment');

let database;

db.getDatabase((result) => {
    database = result;
});




// {
//     "name": "XX",
//     "date": 123123123,
//     "formattedDate": "22-12-2017",
//     "formattedTime": "16:20"
// }




const getNextLecture = (callback) => {

    database.get(db.LECTURE_DOCUMENT, {
        revs_info: true
    }, (err, doc) => {
        if (!err) {
            let lectures = doc.lectures;
            let nextLecture = lectures.filter((lecture) => {
                return lecture.date >= moment({}).unix()
            })[0] || null;
            callback(nextLecture);

        } else {
            console.log('An error occurred retrieving lectures');
            callback(null);
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
    getNextLecture
}
const connection = require('./mysql.js') ;

function getUserEmail(email){
    return new Promise( data=> {
        const query = `SELECT id, email, password, nominativo, immagine,immagine_web,tipo FROM users WHERE email = '${email}'; `;
        // console.log(query);
        connection.query(query, (error,result) => {
            if(error){
                throw error;
            }
            try{
                const user = JSON.parse(JSON.stringify(result));
                data(user);
            }catch (error){
                data({});
                throw error;
            }
        });
    });
}

function getAllUser(){
    return new Promise( data=> {
        const query = `SELECT id, nominativo, immagine,immagine_web,tipo FROM users `;
        // console.log(query);
        connection.query(query, (error,result) => {
            if(error){
                throw error;
            }
            try{
                const users = JSON.parse(JSON.stringify(result));
                data(users);
            }catch (error){
                data({});
                throw error;
            }
        });
    });
}

function getUserId(id){
    return new Promise( data=> {
        const query = `SELECT id, email, password, nominativo, immagine,immagine_web,tipo FROM users WHERE id = '${id}'; `;
        // console.log(query);
        connection.query(query, (error,result) => {
            if(error){
                throw error;
            }
            try{
                const user = JSON.parse(JSON.stringify(result));
                data(user);
            }catch (error){
                data({});
                throw error;
            }
        });
    });
}

function userExist(email){
    return new Promise(data => {
        const query = `SELECT COUNT(id) AS user FROM users WHERE email = '${email}'; `;
        // console.log(query);
        connection.query(query, (error,result) => {
            if(error){
                throw error;
            }
            try{
                let user = JSON.parse(JSON.stringify(result));
                user = user.shift().user;
                // console.log(user)
                data(user);
            }catch (error){
                data({});
                throw error;
            }
        });
    });
}

function addUser(userData){
    const {email, nominativo, password,image_link,image_file} = userData;

    return new Promise(data => {
        const query = 
        'INSERT INTO users (nominativo, email, password, immagine,immagine_web,tipo)'
        +
        `VALUES ("${nominativo}","${email}","${password}","${image_file}","${image_link}","normal")`;

        connection.query(query, (error,result) => {
            if(error){
                throw error;
            }else{
                data(true)
            }
        });
    });
}

function modifyUser(userData,id){
    const {email, nominativo, password,image_link,image_file} = userData;

    return new Promise(data => {
        let query = 
        'UPDATE users'+
        ` SET nominativo = "${nominativo}",`+
        ` email = "${email}",`+
        ` password = "${password}"`;

        if(image_file ==='deleted'){
            query += `, immagine = ${null}  `
        }else if(image_file !=''){
            query += `, immagine = "${image_file}"`
        }

        if(image_link != ''){
            query += `, immagine_web = "${image_link}"`
        }



        query += ` WHERE id = ${id}`

        console.log(query);
        connection.query(query, (error,result) => {
            if(error){
                throw error;
            }else{
                data(true);
            }
        });
    });
}

exports.getUserEmail = getUserEmail
exports.getUserId = getUserId
exports.userExist = userExist
exports.addUser = addUser
exports.modifyUser = modifyUser
exports.getAllUser = getAllUser
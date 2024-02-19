const { data } = require('autoprefixer');
const connection = require('./mysql.js') ;

// function getAllBevande() {
//     const query = "SELECT * FROM bevande"
//     connection.query(query, (err,result)=>{
//         if (err){
//             throw err;  
//         }else{
//             const bevande = JSON.parse(JSON.stringify(result));
//             return bevande
//         }  
//     });
//     console.log(data);
//     return data
// };


function getAll(){
    return new Promise( data => {
        const query = "SELECT * FROM bevande";
        connection.query(query, (error,result)=> {
            if (error){
                throw error;  
            }

            try {
                // console.log(result);
                const bevande = JSON.parse(JSON.stringify(result));
                data(bevande);
            }catch (error) {
                data({});
                throw error;
            }
        });
    });
}


// exports.getAllBevande = getAllBevande;
exports.getAll = getAll;



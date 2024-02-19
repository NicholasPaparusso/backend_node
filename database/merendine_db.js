const connection = require('./mysql.js') ;

// function getAllMerendine () {
//     const query = "SELECT * FROM merendine"
//     connection.query(query, (err,result)=>{
//         if (err){
//             throw err;  
//         }else{
//             const meredine = result
//             console.log(meredine);
//             return meredine
//         }  
//     });
// }


function getAll(){
    return new Promise( data => {
        const query = "SELECT * FROM merendine";
        connection.query(query, (error,result)=> {
            if (error){
                throw error;  
            }

            try {
                // console.log(result);
                const merendine = JSON.parse(JSON.stringify(result));
                data(merendine);
            }catch (error) {
                data({});
                throw error;
            }
        });
    });
}

exports.getAll = getAll;


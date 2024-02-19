const connection = require('./mysql.js') ;

function createOrder (userId,totale) {
    return new Promise( data => {
        const query = `INSERT INTO ordini (id_user, totale) VALUES  (${userId}, ${totale})`;
        console.log(query);

        connection.query(query, (error,result) => {
            if(error){
                throw error;
            }
            try{
                const order = JSON.parse(JSON.stringify(result.insertId));
                data(order);
            }catch (error){
                data({});
                throw error;
            }
        });
    });
}

function createOrderItems (items,orderId) {
    return new Promise (data => {

        items.forEach( item => {
            const subtotale = parseFloat((item.quantity * item.prezzo_unitario_vendita_interno).toPrecision(5)).toFixed(2);
            const query = `INSERT INTO ordini_items (ordine_id , item_id , qty, subtotale, tipo) VALUES (${orderId} , ${item.id} , ${item.quantity} , ${subtotale} , "${item.type}") `;
            console.log(query);

            connection.query(query,(error, result)=> {
                if(error){
                    throw error;
                };
                try{
                    const isSuccess = JSON.parse(JSON.stringify(result));
                    data(isSuccess);
                }catch(error){
                    data(false);
                    throw error;
                }
            }) 
        });
    });
}

function reduceItemQuantity (items){
    return new Promise (data => {
        items.forEach( item => {
            const query = `UPDATE ${item.type} SET qty = qty - ${item.quantity} WHERE id = ${item.id}`;

            connection.query(query, (error, result)=> {
                if(error){
                    throw error
                };
                try{
                    const isSuccess = JSON.parse(JSON.stringify(result));
                    data(isSuccess);
                }catch(error){
                    data(false);
                    throw error
                }
            });
        })
    })
}
exports.createOrder = createOrder;
exports.createOrderItems = createOrderItems;
exports.reduceItemQuantity = reduceItemQuantity;
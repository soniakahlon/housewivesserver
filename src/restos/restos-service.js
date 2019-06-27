const RestosService = {
    getAllResots(knex){
      return knex.select('*').from('restaurants');
    },
  
    insertResto(knex, newResto){
      return knex
        .insert(newResto)
        .into('restaurants')
        .returning('*')
        .then(rows => {
          return rows[0];
        });
    },
  
    getRestoById(knex, id) {
      return knex
        .from('restaurants')
        .select('*')
        .where('id', id)
        .first();
    },
  
    deleteResto(knex, id){
      return knex('restaurants')
        .where({ id })
        .delete(); 
    },
  
    updateResto(knex, id, newRestoFields){
      return knex('restaurants')
        .where({ id })
        .update(newRestoFields);
    },
  };
  
  module.exports = RestosService;
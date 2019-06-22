const path = require('path');
const express = require('express');
const xss = require('xss'); 
const RestosService = require('./restos-service');
const { requireAuth } = require('../middleware/jwt-auth')


const restosRouter = express.Router();
const jsonParser = express.json();

const serializeRestos = (restaurant) => ({
  id: restaurant.id,
  name: xss(restaurant.name),
  nameofHw: restaurant.nameofHw,
  city: restaurant.city,
  comment: restaurant.comment,
});

restosRouter
  .route('/')
  .all(requireAuth)

  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    RestosService.getAllRestos(knexInstance)
      .then(restaurants =>{
        res.json(restaurants.map(serializeNote));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { name, nameofHw, city, comment } = req.body;
    console.log(req.body)
    if(!name){
      return res.status(400).json({
        error: { message: 'Missing name in request' } 
      });
    }
    if(!nameofHw){
      return res.status(400).json({
        error: { message: 'Missing name of Housewife in request' } 
      });
    }

    if(!city){
        return res.status(400).json({
          error: { message: 'Missing city in request' } 
        });
      }
    
    const newResto = { name, nameofHw, city, comment};
    
    RestosService.insertRestos(
      req.app.get('db'),
      newReto
    )
      .then(restaurant => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${restaurant.id}`))
          .json(serializerestaurant(restaurant));
      })
      .catch(next);
  });

restosRouter
  .route('/:restaurant_id')
  .all(requireAuth)
  .all((req, res, next) => {
    RestosService.getRestoById(
      req.app.get('db'),
      req.params.restaurant_id
    )
      .then (restaurant =>{
        if (!restaurant){
          return res.status(404).json({
            error: {message: 'Restaurant doesn\'t exist'}
          });
        }
        res.restaurant = restaurant;
        next();  
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializerestaurant(res.restaurant));
  })
  .delete((req,res,next) => {
    RestosService.deleteResto(
      req.app.get('db'),
      req.params.restaurant_id
    )
      .then( () =>{
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { name, nameofHw, city, comment } = req.body;
    if(!name) {
      return res.status(400).json({
        error: {
          message: 'Request must have a name'
        }
      });
    }
    if(!nameofHw) {
      return res.status(400).json({
        error: {
          message: 'Request must have text'
        }
      });
    }

    if(!city) {
        return res.status(400).json({
          error: {
            message: 'Request must have text'
          }
        });
      }

    const restoToUpdate ={
      name,
      nameofHw,
      city
    };

    RestosService.updateResto(
      req.app.get('db'),
      req.params.note_id,
      restoToUpdate
    )
      .then( () => {
        res.status(204).end(); 
      })
      .catch(next);
  });

module.exports = restosRouter;
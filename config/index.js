const cors = require('cors')
const app = require("express")();
const dotenv = require("dotenv")
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const express = require("express")
const documentation = require('../swagger.json')
const routes = require("../routes/index")
const { testDbConnection } = require("../models/db.js")

const loadDb = () => {
  testDbConnection()  
}

const loadDocumentation= () => {
    const options = {
        definition: {
          openapi: '3.0.0',
          info: {
            title: 'Product Management API',
            version: '1.0.0',
            description: 'API documentation for Product Management'
          },
          servers: [
            {
              url: 'http://localhost:3100'
            }
          ]
        },
        apis: ['./routes/*.js'] 
      };
      
      swaggerJsdoc(options);
      app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(documentation));    
}

const APP_PORT = 3100;

module.exports = function loadApp(){
  app.listen(APP_PORT, () => {
    console.log(`Server is running on port  ${APP_PORT}`);
  });
    dotenv.config()
    loadDb()
    loadDocumentation()
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use("/", routes)
}


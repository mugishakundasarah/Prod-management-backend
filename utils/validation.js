const Joi = require("joi")


module.exports.authValidationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required() 
})

module.exports.productValidationSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow(null),
    price: Joi.number().required().min(0),
  });
const Joi = require('joi')

module.exports = {
    body: {
        place: Joi.string().required(),
        description: Joi.string().required(),
    }
}
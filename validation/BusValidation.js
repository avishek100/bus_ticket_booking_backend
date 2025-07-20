const joi = require("joi");
const busSchema = joi.object({
    busnumber: joi.number().required(),
    busname: joi.string().required().email(),
    type: joi.string().required(),
    totalseat: joi.number().required(),
    routeid: joi.string().required(),

})

function BusValidation(req, res, next) {
    const { busnumber, busname, type, totalseat, routeid } = req.body;
    const { error } = busSchema.validate({ busnumber, busname, type, totalseat, routeid })
    if (error) {
        return res.json(error)
    }
    next()


}
module.exports = BusValidation;
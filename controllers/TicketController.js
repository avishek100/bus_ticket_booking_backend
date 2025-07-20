const Ticket = require('../models/Ticket')
const findAll = async (req, res) => {
    try {
        const tickets = await Ticket.find().populate(["customerId", "scheduleId",]);
        res.status(200).json(tickets);
    } catch (e) {
        res.json(e)
    }


    // const customers=await Customer.find();
    // res.status(200).json(customers);

}
const save = async (req, res) => {
    try {
        const { seatnumber, bookingstatus, price, issuedat, scheduleId, customerId } = req.body
        const ticket = new Ticket({
            seatnumber,
            bookingstatus,
            price,
            issuedat,
            scheduleId,
            customerId


        });
        await ticket.save();
        res.status(201).json(ticket)
    } catch (e) {
        res.json(e)
    }

}
const findById = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        res.status(200).json(ticket)
    } catch (e) {
        res.json(e)

    }


}
const deleteById = async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndDelete(req.params.id);
        res.status(200).json("data Deleted")
    } catch (e) {
        res.json(e)

    }


}
const update = async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(201).json(ticket)
    } catch (e) {
        res.json(e)

    }


}



module.exports = {
    findAll,
    save,
    update,
    deleteById,
    findById,
}
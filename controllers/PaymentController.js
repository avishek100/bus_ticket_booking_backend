const Payment = require('../model/Payment')
const findAll = async (req, res) => {
    try {
        const payments = await Payment.find().populate(["customerId", "bookingId",]);
        res.status(200).json(payments);
    } catch (e) {
        res.json(e)
    }


    // const customers=await Customer.find();
    // res.status(200).json(customers);

}
const save = async (req, res) => {
    try {
        const { bookingId, customerId, amount, paymentmethod, paymentstatus, paidat } = req.body
        const payment = new Payment({
            bookingId,
            customerId,
            amount,
            paymentmethod,
            paymentstatus,
            paidat,


        });
        await payment.save();
        res.status(201).json(payment)
    } catch (e) {
        res.json(e)
    }

}
const findById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        res.status(200).json(payment)
    } catch (e) {
        res.json(e)

    }


}
const deleteById = async (req, res) => {
    try {
        const payment = await Payment.findByIdAndDelete(req.params.id);
        res.status(200).json("data Deleted")
    } catch (e) {
        res.json(e)

    }


}
const update = async (req, res) => {
    try {
        const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(201).json(payment)
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
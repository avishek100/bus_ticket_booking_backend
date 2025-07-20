const Feedback = require('../model/Feedback');
const findAll = async (req, res) => {
    try {
        const feedbacks = await Feedback.find().populate(["customerId", "busId",]);
        res.status(200).json(feedbacks);
    } catch (e) {
        res.json(e)
    }


    // const customers=await Customer.find();
    // res.status(200).json(customers);

}
const save = async (req, res) => {
    try {
        const { userId, busId, rating, comment, submittedat } = req.body
        const feedback = new Feedback({
            userId,
            busId,
            rating,
            comment,
            submittedat,


        });
        await feedback.save();
        res.status(201).json(feedback)
    } catch (e) {
        res.json(e)
    }

}
const findById = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);
        res.status(200).json(feedback)
    } catch (e) {
        res.json(e)

    }


}
const deleteById = async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndDelete(req.params.id);
        res.status(200).json("data Deleted")
    } catch (e) {
        res.json(e)

    }


}
const update = async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(201).json(feedback)
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
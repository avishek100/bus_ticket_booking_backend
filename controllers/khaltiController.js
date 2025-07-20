const axios = require("axios");



exports.verifyKhaltiPayment = async (req, res) => {
    try {
        const { token, amount } = req.body;

        const response = await axios.post(
            "https://khalti.com/api/v2/payment/verify/",
            { token, amount: amount * 100 },
            {
                headers: {
                    Authorization: "Key test_secret_key_88d41b18b4a648ec8e436af0193d9f26",
                    "Content-Type": "application/json",
                },
            }
        );

        if (response.data.state.name === "Completed") {
            res.status(200).json({ message: "Payment verified successfully", data: response.data });
        } else {
            res.status(400).json({ message: "Payment verification failed" });
        }
    } catch (error) {
        console.error("Khalti Verification Error:", error);
        res.status(500).json({ message: "Failed to verify Khalti payment" });
    }
};

// exports.verifyPaypalPayment = async (req, res) => {
//     try {
//         const { orderID, details, amount } = req.body;

//         // Optionally: match expected amount with received amount
//         const paypalAmount = parseFloat(details.purchase_units[0].amount.value);
//         const paymentStatus = details.status;

//         if (paymentStatus === "COMPLETED" && paypalAmount > 0) {
//             // (Optional) Log transaction or save to DB
//             return res.status(200).json({
//                 success: true,
//                 message: "PayPal payment verified successfully",
//                 data: details,
//             });
//         } else {
//             return res.status(400).json({
//                 success: false,
//                 message: "Payment not completed or amount mismatch",
//             });
//         }
//     } catch (error) {
//         console.error("PayPal Verification Error:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Failed to verify PayPal payment",
//         });
//     }
// };

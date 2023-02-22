

import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "customers" },
    loanAgreementId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "loanagreementform",
    },
    isSeized: {
        type: Boolean,
        default: false
    },
    SeizedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "recoverystaff",
    },
    seizedHistory:{
        type: [ ],
        required: false
    }
});

const Vehicle = mongoose.model("vehicle", vehicleSchema);

export default Vehicle;
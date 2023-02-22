import Recovery from "../models/recovery.js";
import Vehicle from "../models/vehicle.js";
import LoanAgreement from "../models/loanAgreement.js";
import Customer from "../models/customer.js";

export const getRecovery = async (req, res) => {
  try {
    const recoveryStaffId = req.params.recoveryStaffId;

    const recovery = await Recovery.find({ recoveryStaff: recoveryStaffId })
      .populate({
        path: "loanAgreement",
        select:
          "customer_name customer_image mobile_no father_or_husband_name vehicle_number",
      })
      .exec();

    return res.status(200).json(recovery);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const completeRecovery = async (req, res) => {
  try {
    const { recoveryId: recoveryId } = req.body;

    var recovery = await Recovery.findById(recoveryId).lean();

    if (!recovery) {
      return res.status(400).json({ message: "Enter valid id" });
    }

    const loanAgreement = await LoanAgreement.findByIdAndUpdate(
      recovery.loanAgreement,
      {
        isRecover: true,
      },
      { new: true }
    ).exec();

    var customer = await Customer.findById(loanAgreement.customerId).lean();

    const map = {
      seizedOn: new Date(),
    };
    await Vehicle.findByIdAndUpdate(customer.vehicleId, {
      $set: {
        isSeized: true,
        SeizedBy: recovery.dealer,
      },
      $push: { seizedHistory: map },
    }).exec();

    await Recovery.findByIdAndDelete(recoveryId).exec();

    return res.status(200).json({ message: "Vehicle Recovered" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const madePayment = async (req, res) => {
  try {
    const { recoverId: recoverId } = req.body;
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

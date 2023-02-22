import jwt from "jsonwebtoken";

const authorization = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const reqtoken = authHeader && authHeader.split(" ")[1];

    if (reqtoken === null || reqtoken === undefined) {
        req.Auth = false;
        return res
            .status(500)
            .send({ auth: false, message: "Failed to authenticate token." });
    }

    jwt.verify(reqtoken, process.env.JWT_KEY, async (err, data) => {
        if (err) {
            req.Auth = false;
            return res
                .status(500)
                .send({ auth: false, message: "Failed to authenticate token." });
        } else {
            req.Auth = true;
            next();
        }
    });
}

export const adminAuth = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const reqtoken = authHeader && authHeader.split(" ")[1];

    if (reqtoken === null || reqtoken === undefined) {
        req.Auth = false;
        return res
            .status(500)
            .send({ auth: false, message: "Failed to authenticate token." });
    }

    jwt.verify(reqtoken, process.env.ADMIN_JWT_KEY, async (err, data) => {
        if (err) {
            req.Auth = false;
            return res
                .status(500)
                .send({ auth: false, message: "Failed to authenticate token." });
        } else {
            req.Auth = true;
            next();
        }
    });
}

export const userAuth = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const reqtoken = authHeader && authHeader.split(" ")[1];

    if (reqtoken === null || reqtoken === undefined) {
        req.Auth = false;
        return res
            .status(500)
            .send({ auth: false, message: "Failed to authenticate token." });
    }

    jwt.verify(reqtoken, process.env.USER_JWT_KEY, async (err, data) => {
        if (err) {
            req.Auth = false;
            return res
                .status(500)
                .send({ auth: false, message: "Failed to authenticate token." });
        } else {
            req.Auth = true;
            next();
        }
    });
}

export const customerAuth = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const reqtoken = authHeader && authHeader.split(" ")[1];

    if (reqtoken === null || reqtoken === undefined) {
        req.Auth = false;
        return res
            .status(500)
            .send({ auth: false, message: "Failed to authenticate token." });
    }

    jwt.verify(reqtoken, process.env.CUSTOMER_JWT_KEY, async (err, data) => {
        if (err) {
            req.Auth = false;
            return res
                .status(500)
                .send({ auth: false, message: "Failed to authenticate token." });
        } else {
            req.Auth = true;
            next();
        }
    });
}

export default authorization;
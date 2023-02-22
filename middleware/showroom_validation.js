import { param, check } from "express-validator";


export const createShowroomValidation = [
    check('showroom_name', 'Showroon name is required').notEmpty().isString(),
    check('showroom_owner', 'Showroon owner is required').notEmpty().isString(),
    check('showroom_location', 'Showroon location is required').notEmpty().isString()
]

export const updateShowroomValidation = [
    check('id', 'id is required').notEmpty().isString(),
    check('showroom_name', 'Showroon name is required').optional().isString(),
    check('showroom_owner', 'Showroon owner is required').optional().isString(),
    check('showroom_location', 'Showroon location is required').optional().isString()
]

export const idValidation = [
    param('id', 'id is required').notEmpty().isString(),
]

export const showroomDealerValidation = [
    check('showroom_id', 'showroom_id is required').notEmpty().isString(),
    check('dealer_email', 'Invalid dealer_email').isEmail()
]

export const allDealersByShowroom = [
    param('showroomid').notEmpty().isString()
]
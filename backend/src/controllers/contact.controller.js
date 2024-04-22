import { Contact } from "../models/contact.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const contactFrom = asyncHandler(async(req,res) => {
    const {name,email,message} = req.body

    if (
        [name, email, message].some((field) => !field || field.trim() === '')
    ) {
        throw new ApiError(400, "Please fill the fields");
    }

    const contact = await Contact.create({
        name,
        message,
        email
    })

    if (!contact) {
        throw new ApiError(500, "Something went wrong while save the data")
    }

    return res.json(new ApiResponse(200,contact,"Successfully save in the databse"))
})


export {
    contactFrom
}

import { Contact } from "../models/contact.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Stats } from "../models/stats.model.js"


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

const stats = asyncHandler(async(req,res) => {

    const stats = await Stats.find({}).sort({createdAt:"desc"}).limit(12)

    const statsData = []

    for (let i = 0; i < stats.length; i++) {
        statsData.push(stats[i]) 
        
    }

    const requriedSize = 12 - stats.length

    for (let i = 0; i < requriedSize; i++) {
        statsData.unshift({
            users: 0,
            subscription: 0,
            views: 0
        })   
    }

    let usersCount = statsData[11].users
    let subscriptionCount = statsData[11].subscription
    let viewsCount = statsData[11].views

    let userPercentage = 0,
    viewsPercentage = 0,
    subscriptionPercentage = 0;
    let userProfit = true,
    viewsProfit = true,
    subscriptionProfit = true

    if (statsData[10].users === 0) userPercentage = usersCount * 100
    if (statsData[10].views === 0) viewsPercentage = viewsCount * 100
    if (statsData[10].subscription === 0) subscriptionCount = subscriptionCount * 100
    else {
        const difference = {
            users: statsData[11].users - statsData[10].users,
            views: statsData[11].views - statsData[10].views,
            subscription: statsData[11].subscription - statsData[10].subscription
        }

        userPercentage = (difference.users/ statsData[10].users) * 100;
        viewsPercentagePercentage = (difference.views/ statsData[10].views) * 100;
        subscriptionPercentage = (difference.subscription/ statsData[10].subscription) * 100;

        if (userPercentage < 0) userProfit = false;
        if (viewsPercentage < 0) viewsProfit = false;
        if (subscriptionProfit < 0) subscriptionProfit = false;

    }

    return res.status(200).json({
        message: "success",
        stats: statsData,
        usersCount,
        subscriptionCount,
        viewsCount,
        subscriptionPercentage,
        userPercentage,
        viewsPercentage,
        subscriptionProfit,
        userProfit,
        viewsProfit

    })

})


export {
    contactFrom,
    stats
}

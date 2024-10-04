const shortid = require("shortid");

const URL = require("../model/url");
async function handleUserAnalytics(req , res){
    try{
        const shortId = req.params.shortid;
        const result = await URL.findOne({shortId});
        return res.json({
            totalClicks : result.visitHistory.length,
            analytics : result.visitHistory,
        })

    }catch(err){
        return res.status(401).json({message : err.message});
    }
}

async function handleGenerateNewShortURL(req , res){
    try{
    const body = req.body;
    if(!body.url) return res.status(400).json({error: "url is required"});
    const shortID = shortid();
    await URL.create({
        shortId: shortID,
        redirectURL: body.url,
        visitHistory: [],
        createdBy : req.user._id,
    })
    return res.render('home'  , {
        id: shortID,
    })
    }catch(err){
        return res.json({message: err.message});
    }
};

module.exports = {
    handleGenerateNewShortURL,
    handleUserAnalytics,
}
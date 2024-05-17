const URL =require("../models/url");
const geoip = require('geoip-lite');
const {nanoid}=require("nanoid");
async function handleGenerateNewShortUrl(req,res){
    const body=req.body;
    if(!body.url) return res.status(400).json({error:"url is required"});
    const shortID= nanoid(8);
    try{
        await URL.create(
            {
                shortID:shortID,
                redirectURL:body.url,
                visitHistory:[],
                createdBy:req.session.userId,
            }
        );
        return res.redirect('/');

    }catch(err){
        res.json({msg:"unable to push to database",error:err.message});
    }
}
async function handleGetAnalytics(req,res){
    const shortID=req.params.shortID;
    
    try{
        const result =await URL.findOne({shortID});
        return res.json({
            totalClicks:result.visitHistory.length,
            analytics:result.visitHistory,
        });
    }catch(err){
        res.json({"msg":"something went wrong","error":err.message});
    }
}
async function handleRedirecting(req,res){
    const shortID=req.params.shortID;
    const ipAddress = req.ip;
    const geo = geoip.lookup(ipAddress);
    console.log(ipAddress,geo);
    const location = geo ? `${geo.city}, ${geo.region}, ${geo.country}` : 'Unknown location';
    try{
        const entry=await URL.findOneAndUpdate(
            {
            shortID,
            },
            {
            $push: {
                visitHistory:{
                    timestamp: Date.now(), ipAddress, location
                } 
            },
            }
        );
            res.redirect(entry.redirectURL);
    }catch(err){
        res.json({
            "msg":"invalid shorturl",
            "error":err.message
        })
    }
   
}

module.exports={
    handleGenerateNewShortUrl,
    handleGetAnalytics,
    handleRedirecting
}
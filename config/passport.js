const GoogleStrategy= require('passport-google-oauth20').Strategy
const mongoose=require("mongoose");
const User=require("../models/User");
module.exports=(passport)=>{
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback"
      },
      async(accessToken, refreshToken, profile, done)=> {
        const newUser={
            googleId: profile.id,
            displayName: profile.displayName,
            firstName:profile.name.givenName,
            lastName:profile.name.familyName,
            image: profile.photos[0].value
        }
        try{
            let user=await User.findOne({googleId: profile.id})
            if(user){
                done(null,user);
            }
            else
            {
                user=await User.create(newUser)
                done(null,user)
            }
        }
        catch(err)
        {
            console.log(err);
        }
      }
    ));
    passport.serializeUser(function(user, done) {
        done(null, user.id); 
       // where is this user.id going? Are we supposed to access this anywhere?
    });
    
    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id)
            .then(user => {
                done(null, user);
            })
            .catch(err => {
                console.error(err);
                done(err, null);
            });
    });
}
let mongoose = require('mongoose');

let developerSchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    name:{
        firstName:{
            type:String,
            required:true
        },
        lastName:{
            type:String,
            required:true
        }
    },
    level:{
        type: String,
        required:true
    },
    address:{
        state:String,
        suburb:String,
        street:String,
        unit:String
    }

    
});



module.exports = mongoose.model('Developers', developerSchema);

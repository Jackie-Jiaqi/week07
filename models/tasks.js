let mongoose = require('mongoose');


let taskSchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    taskName:String,
    dueDate:Date,
    status:String,
    description:String,
    assign:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Developers'
    }
})

module.exports = mongoose.model('Tasks', taskSchema);
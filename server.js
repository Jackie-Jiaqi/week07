let mongoose = require('mongoose');
let tasks = require('./models/tasks');
let developers = require('./models/developers');
let express = require('express');
let path = require('path');
let mongodb = require('mongodb')
// 在model里可以写set get，在model里可以加.pre('save',()=>{})
let app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(express.static('./images/'));
app.use(express.static('./css/'));
let url = "mongodb://localhost:27017/fit2095_week07";
mongoose.connect(url, function (err) {
    if (err) {
        console.log(err);
    }
});
app.get('/', function (req, res) {
    res.render('index', {
        title: 'Hello Week 07'
    })
});
app.get('/create', function (req, res) {
    res.render('new');
});
app.post('/create', function (req, res) {
    console.log(req.body);
    
    developers.create({'name.firstName':req.body.firstName,'name.lastName':req.body.lastName,'level':req.body.level,'address.state':req.body.state,'address.suburb':req.body.suburb,'address.street':req.body.street,'address.unit':req.body.unit},(err,result)=>{
        console.log('result',result);
        res.redirect('list');
    })
    // method2: 
    // new developers({
    //     'name.firstName': req.body.firstName,
    //     'name.lastName': req.body.lastName,
    //     'level': req.body.level,
    //     'address.state': req.body.state,
    //     'address.suburb': req.body.suburb,
    //     'address.street': req.body.street,
    //     'address.unit': req.body.unit
    // }).save(err => {
    //     if (err) {
    //         console.log(err);
    //     }
    //     res.redirect('list')
    // })
});
app.get('/list',function(req,res){
    developers.find({},function(err,data){
        console.log('data:',data);
        res.render('list',{db:data})
    })
});
app.get('/new_task',function(req,res){
    developers.find({},function(err,data){
        if(err){
            console.log(err);
        }
        res.render('new_task',{db:data})
    })
});
app.post('/new_task',function(req,res){
    console.log('req.body: ',req.body);
    tasks.create(req.body,function(err,result){
        if(err){
            console.log(err);
        }
        else{
            console.log('result',result);
            res.redirect('list_task');
        }
    })
});
app.get('/list_task',function(req,res){
    tasks.find({},function(err,data){
        console.log('data:',data);
        res.render('list_task',{db:data})
    })
})
app.get('/delete',function(req,res){
    tasks.find({},function(err,data){
        console.log('data:',data);
        res.render('delete.ejs',{db:data})
    })
});
app.post('/delete',function(req,res){
    let id = req.body.id;
    let _id = new mongodb.ObjectID(id);
    tasks.deleteOne({_id:_id},function(err,result){
        if(err){
            console.log(err);
        }
    });
    res.redirect('delete');
});
app.get('/delete_status',function(req,res){
    tasks.find({},function(err,data){
        console.log('data:',data);
        res.render('delete_status.ejs',{db:data})
    })
});
app.post('/delete_status',function(req,res){
    tasks.deleteMany({status:'Complete'},function(err,result){
        if(err){
            console.log(err);
        }
        res.redirect('delete_status');
        
    })
});
app.get('/update',function(req,res){
    tasks.find({},function(err,data){
        console.log('data:',data);
        res.render('update.ejs',{db:data})
    })
});
app.post('/update',function(req,res){
    tasks.updateOne({_id:new mongodb.ObjectId(req.body.id)},{$set:{status:req.body.status}},function(err,result){
        if(err){
            console.log(err);
        }
        else{
            res.redirect('list_task');
        }
    })
})
//taks 1:
app.get('/task1',function(req,res){
    tasks.remove({status:"Complete"}).exec();
        res.redirect('list_task');
    
})
//task2:
//new get request that adds 4 tasks in one statement.
app.get('/:number',function(req,res){
    let number = req.params.number;
    console.log(number);
    for(let i = 0;i<number;i++){
        tasks.create({});
    }
    res.redirect('list_task');
})
app.get('/:number',function(req,res){
    let number = req.params.number;
    let arr = []
    for(let i = 0;i<number;i++){
        arr.push({});
    }
    tasks.create(arr)
    res.redirect('list_task');
})


//task 2:
app.get('/task3',function(req,res){
    tasks.find({status:'Complete'}).sort([['taskName',-1]]).limit(3).exec(function(err,result){
        if(err){
            console.log(err);
        }
        else{
            console.log('ressss',result);
            res.render('list_task',{db:result})
        }
    })
})
// task 3
app.get('task4/:oldfirstname/:newfirstname',function(req,res){
    let oldname = req.params.oldfirstname;
    let newname = req.params.newfirstname;
    tasks.updateMany({firstName:oldname},{$set:{firstName:newname}},function(err,tasks){
        if(err){
            console.log(err);
        }
        else{
            res.render('list_task',{db:tasks});
        }
    })

})
app.listen(8080);

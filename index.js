const express = require('express')
const app = express();
const mongoose = require('mongoose')
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const AppError = require('./AppError');
const catchAsync = require('./utils/catchAsync');
//mongoose.set('useFindAndModify', false);
app.engine('ejs', ejsMate)


app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
mongoose.connect('mongodb://localhost:27017/college', { useNewUrlParser: true, useUnifiedTopology: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected successfully");
    })
    .catch(err => {
        console.log("ERROR...!!")
        console.log(err);
    })
const Student = require('./modules/mongoose');
const Branch = require('./modules/branch');
const { findByIdAndUpdate } = require('./modules/mongoose');


app.use(methodOverride('_method'));


/*app.use((req,res)=>{
    res.send("Wellcome")
})*/



app.get('/show/:id', async (req, res) => {
    const { id } = req.params;
    const member = await Student.findById(id)
    res.render('show.ejs', { member })
    //res.send('yes show is working')
})








app.get('/', (req, res) => {
    // res.send("HEY")
    res.render('selectbranch')
})

app.post('/selectbranch/branch', (req, res) => {
    const newbranch = req.body;
    res.render('homepage', { newbranch })
})
app.post('/add/:id', catchAsync(async (req, res, next) => {
    const q = req.params;
    const newbranch = await Branch.findOne({ branch : q.id });
    const newuser = new Student(req.body)
    if (!newbranch) {
        const a = new Branch({ branch: q.id })
        a.allstudents.push(newuser);
        newuser.branch =a.id
        await a.save();
        await newuser.save();
    } else {
        newbranch.allstudents.push(newuser);
        newuser.branch =newbranch.id
        await newbranch.save();
        await newuser.save();
    }
   res.redirect('/showdetails/branch')
}))

app.get('/showdetails/:branch',catchAsync(async(req,res,next)=>{
    const branch=req.params;
    const students=await Branch.findOne(branch).populate('allstudents') ;
    if(!students){
        next(new AppError('No Students found',404))
    }
   res.render('branchstudent',{students})
}))

app.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    const member = await Student.findById(id)
    res.render('delete', { member })
})




app.get('/allforms', async (req, res) => {
    const allform = await Student.find({});
    //   console.log("All good..!")
    res.render('allforms', { allform })
})



app.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await Student.findByIdAndDelete(id)
    res.redirect('/allforms')
    //res.send("Delete is working")
})


app.get('/edit/:id', async (req, res, next) => {
    const { id } = req.params;
    const member = await Student.findById(id)
    if (!member) {
        return next(new AppError('Student not found..!!!', 404));
    }
    res.render('edit', { member })
})








app.put('/editstudent/:id', async (req, res, next) => {
    const { id } = req.params;
    await Student.findByIdAndUpdate(id, req.body)
    res.redirect('/allforms')
})
app.use((err, req, res, next) => {
    const { status = 500, message = "OHH BOY GOT AN ERROR..!!" } = err
    res.status(status).render('errortmp', { message, err })
})
app.listen(3000, () => {
    console.log("Listening to port 3000")
})
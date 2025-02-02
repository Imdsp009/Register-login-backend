const express= require('express');
const app=express();
const bcrypt=require('bcrypt');
const path=require('path');
const jwt = require('jsonwebtoken');
const userModel=require('./models/user')
const cookieParser =require('cookie-parser');
app.set("view engine","ejs")
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser());


app.get("/",function(req,res){
  res.render('index')
})

app.post("/create",(req,res)=>{
  let {username,email,password,age}=req.body;
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(password, salt,async function(err, hash) {

      let createdUser = await userModel.create({
        username,
        email,
        password: hash,
        age
      })
      let token=jwt.sign({email},"shhhhhhhh");
      res.cookie("token",token);
      res.send(createdUser);  
      
    });
  });



})
app.get("/login",function(req,res){
  res.render('login')
  
})

app.post("/login",async function(req,res){
  let user = await userModel.findOne({email: req.body.email})
  if(!user) return res.send("something went wrong")

  bcrypt.compare(req.body.password,user.password,function(err,result){
    if (result) {
      let token=jwt.sign({email:user.email},"shhhhhhhh");
      res.cookie("token",token);
      res.send("yes you can login");}
    else res.send("no you can't login");
  })
  
})

app.get("/logout",function(req,res){
  res.cookie("token","");
})
 



app.listen(3000)
//$2b$10$BZ9t/zfFSYJxjhbSm5xNke8lNFWcs22Ss.latoOwpao9xAiIm4Tpu polololo
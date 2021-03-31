const express=require('express');
const morgan =require('morgan');
const { render } = require('ejs');
var firebase = require('firebase');



const firebaseConfig = {
    apiKey: "AIzaSyA4PvXKXYYCZOroWV3zh3_pZu8TVT7dC20",
    authDomain: "busticket-41a8f.firebaseapp.com",
    projectId: "busticket-41a8f",
    storageBucket: "busticket-41a8f.appspot.com",
    messagingSenderId: "233634749174",
    appId: "1:233634749174:web:dd1ec2750f49237a386ad7",
    measurementId: "G-3H1YGT8BC1"
  };


var  fire= firebase.initializeApp(firebaseConfig);
const db=firebase.firestore();
const auth =firebase.auth();
var auth_status=false;
let current_user;
//static files

auth.onAuthStateChanged(user =>{

    if(user){
        console.log("user loged-in")
        auth_status=true;
        current_user=user
    }
    else{
        console.log("user loged-out")
        auth_status=false;
    }
})

// express app
const app = express();
app.use('/static',express.static('assets'));
app.use(express.urlencoded({extended:true}));
// register view engine
app.set('view engine', 'ejs');

// listening for request
app.listen(3000);

app.get('/',(req,res) =>{
    console.log(auth.user)
    res.render('index',{});
});

app.post('/Logout',(req,res) =>{
    auth.signOut()
    res.redirect('/');
});
app.post('/AddBus',(req,res) =>{
    console.log(req.body)
    db.collection('Bus').add({
        name:req.body.uname,
        from:req.body.from,
        to:req.body.to,
        seat:req.body.seat,
        price:req.body.price,
    }).then(()=>{
        console.log("working")
        res.redirect('/dashboard');
    });
    
});
app.post('/AddAgent',(req,res) =>{
    console.log(req.body)
    db.collection('Agent').add({
        aname:req.body.aname,
        mobile:req.body.mobile,
        pswd:req.body.pswd,
    }).then(()=>{
        console.log("working")
        res.redirect('/dashboard');
    });
});


app.get('/login',(req,res) =>{
if(auth_status)
{
    res.redirect('/dashboard');
}
else{
    res.render('Login',{});
}
    // res.render('Login',{});
});

app.get('/dashboard',(req,res) =>{
    if(auth_status){
    res.render('dashboard',{});
    }
    else{res.redirect('/login')}
});

app.post('/login',(req,res)=>{
    console.log(req.body)
    auth.signInWithEmailAndPassword(req.body.uname,req.body.psw).then((cred)=>{
    console.log(cred.user)
    res.redirect('/dashboard');
    })
    // db.collection('Books').add({
    //     name:'form.name.value',
    //     type:'form.type.value'
    // }).then(()=>{
    //     console.log("working")
    //     res.redirect('/');
    // });
});
app.get('/AgentLogin',(req,res) =>{
    res.render('agent',{});
});
app.post('/agentlogin',(req,res)=>{
    console.log(req.body)
    // WithEmailAndPassword(req.body.uname,req.body.psw).then((cred)=>{
    // console.log(cred.user)
    // //auth.signIn res.redirect('/dashboard');
    // })
    db.collection('Agent').where('aname','==',req.body.uname).get().then((doc)=>{
        console.log(doc)
        doc.forEach(element => {
            if(element.data().pswd==req.body.psw){
                    // const dock=db.collection('').doc(auth.currentUser.uid)
                    const  collections = db.collection('Bus');
                    collections.get().then((d)=>{
                        let buslist=[]
                        d.forEach(doc =>{
                            // console.log(doc.data());
                            // renderList(doc)
                            buslist.push({data:doc.data(),uid:doc.id})
                        })
                        console.log(buslist)
                        res.render('dashboard2',{navlogut:auth_status,list:buslist});
                        
                        
                    })
                    
                    // collections.doc().forEach(collection => {
                    // console.log('Found subcollection with id:', collection.id);
                    // });
                    
                    
                
                // res.render('dashboard2',{}); 
            }  
            else{res.redirect("/AgentLogin")}
        });
        
        
        console.log("working")
        // res.redirect('/');
    });
});


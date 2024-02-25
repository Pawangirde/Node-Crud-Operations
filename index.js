const express = require("express");
var parser = require('body-parser')

const dotenv = require("dotenv")
const app = express();
dotenv.config()
app.set('view engine', 'ejs');
const Connection = require("./config/db");
const { name } = require("ejs");
app.use(express.static(__dirname + "/public"))
app.use(express.static(__dirname + "/views"))

app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());

app.post("/index", (req, res) => {
    console.log(req.body);
    var name = req.body.name;
    var emp_code = req.body.emp_code;
    var salary = req.body.salary;
    try {
        let query =

            Connection.query("INSERT INTO employee (name, emp_code, salary) VALUES (?,?,?)", [name, emp_code, salary], (err, rows) => {
                if (err)
                    console.log(err);
                else
                    res.redirect("/data");
            })
    } catch (error) {
        console.log("error");
    }
})

app.get("/data", (req, res) => {

    Connection.query("select * from employee", (err,rows) => {
        if (err)
            console.log(err);
        else
            res.render("show.ejs",{rows});
    })

})

app.get("/delete-data",(req,res)=>{
    let query="delete from employee where id=?"
    Connection.query(query,[req.query.id],(err,rows)=>{
        if(err){
            console.log(err);
        }else{
            res.redirect("/data")
        }
    })
})
app.get("/update-data",(req,res)=>{
    let query="select * from employee where id=?"
    Connection.query(query,[req.query.id],(err,eachrow)=>{
        if(err){
            console.log(err);
        }else{
            result = JSON.parse(JSON.stringify(eachrow[0]));  
            console.log(result);
            res.render("edit.ejs",{result})
        }
    })
})
app.post("/final-data",(req,res)=>{
    const id=req.body.hidden_id
    const name=req.body.name
    const emp_code=req.body.emp_code
    const salary=req.body.salary
    console.log("id....."+id);
    let query="update employee set name=?,emp_code=?,salary=? where id=?"
    Connection.query(query,[name,emp_code,salary,id],(err,rows)=>{
        if(err){
            console.log(err);
        }else{
        
            res.redirect("/data")
        }
    })
})

app.listen(process.env.PORT || 4000, (err) => {
    if (err) throw err;
    console.log("server started");
})


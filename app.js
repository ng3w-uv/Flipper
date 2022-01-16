var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://backendconcoxdeveloper:V3jUV7QXqEoAtnhy@cluster0-zhjde.mongodb.net/__CONCOX__', {useNewUrlParser: true});
var conn = mongoose.connection;
conn.on('connected', function() {
    console.log('database is connected successfully');
});
conn.on('disconnected',function(){
    console.log('database is disconnected successfully');
})
conn.on('error', console.error.bind(console, 'connection error:'));
module.exports = conn;

//setting up a server 
//initialising a server
var express = require('express');
var cors = require('cors');
// var bodyParser = require('body-parser');
const server = express();
// server.use(cookieParser());
server.use(cors(
    {
        origin:'http://localhost:3000',
        credentials:true,
    }
));

//{"_id":{"$oid":"5c4592a043ecb6530de638ae"},"id":"C1","imei":"0358739053342797","sim":"25","tel":"5755080017073","createdAt":{"$date":"2019-01-21T09:36:32.077Z"},"client":"flipkart"}

const DevicesSchema = {
  _id:{
type:String,
select:false
},
  id: String,
  imei: String,
  sim: String,
  tel: String,
  createdAt: Date,
  client: String
};

//creating a model
const DeviceData = mongoose.model("devices", DevicesSchema);


// {"_id":{"$oid":"605c32b8aa2e61783fd9d604"},"input":"78780d010860465040455275030d0a","tag":"Login","case":"01","imei":"0860465040455275","model":"030d","timezone":"+00:10","info_serial_no":17746,"output":"7878050160760d0a","socket":"::ffff:223.180.224.103:15959","device":"5275","client":"SCT_CONCOX","speed":2,"gps":null,"battery":2,"createdAt":{"$date":"2021-03-25T06:50:32.337Z"}}
//to configure
const StatusSchema = {
  input: String,
  tag: String,
  case: String,
  imei: String,
  model: String,
  timezone: String,
  info_serial_no: Number,
  output: String,
  socket: String,
  device: String,
  client: String,
  speed: Number,
  gps: Array,
  battery: Number,
  createdAt: Date
};

const StatusData = mongoose.model("status", StatusSchema);


server.use(express.json());
server.use(express.urlencoded({extended:true}));
console.log("above post api");

server.post('/api1',async(req,res) =>{
    let devices = [];

    try{
      const resp = await DeviceData.find({}).select('id')//.limit(30)
      // resp.forEach(async(r)=>{
        // console.log(r.id);
        const response = await StatusData.find({device:"5275"}).sort({createdAt:'1'}).limit(50)
        // console.log(response);
        console.log(response.length);
        response.forEach((re)=>{
          if(re.gps!==null){
            // devices["5275"] = [...devices["5275"],{loc:{lat:re?.gps[0],long:re?.gps[1]}}]
            
          devices.push({"5275":{lat:re?.gps[0],long:re?.gps[1]}});
          }

          // console.log(devices["5275"]);
        })
      // })
      res.send(devices);
    }catch(err){
        res.send({
            error: `${err.message}`,
        });
    }
});

//this is at the last
server.listen(process.env.PORT, () => 
console.log("Server Online now"),
);


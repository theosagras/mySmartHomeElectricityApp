var pswCor = "4548";
var path = require('path');
const cors = require('cors')
let starting=false;
var item;//receice from websocket
var relayStates=[false,false,false,false,false,false,false,false,false];
const readline = require('readline');
let strData;//jason για αποστολή . το έχει διαβάσει από αρχείο month

const ModbusRTU = require("modbus-serial");
// create an empty modbus client
const client = new ModbusRTU();
// open connection to a serial port
client.connectRTUBuffered("/dev/ttyUSB0", { baudRate: 9600 });
// set timeout, if slave did not reply back
client.setTimeout(500);


fs = require('fs');

var cDt;
var dataFromSensors = {
   // "psw": false,//correct password
    "msrs1": [0, 0, 0, 0],//measurements
    "msrs2": [0, 0, 0, 0],//measurements
    "Tmpr": null,//temperature
    "Hum": null,
    "doorO": null,//dateDoorLastOpened
    "UsbOn": false
}

//////////////////////arxi kodika gia lipsi object apo webapp
var PORT = 3000;
const express = require("express")
const app = express()
app.listen(PORT, function (err) {
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
    console.log(`Press any key to start recording`);
});

app.use(cors({
    origin: "*",
}))
//////////////////////arxi kodika gia lipsi object item me password kai katastasi diakopton


// Main WebSocket part
    var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({ port: 8090 });

    wss.on('connection', function (ws) {
    ws.on('message', function (data) {
		
		var dataToSend= {
			"psw": false,//correct password
			"cDt":	null,
			"msrs1": [0, 0, 0, 0],//measurements
			"msrs2": [0, 0, 0, 0],//measurements
			"Tmpr": null,//temperature
			"Hum": null,
			"doorO": null,//dateDoorLastOpened
			"UsbOn": false,
			
			"whichaction":0,
			"relayStatesOnServer": [false,false,false,false,false,false,false,false,false],
			"foundDataForThisDate": false
			
		}
		dataToSend.relayStatesOnServer=relayStates;

        item = JSON.parse(data);
        if (item.password === pswCor) {
			console.log("correct password");
			dataToSend.psw=true;
			dataToSend.whichaction=item.whichAction;
			dataToSend.msrs1=dataFromSensors.msrs1;
			dataToSend.msrs2=dataFromSensors.msrs2;
			dataToSend.Tmpr=dataFromSensors.Tmpr;
			dataToSend.Hum=dataFromSensors.Hum;
			dataToSend.doorO=dataFromSensors.doorO;
			dataToSend.UsbOn=dataFromSensors.UsbOn;
			dataToSend.cDt=cDt;
				 
            switch (item.whichAction) {
				case '0'://just check password and send relay states
				case 0:	
						
				break;
                case '1':				
                case '2':               
                case '3':                 
                case '4':           
                case '5':                 
                case '6':                  
                case '7':                  
                case '8':   
					dataToSend.relayStatesOnServer[item.whichAction]=item.relay[item.whichAction];
					relayStates[item.whichAction]=item.relay[item.whichAction];
                    writeModbusRelays(); 
                 //   console.log("Time to show what dataToSend is");  
                 //   console.log(dataToSend);
                 break;
				case '9':
				case 9:
					//console.log("filepath "+filePath);
					let da=""+item.whichDateDataToSend[0];
				    let mon=""+item.whichDateDataToSend[1];
					let whichDayDataToSend=("0" + da).slice(-2);
					let whichMonthDataToSend=("0" + mon).slice(-2);
					let whichYearDataToSend=""+item.whichDateDataToSend[2];
					dataToSend.foundDataForThisDate=false;
					
					
					
					
					let filePath = path.join('./files/',whichYearDataToSend,'/', whichMonthDataToSend, '/',whichDayDataToSend );   
					console.log("filepath "+filePath);
					//which date to get data - prepare json file
					   try {
								const data = fs.readFileSync(filePath, 'utf8')
								strData = data;

								var a = '{';       
								strData= a.concat(strData);           
								if (strData.length>1)
								{
								strData = strData.replace(/.$/, "");

								strData += '}';
								dataToSend.foundDataForThisDate=true;
								}
								
							} catch (err) {
								
								console.error("no data for this day")
								strData=null;
							}
				break;
				}
				
				for(var i = 1; i < relayStates.length ; i++){
                process.stdout.write(i+' '+relayStates[i]+'   ')
				}
				ws.send(JSON.stringify(dataToSend));
		   }
		else {
          
            console.log("Wrong Password");
            ws.send(JSON.stringify(dataToSend));
        }
    
    });


});
//////////////////////telos kodika gia lipsi object item me password kai katastasi diakopton

////////////////////// arxi kodika gia apostoli arxeiou me fetch



app.get('/', function (req, res) {
    var options = {
        root: path.join(__dirname)
    };

    res.json(strData, options, function (err) {
        if (err) {
            next(err);
        } else {
            console.log('Sent:', fileName);
        }
    });
});







/////////////////////// telos kodika gia apostoli arxeioy me fetch
////////////////arxi kodika gia aisthitires temprature, humidity, dooropen, usbOn


//pin raspberry
var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO

// set BCM 27 pin as 'input'
const switchInUsb = new Gpio( '27', 'in', 'both' );


// set BCM 17 pin as 'input'
const switchIn = new Gpio( '17', 'in', 'both' );
let prevValue;
let valueUsb=0;
let valueAlarm=0;


//read temperature & humidity
var sensor = require("node-dht-sensor").promises;

// You can use `initialize` and `setMaxTries` just like before
sensor.setMaxRetries(10);
sensor.initialize(11, 4);

// listen for pin voltage change
setInterval(function() {
  //temper
  sensor.read(11, 4).then(
    function (res) {
        dataFromSensors.Tmpr=res.temperature.toFixed(1);
        dataFromSensors.Hum=res.humidity.toFixed(1);
     
    },
    function (err) {
        console.error("Failed to read sensor data:", err);
    }
);
  
//usb device 5v
switchInUsb.read( ( err, valueUsb ) => {
  if( err ) {
    console.log( 'Error', err );
  }
	
  if (valueUsb===1)
    {
    dataFromSensors.UsbOn=true;
  }
  else 
  {
      dataFromSensors.UsbOn=false;
  }

});

//alarm
switchIn.watch( ( err, valueAlarm ) => {
  if( err ) {
    console.log( 'Error', err );
  }
	
  if (prevValue===0 &&valueAlarm===1)
  {
      
	  dateDoorOpened=new Date();
      dataFromSensors.doorO=showDate(dateDoorOpened);
	console.log("Η πόρτα άνοιξε στις: ");
    if (dataFromSensors.doorO!==null)
	console.log ( dataFromSensors.doorO);
    else console.log ("---");

}
  prevValue=valueAlarm;
} );
}, 300); //Every 300ms = 0,1sec

/////////////////////////////telos kodika gia aisthitires temprature, humidity, dooropen, usbO
////////////////arxi kodika gia metriseis apo modbus - 2 metrites -  apothikeysi olon metriseon se arxio
var newdateLongStr;

// list of meter's id
const metersIdList = [01,02];

const getMetersValue = async (meters) => {
	getnowDateAndPasteTocDt();
	
    try{
        // get value of all meters
        for(let meter of meters) {
            // output value to console
            await getMeterValue(meter);
            // wait 100ms before get another device
            await sleep(100);
	}
    } catch(e){
        // if error, handle them here (it should not)
       // console.log(e)
    } 
    finally {
        // after get all data from salve repeate it again
        console.log('');
        console.log('Time of measurement:');
		console.log(cDt);
		console.log('From meter 1:');
		console.log("volt: " + dataFromSensors.msrs1[0] + " " + " current: " + dataFromSensors.msrs1[1]
						+ " Active Power: " + dataFromSensors.msrs1[2]  + " Consumption: " + dataFromSensors.msrs1[3])  ;
		console.log('From meter 2:');
		console.log("volt: " + dataFromSensors.msrs2[0] + " " + " current: " + dataFromSensors.msrs2[1]
						+ " Active Power: " + dataFromSensors.msrs2[2]  + " Consumption: " + dataFromSensors.msrs2[3]) ; 
						
		  console.log ('Η πόρτα άνοιξε τελευταία φορά: ');
           if (dataFromSensors.doorO!==null)
                console.log ( dataFromSensors.doorO);
                else console.log ("---");
           console.log ('Usb device On: '+dataFromSensors.UsbOn);
           console.log(
            `temp: ${dataFromSensors.Tmpr}°C, ` +
            `humidity: ${dataFromSensors.Hum}%` 
            );
        
        writeValuesToFile(); 
        
	}
};
	
	

const getMeterValue = async (id) => {
    try {
        // set ID of slave
        await client.setID(id);
        // read the 1 registers starting at address 0 (first register)
        let val =  await client.readHoldingRegisters(0, 14)
        .then(
			 function(value) {
				
				 if (id==2)
					{
						dataFromSensors.msrs1[0] = value.data[0];//Voltage
						dataFromSensors.msrs1[1] = value.data[1];//Current
						dataFromSensors.msrs1[2] = value.data[3];//Active Power
						dataFromSensors.msrs1[3] = value.data[8];//Consumption:	
					}				 
				 if (id==1)
					{
						dataFromSensors.msrs2[0] = value.data[0];//Voltage
						dataFromSensors.msrs2[1] = value.data[1];//Current
						dataFromSensors.msrs2[2] = value.data[3];//Active Power
						dataFromSensors.msrs2[3] = value.data[8];//Consumption:	
					}	
				 
				 },
			);
			
        // return the value
        return val.data[0];
    } catch(e){
        // if error return -1
        return -1
    }
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function writeValuesToFile(){
	 
    const fs = require('fs');
	 //διάβασε το αρχείο και φτιάξε jason ετοιμο να σταλεί με fetch

    let year = getYears(cDt);
    let month =  getMonths(cDt);
    let dir= path.join('./files/2022/'+ month);    
    if (!fs.existsSync(dir)){
        fs.mkdir(path.join('./files/2022/', month), (err) => {
            if (err) {
            return console.error(err);
            }
            console.log('Directory created successfully!');
        });
    }
  
    let day = getDay(cDt);
    let filePath = path.join('./files/2022/', month, '/',day );
	
	
	
	//πάρε τον μήνα από date και αν δεν υπάρχει φάκελος θα δημιούργηθεί
 
   
    let regis = JSON.stringify(dataFromSensors)
    
    let prefixInJason = '';

/*
    if (!fs.exis(filePath)) {
        prefixInJason = '{';
        fs.appendFile(filePath, prefixInJason, function (err) {
            if (err) throw err;
            console.log('newMonth');
        });
    }
    */
   
    let nameOfObjectInjson="obj"+cDt;
    JsonFile = '"' + nameOfObjectInjson + '":'+regis+',';
    fs.appendFile(filePath, JsonFile, function (err) {
        if (err) throw err;
        console.log('');
	});
};


////////////////telos kodika gia metriseis apo modbus - 2 metrites -  apothikeysi olon metriseon se arxio



readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 'c') {
    process.exit();
    
  } else if (starting===false){
    console.log(`Starting`);
    starting=true;
    setInterval(() => {
        getMetersValue(metersIdList);
       
    }, 10000);
    
  }
});
function showDate(dateLong){
    let date=new Date(dateLong);
    if (dateLong===null){
        return "---"
    }
    else
    {
    let dates = ("0" + date.getDate()).slice(-2);
	let month = ("0" + (date.getMonth() + 1)).slice(-2);
	let year = date.getFullYear();
	let hours = ("0" + (date.getHours())).slice(-2);
	let minutes = ("0" + date.getMinutes()).slice(-2);
	let seconds = ("0" + (date.getSeconds())).slice(-2);
    return dates + "-" +month + "-" + year+" "+hours + ":" + minutes + ":" + seconds;
    }
    
 return ""
}
function getYears(dateStr)
{
   
    return dateStr.substr(6,4);
}

function getSecs(dateStr)
{
    return dateStr.substr(17,2);;
}

function getMonths(dateStr)
{
    return dateStr.substr(3, 2);
}

function getDay(dateStr)
{
    return dateStr.substr(0,2);
}
function getnowDateAndPasteTocDt()
{
	newdateLongStr=new Date();
      cDt = showDate(newdateLongStr);
        
    let secs = getSecs(cDt);
    if (secs > 50)
    {
       
        cDt = cDt.slice(0, -2) + '50';
    }
    else if (secs > 40)
               cDt = cDt.slice(0, -2) + '40';    
    else if (secs > 30)
              cDt = cDt.slice(0, -2) + '30';    
    else if (secs > 20)
               cDt = cDt.slice(0, -2) + '20';  
    else if (secs > 10)
             cDt = cDt.slice(0, -2) + '10';   
    else
            cDt = cDt.slice(0, -2) + '00';
	
}

function writeModbusRelays() {
    client.setID(3);
    if (item.relay[item.whichAction]) {
        // write the values 0, 0xffff to registers starting at address 5
        // on device number 1.
        client.writeRegister(item.whichAction, 0x0100);//άνοιξε το 2
            //client.writeRegister(1, 0x0200)//έκλεισε το 1

            


        // .then(read);
    }
    else {
        // write the values 0, 0xffff to registers starting at address 5
        // on device number 1.
        //client.writeRegister(2, 0x0100 ) //άνοιξε το 2
        client.writeRegister(item.whichAction, 0x0200)//έκλεισε το 1
            ;
        //.then(read);
    }
}






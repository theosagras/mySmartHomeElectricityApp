$(function () {
    'use strict';


// Items object structure

//var items = [], selectedItem = null;
var dataObj=null;//save json objects with measurements received file port3000
var dataObjToday=null;//save json objects with measurements received file port3000
var upOrDownHorTitle=17;//gia ektiposi ston pinaka oi orizintioi titloi na einai enallaks pano kato
var dataReceivedWebSocket;
var item= {
    "corPassword":false,
    "password": "",//password
    "whichAction": 0, //1-8 relay,   9 on measurement1,    10 on measurement2 
    "relay": [false,false,false,false,false,false,false,false,false],
     "whichDateDataToSend":[0,0,0]
            
}
var items = {
   // "psw": false,//correct password
    "msrs": [0, 0, 0, 0],//measurements
    "cDt": new Date(),//current date
    "Tmpr": null,//temperature
    "Hum": null,
    "doorO": null,//dateDoorLastOpened
    "UsbOn": false
}

var waitAfterSwitchChange=false;
const startbtn=document.getElementById('startbtn');
var appIsRunning=false;//deixnei an exei patithei startbutton
const btnGetValues=document.getElementById("getvalues");
const passwordLabel=document.getElementById("passwordLabel");
const pasDiv=document.getElementById('passwordDiv');
const heading=document.getElementById('heading');
const selectedDayConsBtn=document.getElementById("selectedDayConsBtn");
const dayPicker=document.getElementById("dayPicker")
var datePicked;

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
function setDateDateToReceive(dateSelected){
    let date=new Date(dateSelected);
    
    let dates = date.getDate();
	let month = date.getMonth()+1;
	let year = date.getFullYear();
    item.whichDateDataToSend[0]=dates;
     item.whichDateDataToSend[1]=month;
      item.whichDateDataToSend[2]=year;
      console.log(item.whichDateDataToSend);    
    
}

document.getElementById('passwordnput').addEventListener('change', function(evt) {
    
    item.password=document.getElementById('passwordnput').value;
    
}, false);


function startPressed() {
     item.whichAction=0;//code 0 to check password and start
     ws.send(JSON.stringify(item));  
     
};

$('#startbtn').on('click', function () {
    startPressed();
});









// Communication functions
    //var ws = new WebSocket('wss://9f00-188-73-233-157.eu.ngrok.io');
	    
	var ws = new WebSocket('wss://wide-pigs-brush-45-139-212-221.loca.lt');
   // var ws = new WebSocket('ws://localhost:8090');
    ws.addEventListener('open', function (ev) {
        ws.addEventListener('message', function (msg) {
            dataReceivedWebSocket = JSON.parse(msg.data);
            
            if (dataReceivedWebSocket.psw===false)
                 item.corPassword=false;
            else
                item.corPassword=true;
                
           
            if (item.corPassword===true){
                
                document.getElementById('main').style.visibility = "visible";
                appIsRunning=true;
              
                if (startbtn!=null)
                {                
                    startbtn.remove();                               
                    
                }
                if (  heading!=null)   heading.remove();   
                if (pasDiv!=null)  pasDiv.remove();
                
                if (passwordLabel!=null)
                {
                    passwordLabel.style.color="white";
                    passwordLabel.textContent="Enter Password: ";
                }
                if (dataReceivedWebSocket.whichaction===9)
                {
                   // getValuesFromServerFile();
                }
                else
                {
                    
                    updateMeasurements();
                    refreshRelayButtons();
                }
                
            }
            else
            {
                
                
                if (passwordLabel!=null)
                {
                    passwordLabel.textContent="Wrong Password! Enter Password: ";
                    passwordLabel.style.color="darkred";
                }
                
            }
           // $('.modal').siblings().remove();
          //  $.each(items, function (index, item) {
          //      var ulId = ( item.completed ) ? '#completedItems' : '#currentItems';
           //     $(ulId + ' > .modal').before('<li id="'+index+'">'+item.text+'</li>');
           // });
        });
    });
function refreshRelayButtons()
{
    for (let i=1;i<item.relay.length;i++)
    {
        let str="open"+i;
        const switElOpen= document.getElementById(str)
        let str2="close"+i;
        const switElClose= document.getElementById(str2)

        if (dataReceivedWebSocket.relayStatesOnServer[i]==true)
            {
                switElOpen.textContent='is ON';
                switElClose.textContent='turn OFF';
                
               // switElOpen.style.backgroundColor  = "black";
               // switElClose.style.backgroundColor=  "goldenrod";
            }
        else
            {
                 switElOpen.textContent='turn ON';
               // switElOpen.style.backgroundColor=  "goldenrod";
              // switElClose.style.backgroundColor  = "black";
               switElClose.textContent='is OFF';
            }
    }
}
function updateMeasurements(){
    document.getElementById("TimeMeasur1").textContent=dataReceivedWebSocket.cDt;
    document.getElementById("Temperature").textContent=dataReceivedWebSocket.Tmpr;
    document.getElementById("Humidity").textContent=dataReceivedWebSocket.Hum;
    if (dataReceivedWebSocket.dateDoorLastOpened===null||dataReceivedWebSocket.doorO===undefined)
        document.getElementById("doorOpened").textContent="-";
    else
       document.getElementById("doorOpened").textContent=dataReceivedWebSocket.doorO;
    document.getElementById("Voltage1").textContent=(dataReceivedWebSocket.msrs1[0]/10);
    document.getElementById("Current1").textContent=(dataReceivedWebSocket.msrs1[1]/10);
    document.getElementById("ActivePower1").textContent=dataReceivedWebSocket.msrs1[2];
    //document.getElementById("ReactivePower1").textContent=items.msrs[4];
    //document.getElementById("ApparentFactor1").textContent=items.msrs[5];
    document.getElementById("ActiveEnergyA1").textContent=dataReceivedWebSocket.msrs1[3];
    
       document.getElementById("Voltage2").textContent=(dataReceivedWebSocket.msrs2[0]/10);
    document.getElementById("Current2").textContent=(dataReceivedWebSocket.msrs2[1]/10);
    document.getElementById("ActivePower2").textContent=dataReceivedWebSocket.msrs2[2];
    //document.getElementById("ReactivePower1").textContent=items.msrs[4];
    //document.getElementById("ApparentFactor1").textContent=items.msrs[5];
    document.getElementById("ActiveEnergyA2").textContent=dataReceivedWebSocket.msrs2[3];
   // document.getElementById("ActiveEnergyB1").textContent=items.msrs[7];
   //  document.getElementById("ReActiveEnergyA1").textContent=items.msrs[10];
   // document.getElementById("ReActiveEnergyB1").textContent=items.msrs[9];
     document.getElementById("UsbDevice").textContent=dataReceivedWebSocket.UsbOn;
    
}



setInterval(()=>{
        if (appIsRunning===true){//app is running
            {
                btnGetValues.textContent = "GETTING VALUES";
                btnGetValues.disabled = true;
                takeData();
                setTimeout(()=>{
                    this.disabled = false;
                    btnGetValues.textContent = "Get Values";}, 2200);
                }  
            }
   
        }, 60000); 
 
 $('#getvalues').on('click', function () {
    takeData();        
});

function takeData()
{
        item.whichAction=0;
        btnGetValues.textContent = "WAIT";
        //setDateDateToReceive();
        ws.send(JSON.stringify(item));
        btnGetValues.disabled = true;
        setTimeout(()=>{
            btnGetValues.disabled = false;
            btnGetValues.textContent = "Get Values";
            }, 4000); 
}

/*
$('#switch2').on('click', function () {
   // item.switch[1]=true;
    const btnSwitch2=document.getElementById("switch2");
    btnSwitch2.textContent = "WAIT";

    console.log("switch1Pressed");
   ws.send(JSON.stringify(item));
    this.disabled = true;
      setTimeout(()=>{
    this.disabled = false;
    btnSwitch2.textContent = "TAKE VALUES";
    console.log('Button Activated')}, 4000);
    
});
*/



 $('.openRelay').on('click', function () {
     if (waitAfterSwitchChange===false)
     {
        const labelSwitch=document.getElementById("SwitchesLabel");
        labelSwitch.textContent = "WAIT";
        waitAfterSwitchChange=true;
        let str=""+this.id;
        let numRelay=str.charAt(str.length - 1);
        item.relay[numRelay]=true;
        item.whichAction=numRelay;        
        //setDateDateToReceive();
        ws.send(JSON.stringify(item));
        setTimeout(()=>{
               waitAfterSwitchChange=false;
               labelSwitch.textContent = "Switches:";
        }, 1500); 
    }
    
});

$('.closeRelay').on('click', function () {
     if (waitAfterSwitchChange===false)
     {
        const labelSwitch=document.getElementById("SwitchesLabel");
        labelSwitch.textContent = "WAIT";
         waitAfterSwitchChange=true;
         let str=""+this.id;
         let numRelay=str.charAt(str.length - 1);
         item.relay[numRelay]=false;
         item.whichAction=numRelay;
         ws.send(JSON.stringify(item));
         setTimeout(()=>{
               waitAfterSwitchChange=false;
               labelSwitch.textContent = "Switches:";
        }, 1500); 
     }
});



$('#selectedDayConsBtn').on('click', function () {
    resetTables();
    selectedDayConsBtn.textContent = "WAIT!";
    
   
    if (dayPicker.value==="")
    {
   
        selectedDayConsBtn.textContent = "No date selected!";
         setTimeout(()=>{               
           
             selectedDayConsBtn.disabled = false;       
             selectedDayConsBtn.textContent = "Display Day's consumption"; 
        }, 2000); 
    }
    else
    {
         datePicked=showDate(dayPicker.value)
         console.log(datePicked);
         
         
         
        selectedDayConsBtn.disabled = true;
        setDateDateToReceive(dayPicker.value);
        getValuesFromServerFile();
        
       
        
        item.whichAction=9;//code 9 to check password and get one day consumption
        dataObj=null;
        ws.send(JSON.stringify(item)); 
        var intervalID;
         setTimeout(()=>{               
            if (dataReceivedWebSocket.foundDataForThisDate===false)
                {
                    selectedDayConsBtn.textContent = "No data for this date"; 
                }
            else 
                {
                    var counter=0;
                    const intervalGet = setInterval(function() {
                        console.log(dataObj);
                        counter++;
                        if (dataObj!=null)
                        {
                            clearInterval(intervalGet); //
                            getDaysData();
                        }
                      
                        if (counter===5)
                            {
                                clearInterval(intervalGet); //
                                selectedDayConsBtn.textContent = "Error Getting Data, try Again!"; 
                            }
                      }, 2000);
                     
                        
                }
        }, 1000);  
       
        setTimeout(()=>{               
           
             selectedDayConsBtn.disabled = false;       
             selectedDayConsBtn.textContent = "Display Day's consumption"; 
        }, 5000); 
     
}
        
    
});

function getValuesFromServerFile()
{
       //let urla = 'https://reqres.in/api/users'

   
   let urla = 'https://pretty-dots-tell-45-139-212-221.loca.lt';

    //let urla = 'http://localhost:3000';
    fetch(urla).then(response => response.json())
    .then(data =>{;{
        
        dataObj=JSON.parse(data);
        console.log("newDataReceived");
    }
   
    
   // document.getElementById("dataFromFile1").textContent=dataObj.obj0.CorPass;
   //console.log(dataFromFile);
    }); 
    
        //document.getElementById("dataFromFile1").textContent=data);
    
    
    
    
}

function getDaysData()
{
    selectedDayConsBtn.textContent = "WAIT!";
    selectedDayConsBtn.disabled = true;
    setTimeout(()=>{
        createTables().then(
                function(value) {
                    selectedDayConsBtn.textContent = "Display Day's consumption";
                     
                     selectedDayConsBtn.disabled = false;
                     const tableHeadEl=document.getElementById("tableHead");
                     tableHeadEl.innerHTML = ""+item.whichDateDataToSend[0]+"-"+
                     item.whichDateDataToSend[1]+"-"+item.whichDateDataToSend[2]+" Consumption <br> per Hour (WH)";
                     const table2HeadEl=document.getElementById("table2Head");
                     table2HeadEl.innerHTML = ""+item.whichDateDataToSend[0]+"-"+
                     item.whichDateDataToSend[1]+"-"+item.whichDateDataToSend[2]+" Consumption of living room<br>devices per Hour (WH)";
                    const table3HeadEl=document.getElementById("table3Head");
                     table3HeadEl.innerHTML = ""+item.whichDateDataToSend[0]+"-"+
                     item.whichDateDataToSend[1]+"-"+item.whichDateDataToSend[2]+" Temperatures <br> per Hour (C)";
                },
                function(error) {}
            );;
      
          
    }, 100); 
}
var datasetCons;
var datasetConsLivingRoom;
var datasetJustCDTS;
    
var datasetTemperature;
var daySaveEuros;
var totalTimeUsbOn;

//table day consumptions
async function createTables(){
    var datasetTemp = []; 
   
    datasetJustCDTS=[];
    totalTimeUsbOn=0;
// javascript
// take data and put them in table
    let numberOfMeas=Object.keys(dataObj).length-1;
    console.log("number of measurements"+ numberOfMeas);
    
    let consum=0;
    let consumLivingRoom=0;
    let initConsum=Object.values(dataObj)[1].msrs2[3];
    let prevConsumLivingRoom=Object.values(dataObj)[1].msrs1[3];
    let prevConsum=initConsum;
    let dayConsum=0;
    let oneMeter=null;
    let oneMeterObjName=null;
    for (let i=0;i<numberOfMeas;i++)//mazi consumption and Temperature
            {    
                oneMeter= Object.values(dataObj)[i]; 
                oneMeterObjName=Object.keys(dataObj)[i];
                if (oneMeter.UsbOn===true)
                {
                   totalTimeUsbOn+=10; 
                }
                    let strDate=oneMeterObjName.substring(3, 22)
                    let strTime=oneMeterObjName.substring(17, 22)
                    // console.log(strTime);
                   
                                if (strTime=='59:50')                                                      
                                   {  
                                        console.log(strDate);
                                        datasetTemp.push(oneMeter);    
                                        datasetJustCDTS.push(oneMeterObjName.substring(14, 16));  
                               }
            }
        
    //console.log(datasetTemp);
    
                
    datasetCons = []; 
  
    datasetTemperature = [];
    datasetConsLivingRoom = [];
  
    for (let m=0;m<24;m++)
    {
        let found=false;
        for (let k=0;k<datasetTemp.length;k++)
        {
            let strHour=Object.keys(datasetJustCDTS)[k];
            let numHourtmp=parseInt(strHour);
            if (numHourtmp===m)
            {
                consum=Object.values(datasetTemp)[k].msrs2[3];
                dayConsum=consum-initConsum;
                consumLivingRoom=Object.values(datasetTemp)[k].msrs1[3];
                datasetTemperature.push(Object.values(datasetTemp)[k].Tmpr.substring(0, 2));
                datasetCons.push(consum-prevConsum);
                prevConsum=consum;
                datasetConsLivingRoom.push(prevConsumLivingRoom-consumLivingRoom);
                prevConsumLivingRoom=consumLivingRoom;
                found=true;
                continue;
            }                                                             
                 
        }
        if (!found)
        {
            datasetCons.push(null);
            datasetTemperature.push(null);
            continue;
        }
    }
            paintChartBar1();//Totalconsumption
            paintChartBar2();//LivingRoomConsumption
            paintChartBar3();//temperature
            dayConsum=dayConsum/1000;
            daySaveEuros=dayConsum*0.20
            const table1AboveEl=document.getElementById("table1Above");
                     table1AboveEl.innerHTML = "You saved "+dayConsum.toFixed(2)+" KWH * 0.20euro= "+ daySaveEuros.toFixed(2)+" euro by Solar Power (0.15euro/KWH)";
              totalTimeUsbOn=totalTimeUsbOn/60;
              const timeUsbOnEl=document.getElementById("timeUsbOn");
                     timeUsbOnEl.innerHTML = "Your computer was on for "+totalTimeUsbOn.toFixed(2)+" minutes";
    
              
    }




function paintChartBar1(){//consumptions
var svgWidth = 600, svgHeight = 300, barPadding = 3;
var barWidth = (svgWidth / datasetCons.length);


var svg = d3.select(".bar1chart")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
    
var yScale = d3.scaleLinear()
    .domain([0, d3.max(datasetCons)])
    .range([0, svgHeight]);
        
var bar2Chart = svg.selectAll("rect")
    .data(datasetCons)
    .enter()
    .append("rect")
    .attr("y", function(d) {
         return svgHeight - yScale(d) 
    })
    .attr("height", function(d) { 
        return yScale(d); 
    })
    .attr("width", barWidth - barPadding)
    .attr("transform", function (d, i) {
        var translate = [barWidth * i, 0]; 
        return "translate("+ translate +")";
    });
    
    var text = svg.selectAll("text")
    .data(datasetCons)
    .enter()
    .append("text")
    .text(function(d) {
        return d;
    })
    .attr("y", function(d, i) {
       
        if (upOrDownHorTitle===17)
            upOrDownHorTitle=0;
        else upOrDownHorTitle=17;
         return svgHeight -2-upOrDownHorTitle;
    })
    .attr("x", function(d, i) {
        return barWidth * i;
    })
    .attr("fill", "goldenrod");

}
function paintChartBar2(){//consumptions of Living Room
var svgWidth = 600, svgHeight = 300, barPadding = 3;
var barWidth = (svgWidth / datasetConsLivingRoom.length);


var svg = d3.select(".bar2chart")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
    
var yScale = d3.scaleLinear()
    .domain([0, d3.max(datasetConsLivingRoom)])
    .range([0, svgHeight]);
        
var bar2Chart = svg.selectAll("rect")
    .data(datasetCons)
    .enter()
    .append("rect")
    .attr("y", function(d) {
         return svgHeight - yScale(d) 
    })
    .attr("height", function(d) { 
        return yScale(d); 
    })
    .attr("width", barWidth - barPadding)
    .attr("transform", function (d, i) {
        var translate = [barWidth * i, 0]; 
        return "translate("+ translate +")";
    });
    
    var text = svg.selectAll("text")
    .data(datasetConsLivingRoom)
    .enter()
    .append("text")
    .text(function(d) {
        return d;
    })
    .attr("y", function(d, i) {
       
        if (upOrDownHorTitle===17)
            upOrDownHorTitle=0;
        else upOrDownHorTitle=17;
         return svgHeight -2-upOrDownHorTitle;
    })
    .attr("x", function(d, i) {
        return barWidth * i;
    })
    .attr("fill", "goldenrod");

}
                

function paintChartBar3(){//temperatures
var svgWidth = 600, svgHeight = 300, barPadding = 3;
var barWidth = (svgWidth / datasetTemperature.length);


var svg = d3.select(".bar3chart")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
    
var yScale = d3.scaleLinear()
    .domain([0, 50])
    .range([0, svgHeight]);
        
var barChart = svg.selectAll("rect")
    .data(datasetTemperature)
    .enter()
    .append("rect")
    .attr("y", function(d) {
         return svgHeight - yScale(d) 
    })
    .attr("height", function(d) { 
        return yScale(d); 
    })
    .attr("width", barWidth - barPadding)
    .attr("transform", function (d, i) {
        var translate = [barWidth * i, 0]; 
        return "translate("+ translate +")";
    });
    
    var text = svg.selectAll("text")
    .data(datasetTemperature)
    .enter()
    .append("text")
    .text(function(d) {
        return d;
    })
    .attr("y", function(d, i) {
       
        if (upOrDownHorTitle===17)
            upOrDownHorTitle=0;
        else upOrDownHorTitle=17;
         return svgHeight -2-upOrDownHorTitle;
    })
    .attr("x", function(d, i) {
        return barWidth * i;
    })
    .attr("fill", "goldenrod");
}
function resetTables()
{
  
var svg = d3.select(".bar1chart")

svg.selectAll('*').remove();
svg= d3.select(".bar2chart")
svg.selectAll('*').remove();
svg= d3.select(".bar3chart")
svg.selectAll('*').remove();
const tableHeadEl=document.getElementById("tableHead");
tableHeadEl.innerHTML = " Consumption <br> per Hour (WH)";
const table2HeadEl=document.getElementById("table2Head");
table2HeadEl.innerHTML =" Consumption of living room<br>devices per Hour (WH)";
const table3HeadEl=document.getElementById("table3Head");
table3HeadEl.innerHTML =" Temperatures <br> per Hour (C)";
const table1AboveEl=document.getElementById("table1Above");
table1AboveEl.innerHTML ="";
}




});

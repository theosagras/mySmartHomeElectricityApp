$(function () {
    'use strict';

// Items object structure

//var items = [], selectedItem = null;
var dataObj=null;//save json objects with measurements received file port3000
var dataObjToday=null;//save json objects with measurements received file port3000
var upOrDownHorTitle=17;//gia ektiposi ston pinaka oi orizintioi titloi na einai enallaks pano kato
var item= {
    "corPassword":false,
    "password": "",//password
    "whichAction": 0, //1-8 relay,   9 on measurement1,    10 on measurement2 
    "relay": [false,false,false,false,false,false,false,false,false],
     whichDateDataToSend:[0,0,0]
            
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

function showDate(datesa){
    let date=new Date(datesa);

    if (datesa===null){
        return "---"
    }
    else
    {
    let dates = ("0" + date.getDate()).slice(-2);
	let month = ("0" + (date.getMonth() + 1)).slice(-2);
	let year = date.getFullYear();
	let hours = ("0" + (date.getHours())).slice(-2)
	let minutes = ("0" + date.getMinutes()).slice(-2)
	let seconds = ("0" + (date.getSeconds())).slice(-2)
    return year + "-" + month + "-" + dates + " " + hours + ":" + minutes + ":" + seconds;
    }
    
 return ""
}

document.getElementById('passwordnput').addEventListener('change', function(evt) {
    
    item.password=document.getElementById('passwordnput').value;
    
}, false);



// Communication functions
    //var ws = new WebSocket('wss://9f00-188-73-233-157.eu.ngrok.io');
	    
	var ws = new WebSocket('wss://ninety-ads-crash-109-242-73-166.loca.lt');
    //var ws = new WebSocket('ws://localhost:8090');
    ws.addEventListener('open', function (ev) {
        ws.addEventListener('message', function (msg) {
            items = JSON.parse(msg.data);
            if (items===null)
                 item.corPassword=false;
            else
                item.corPassword=true;
            const dataFromFileDisplay=document.getElementById("dataToday");
           if (item.corPassword===true)
           {
                dataFromFileDisplay.textContent = "";
            document.getElementById("passwordLabel").style.color="white";
            document.getElementById("passwordLabel").textContent="Enter Password: ";
           updateMeasurements();
            refreshRelayButtons();
           
           
           }
           else
           {
          dataFromFileDisplay.textContent = "Wrong Password!";
           document.getElementById("passwordLabel").textContent="Wrong Password! Enter Password: ";
           document.getElementById("passwordLabel").style.color="darkred";
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

        if (item.relay[i]==true)
            {
                switElOpen.textContent='Relay#'+ i+ ' is ON';
                switElClose.textContent='close-Relay#'+ i;
                
               // switElOpen.style.backgroundColor  = "black";
               // switElClose.style.backgroundColor=  "goldenrod";
            }
        else
            {
                 switElOpen.textContent='open-Relay#'+ i;
               // switElOpen.style.backgroundColor=  "goldenrod";
              // switElClose.style.backgroundColor  = "black";
               switElClose.textContent='Relay#'+ i+ ' is OFF';
            }
    }
}
function updateMeasurements(){
   
      document.getElementById("TimeMeasur1").textContent=items.cDt;
    document.getElementById("Temperature").textContent=items.Tmpr;
    document.getElementById("Humidity").textContent=items.Hum;
    if (items.dateDoorLastOpened===null||items.doorO===undefined)
        document.getElementById("doorOpened").textContent="-";
   else
       document.getElementById("doorOpened").textContent=items.doorO;
    document.getElementById("Voltage1").textContent=(items.msrs[0]/10);
    document.getElementById("Current1").textContent=(items.msrs[1]/10);
    document.getElementById("ActivePower1").textContent=items.msrs[2];
    //document.getElementById("ReactivePower1").textContent=items.msrs[4];
    //document.getElementById("ApparentFactor1").textContent=items.msrs[5];
    document.getElementById("ActiveEnergyA1").textContent=items.msrs[3];
   // document.getElementById("ActiveEnergyB1").textContent=items.msrs[7];
   //  document.getElementById("ReActiveEnergyA1").textContent=items.msrs[10];
   // document.getElementById("ReActiveEnergyB1").textContent=items.msrs[9];
     document.getElementById("UsbDevice").textContent=items.UsbOn;
    
      //let urla = 'https://reqres.in/api/users'
   
  // let urla = 'http://localhost:3000';
   let urla = 'https://little-lines-argue-109-242-73-166.loca.lt';



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  fetch(urla).then(response => response.json())
    .then(data =>{;{
    dataObj=JSON.parse(data);
    console.log(dataObj);
    }
   
    
   // document.getElementById("dataFromFile1").textContent=dataObj.obj0.CorPass;
   //console.log(dataFromFile);
    }); 
        //document.getElementById("dataFromFile1").textContent=data);
    
}
setInterval(()=>{
               const btnSwitch1=document.getElementById("switch1");
           btnSwitch1.textContent = "TAKING VALUES";
             btnSwitch1.disabled = true;
             takeData();
              setTimeout(()=>{
                this.disabled = false;
                btnSwitch1.textContent = "TAKE VALUES";
                console.log('Button Activated')}, 2200);    
   
        }, 60000); 
 
 $('#switch1').on('click', function () {
    takeData();
        
});
function takeData()
{
    item.whichAction=9;
    const btnSwitch1=document.getElementById("switch1");
    btnSwitch1.textContent = "WAIT";
    setDateDateToReceive();
   ws.send(JSON.stringify(item));
   btnSwitch1.disabled = true;
      setTimeout(()=>{
        btnSwitch1.disabled = false;
        btnSwitch1.textContent = "TAKE VALUES";
        console.log('Button Activated')}, 4000); 
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

function setDateDateToReceive()
{

    
    
    let date=new Date();

    
    let dates = date.getDate();
	let month = date.getMonth() + 1;
	let year = date.getFullYear();
	
    //return year + "-" + month + "-" + dates + " " + hours + ":" + minutes + ":" + seconds;
    
    item.whichDateDataToSend[0]=dates;
     item.whichDateDataToSend[1]=month;
      item.whichDateDataToSend[2]=year;
      console.log(item.whichDateDataToSend);
    
    
}

 $('.openRelay').on('click', function () {
     let str=""+this.id;
     let numRelay=str.charAt(str.length - 1);
    item.relay[numRelay]=true;
        console.log(item.relay[numRelay]);
    
    item.whichAction=numRelay;
     console.log("opened Relay "+numRelay);
     setDateDateToReceive();
    ws.send(JSON.stringify(item));
    disableBtns();
});

$('.closeRelay').on('click', function () {
      let str=""+this.id;
      let numRelay=str.charAt(str.length - 1);
    item.relay[numRelay]=false;
    item.whichAction=numRelay;
    console.log("closed Relay "+numRelay);
   ws.send(JSON.stringify(item));
       disableBtns();
});
function disableBtns()
{
      const labeSwitch=document.getElementById("SwitchesLabel");
    labeSwitch.textContent = "WAIT";
    document.getElementById("open1").disabled=true;    
   document.getElementById("close1").disabled=true;  
    document.getElementById("open2").disabled=true;    
   document.getElementById("close2").disabled=true;  
   document.getElementById("open3").disabled=true;    
   document.getElementById("close3").disabled=true;  
   document.getElementById("open4").disabled=true;    
   document.getElementById("close4").disabled=true;  
   document.getElementById("open5").disabled=true;    
   document.getElementById("close5").disabled=true;  
   document.getElementById("open6").disabled=true;    
   document.getElementById("close6").disabled=true;  
   document.getElementById("open7").disabled=true;    
   document.getElementById("close7").disabled=true; 
   document.getElementById("open8").disabled=true;    
   document.getElementById("close8").disabled=true;   
    
          setTimeout(()=>{
                labeSwitch.textContent = "Switches";
    document.getElementById("open1").disabled=false;    
   document.getElementById("close1").disabled=false;  
       document.getElementById("open2").disabled=false;    
   document.getElementById("close2").disabled=false;  
   document.getElementById("open3").disabled=false;    
   document.getElementById("close3").disabled=false;  
   document.getElementById("open4").disabled=false;    
   document.getElementById("close4").disabled=false;  
   document.getElementById("open5").disabled=false;    
   document.getElementById("close5").disabled=false;  
   document.getElementById("open6").disabled=false;    
   document.getElementById("close6").disabled=false;  
   document.getElementById("open7").disabled=false;    
   document.getElementById("close7").disabled=false; 
   document.getElementById("open8").disabled=false;    
   document.getElementById("close8").disabled=false;  

   }, 2000);    
}


$('#downloadToday').on('click', function () {
    const dataFromFileDisplay=document.getElementById("dataToday");
    
     const buttonToday=document.getElementById("downloadToday");
          dataFromFileDisplay.textContent = "WAIT!";
     
        buttonToday.disabled = true;
        if (dataObj===null)
        {
           dataFromFileDisplay.textContent = "Take Values first!"; 
        }
        else 
        {
             if (item.corPassword===true)
                takeTodaysData();
                else
                dataFromFileDisplay.textContent = "Wrong Password!"; 
                
        }
        setTimeout(()=>{
               
           
             buttonToday.disabled = false;       
   
        }, 2000); 
});

function takeTodaysData()
{
    const buttonToday=document.getElementById("downloadToday");
    const dataFromFileDisplay=document.getElementById("dataToday");
     dataFromFileDisplay.textContent = "WAIT!";
        buttonToday.disabled = true;
        setTimeout(()=>{
            createTable().then(
                function(value) {
                    dataFromFileDisplay.textContent = "OK!";
                     
                     buttonToday.disabled = false;
                     const tableHeadEl=document.getElementById("tableHead");
                     tableHeadEl.innerHTML = ""+item.whichDateDataToSend[0]+"-"+
                     item.whichDateDataToSend[1]+"-"+item.whichDateDataToSend[2]+" Measurements <br> per Hour (WH)";
                },
                function(error) {}
            );;
      
          
        }, 100); 
    
}


async function createTable(){
    const dataFromFileDisplay=document.getElementById("dataToday");
    var datasetTemp = [];
    
// javascript
// take data and put them in table
    let counterForSkip=0;
    let numberOfMeas=Object.values(dataObj).length-1;
    console.log(numberOfMeas);
    
    let consum=0;
    let prevConsum=Object.values(dataObj)[1].msrs[3];
   
    console.log(prevConsum);
   
    for (let i=0;i<numberOfMeas;i++)
                {      
                    
                       // let hh=""+h;
                       // hh="0" + hh.slice(-2);
                        let str=showDate(Object.values(dataObj)[i].cDt);   
                         
                        let numMinute=str.charAt(14);     
                        let numMinute2=str.charAt(15);
                        let numMinutes= parseInt(numMinute+numMinute2);
                      //  let numHourA=str.charAt(11);
                       // let numHourB=str.charAt(12);
                         let secsA=str.charAt(17);
                        let secsB=str.charAt(18);
                      //  let numHour=parseInt(numHourA+numHourB);
                        let secs=parseInt(secsA+secsB);
                       // console.log(numHourA+numHourB+'-'+numMinute+numMinute2+secs); 
                      // console.log(numMinute);  
                         
                                if ((numMinutes===59)&&(secs===50))                                                      
                                   {  
                                            console.log(str);
                                       // consum=Object.values(dataObj)[i].msrs[3];
                                        datasetTemp.push(Object.values(dataObj)[i]);                              
                                   }
                               
            }
            console.log(datasetTemp);
         var dataset = []; 
         for (let m=0;m<24;m++)
            {
                let found=false;
                 for (let k=0;k<datasetTemp.length;k++)
                 {
                     let strTemp=showDate(Object.values(datasetTemp)[k].cDt);
                  
                     let numHourAtmp=strTemp.charAt(11);
                     
                    let numHourBtmp=strTemp.charAt(12);
                  
                    let numHourtmp=parseInt(numHourAtmp+numHourBtmp);
                    
                         if (numHourtmp===m)
                             {
                                 consum=Object.values(datasetTemp)[k].msrs[3];
                                dataset.push(consum-prevConsum);
                                prevConsum=consum;
                                found=true;
                                continue;
                            }   
                                                  
         
                }
                if (!found)
                {
                    dataset.push(null);
                    continue;
                }
            }
        
            
    
    //let objectName=Object.keys(dataObj)[0];
    
   // console.log(dataObj.objectName);
    //console.log(Object.values(dataObj)[100]);
    
    //console.log(Object.values(dataObj)[numberOfMeas]);
    
    
    
    /*
    let olderMes=numberOfMeas-600;
    if (olderMes<35)
    olderMes=35;
    
for (let i=0;i<numberOfMeas;i++)
{
    let consum=0;
    let prevConsum=0;
    if (counterForSkip==0){
         prevConsum=Object.values(dataObj)[i-30].msrs[3];
        consum=Object.values(dataObj)[i].msrs[3];
        if ((consum-prevConsum)>0)
            dataset.push(consum-prevConsum);
         
         console.log("consum"+consum);
          console.log("prevConsum"+prevConsum);
           console.log("");
    
    }
    counterForSkip++;
    if (counterForSkip==30)//meas per 5 minutes
        counterForSkip=0;
   
}
*/
var svgWidth = 600, svgHeight = 300, barPadding = 3;
var barWidth = (svgWidth / dataset.length);


var svg = d3.select('svg')
    .attr("width", svgWidth)
    .attr("height", svgHeight);
    
var yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset)])
    .range([0, svgHeight]);
        
var barChart = svg.selectAll("rect")
    .data(dataset)
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
    .data(dataset)
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

});

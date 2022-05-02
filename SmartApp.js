$(function () {
    'use strict';

// Items object structure

//var items = [], selectedItem = null;
var dataObj=null;//save json objects with measurements received file port3000
var item= {
    "password": "",//password
    "whichAction": 0, //1-8 relay,   9 on measurement1,    10 on measurement2 
    "relay": [false,false,false,false,false,false,false,false,false]
    //"switch": [false,false]
}
var items = {
    "psw": false,//correct password
    "msrs": [0, 0, 0, 0],//measurements
    "cDt": new Date(),//current date
    "Tmpr": null,//temperature
    "Hum": null,
    "doorO": null,//dateDoorLastOpened
    "UsbOn": false
}

function showDate(dates){
    let date=new Date(dates);

    if (dates===null){
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
	    
	var wss = new WebSocket('wss://fair-toes-fry-109-242-74-79.loca.lt);
    //var ws = new WebSocket('ws://localhost:8090');
    ws.addEventListener('open', function (ev) {
        ws.addEventListener('message', function (msg) {
            items = JSON.parse(msg.data);
           if (items.psw===true)
           {
            document.getElementById("passwordLabel").style.color="white";
            document.getElementById("passwordLabel").textContent="Enter Password: ";
           updateMeasurements();
  
           
           
           }
           else
           {
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

function updateMeasurements(){
    TimeMeasur1
      document.getElementById("TimeMeasur1").textContent=showDate(items.cDt);
    document.getElementById("Temperature").textContent=items.Tmpr;
    document.getElementById("Humidity").textContent=items.Hum;
    if (items.dateDoorLastOpened===null||items.doorO===undefined)
        document.getElementById("doorOpened").textContent="-";
   else
       document.getElementById("doorOpened").textContent=showDate(items.doorO);
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
   
   //let urla = 'http://localhost:3000'
   let urla = 'https://thick-llamas-shake-109-242-74-79.loca.lt'


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  fetch(urla).then(response => response.json())
    .then(data =>{;
    dataObj=JSON.parse(data);
   
    
      console.log(dataObj[0]);
    document.getElementById("dataFromFile1").textContent=dataObj.obj0.CorPass;
   //console.log(dataFromFile);
    }); 
        //document.getElementById("dataFromFile1").textContent=data);
    
}




// Delegated Event Listener for current and completed items
    $('#currentItems, #completedItems').on('click', 'li:not(.modal)', function () {
        selectedItem = this;
        $(this).attr('data-selected', '');
    });

// Event Listeners for Dialogs
    $('#complete').on('click', function () {
        items[selectedItem.id].completed = true;
    });
    $('#reactivate').on('click', function () {
        items[selectedItem.id].completed = false;
    });
    // Delegated dialog hiding
    $('.modal').on('click', function (ev) {
        $(selectedItem).removeAttr('data-selected');
        selectedItem = null;
    });

// Data update
 //   $('#complete, #reactivate').on('click', function () {
 //       ws.send(JSON.stringify(items, null, 4));
 //   });
 $('#switch1').on('click', function () {
    //item.switch[0]=true;
    item.whichAction=9;
    const btnSwitch1=document.getElementById("switch1");
    btnSwitch1.textContent = "WAIT";

   ws.send(JSON.stringify(item));
   this.disabled = true;
      setTimeout(()=>{
    this.disabled = false;
    btnSwitch1.textContent = "TAKE VALUES";
    console.log('Button Activated')}, 4000); 
    
});
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




 $('#OpenRelay1').on('click', function () {
item.relay[1]=true;
item.whichAction=1;
     console.log("opened");
    ws.send(JSON.stringify(item));
    disableBtns();
});
$('#CloseRelay1').on('click', function () {
    item.relay[1]=false;
    item.whichAction=1;
    console.log("closed");
   ws.send(JSON.stringify(item));
       disableBtns();
});

$('#OpenRelay2').on('click', function () {
    item.relay[2]=true;
    item.whichAction=2;
         console.log("opened");
        ws.send(JSON.stringify(item));
        disableBtns();         
});
$('#CloseRelay2').on('click', function () {
        item.relay[2]=false;
        item.whichAction=2;
        console.log("closed");
       ws.send(JSON.stringify(item));
              disableBtns();
});

$('#OpenRelay3').on('click', function () {
    item.relay[3]=true;
    item.whichAction=3;
         console.log("opened");
        ws.send(JSON.stringify(item));
               disableBtns();

         
});
$('#CloseRelay3').on('click', function () {
        item.relay[3]=false;
        item.whichAction=3;
        console.log("closed");
       ws.send(JSON.stringify(item));
           disableBtns();
});

$('#OpenRelay4').on('click', function () {
    item.relay[4]=true;
    item.whichAction=4;
         console.log("4opened");
        ws.send(JSON.stringify(item));
          disableBtns(); 
});
$('#CloseRelay4').on('click', function () {
        item.relay[4]=false;
        item.whichAction=4;
        console.log("4closed");
       ws.send(JSON.stringify(item));
         disableBtns();
});

$('#OpenRelay5').on('click', function () {
    item.relay[5]=true;
    item.whichAction=5;
         console.log("opened");
        ws.send(JSON.stringify(item));
        disableBtns();
});
$('#CloseRelay5').on('click', function () {
        item.relay[5]=false;
        item.whichAction=5;
        console.log("closed");
       ws.send(JSON.stringify(item));
       disableBtns();
});

$('#OpenRelay6').on('click', function () {
    item.relay[6]=true;
    item.whichAction=6;
         console.log("opened");
        ws.send(JSON.stringify(item));
        disableBtns();  
});
$('#CloseRelay6').on('click', function () {
        item.relay[6]=false;
        item.whichAction=6;
        console.log("closed");
       ws.send(JSON.stringify(item));
       disableBtns();  
        
});

$('#OpenRelay7').on('click', function () {
    item.relay[7]=true;
    item.whichAction=7;
         console.log("opened");
        ws.send(JSON.stringify(item));
        disableBtns();
          
         
});
$('#CloseRelay7').on('click', function () {
        item.relay[7]=false;
        item.whichAction=7;
        console.log("closed");
       ws.send(JSON.stringify(item));
       disableBtns();
     
        
});

$('#OpenRelay8').on('click', function () {
    item.relay[8]=true;
    item.whichAction=8;
         console.log("opened");
        ws.send(JSON.stringify(item));
        disableBtns();
         
         
});
$('#CloseRelay8').on('click', function () {
        item.relay[8]=false;
        item.whichAction=8;
        console.log("closed");
       ws.send(JSON.stringify(item));
       disableBtns();
           
        
});
function disableBtns()
{
      const labeSwitch=document.getElementById("SwitchesLabel");
    labeSwitch.textContent = "WAIT";
    document.getElementById("OpenRelay1").disabled=true;    
    document.getElementById("OpenRelay2").disabled=true;
    document.getElementById("CloseRelay1").disabled=true;    
    document.getElementById("CloseRelay2").disabled=true;
    document.getElementById("OpenRelay3").disabled=true;    
    document.getElementById("OpenRelay4").disabled=true;
    document.getElementById("CloseRelay3").disabled=true;    
    document.getElementById("CloseRelay4").disabled=true;
    document.getElementById("OpenRelay5").disabled=true;    
    document.getElementById("OpenRelay6").disabled=true;
    document.getElementById("CloseRelay5").disabled=true;    
    document.getElementById("CloseRelay6").disabled=true;
    document.getElementById("OpenRelay7").disabled=true;    
    document.getElementById("OpenRelay8").disabled=true;
    document.getElementById("CloseRelay7").disabled=true;    
    document.getElementById("CloseRelay8").disabled=true;
    
          setTimeout(()=>{
                labeSwitch.textContent = "Switches";
    document.getElementById("OpenRelay1").disabled=false;    
    document.getElementById("OpenRelay2").disabled=false;
    document.getElementById("CloseRelay1").disabled=false;    
    document.getElementById("CloseRelay2").disabled=false;
    document.getElementById("OpenRelay3").disabled=false;    
    document.getElementById("OpenRelay4").disabled=false;
    document.getElementById("CloseRelay3").disabled=false;    
    document.getElementById("CloseRelay4").disabled=false;
    document.getElementById("OpenRelay5").disabled=false;    
    document.getElementById("OpenRelay6").disabled=false;
    document.getElementById("CloseRelay5").disabled=false;    
    document.getElementById("CloseRelay6").disabled=false;
    document.getElementById("OpenRelay7").disabled=false;    
    document.getElementById("OpenRelay8").disabled=false;
    document.getElementById("CloseRelay7").disabled=false;    
    document.getElementById("CloseRelay8").disabled=false;
    console.log('Button Activated')}, 2500);    
}
$('#downloadFile').on('click', function () {
    if (dataObj===null){
        const dataFromFileDisplay=document.getElementById("dataFromFile1");
        dataFromFileDisplay.textContent = "Take Values First!";
        

        this.disabled = true;
        setTimeout(()=>{
        this.disabled = false;
        dataFromFileDisplay.textContent = "No Values";
        console.log('Button Activated')}, 2000); 
         
    }
    else
    {
        const dataFromFileDisplay=document.getElementById("dataFromFile1");
        createTable();
         dataFromFileDisplay.textContent = "";
    }
});

function createTable(){
    var dataset = [];
    
// javascript
// take data and put them in table
    let counterForSkip=0;
    let numberOfMeas=Object.values(dataObj).length-1;
    
   console.log(numberOfMeas);
    //let objectName=Object.keys(dataObj)[0];
    
   // console.log(dataObj.objectName);
    //console.log(Object.values(dataObj)[100]);
    
    //console.log(Object.values(dataObj)[numberOfMeas]);
    let olderMes=numberOfMeas-600;
    if (olderMes<35)
    olderMes=35;
    
for (let i=olderMes;i<numberOfMeas;i++)
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

var svgWidth = 500, svgHeight = 300, barPadding = 10;
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
        return svgHeight -2;
    })
    .attr("x", function(d, i) {
        return 5+barWidth * i;
    })
    .attr("fill", "goldenrod");
    
    
    
    
    
}

});

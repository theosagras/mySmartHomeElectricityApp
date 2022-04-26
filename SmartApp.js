$(function () {
    'use strict';

// Items object structure

//var items = [], selectedItem = null;
var item= {
    "password": "",
    "whichAction": 0, //1-8 relay,   9 on measurement1,    10 on measurement2 
    "relay": [false,false,false,false,false,false,false,false,false],
    "switch": [false,false]
}
var items= {
    "CorPass": false,
    "measurements": [0,0,0,0,0,0,0,0,0,0,0,0,0,0]
}

document.getElementById('passwordnput').addEventListener('change', function(evt) {
    
    item.password=document.getElementById('passwordnput').value;
    
}, false);

if (Notification.permission === "granted"){
    showNotification();
}
    elseif (Notification.permission !== "denied")
    {
        Notification.requestPermission().then(permission => {
            if (permission === "granted")
            {
                showNotification();
            }
        });
    }
    
    function showNotification()
    {
        const notification = new Notification("New message from dcode!",{
                body: "Heymate, how are you?"
        });
    }
    
    /*
// Communication functions
    var ws = new WebSocket('wss://9f00-188-73-233-157.eu.ngrok.io');
    
    //var ws = new WebSocket('ws://localhost:8090');
    ws.addEventListener('open', function (ev) {
        ws.addEventListener('message', function (msg) {
            items = JSON.parse(msg.data);
           console.log(items);
           if (items.CorPass===true)
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
    document.getElementById("Voltage1").textContent=items.measurements[0];
    document.getElementById("Current1").textContent=items.measurements[1];
    document.getElementById("Frequency1").textContent=items.measurements[2];
    document.getElementById("ActivePower1").textContent=items.measurements[3];
    document.getElementById("ReactivePower1").textContent=items.measurements[4];
    document.getElementById("ApparentFactor1").textContent=items.measurements[5];
    document.getElementById("PowerFactor1").textContent=items.measurements[6];
    document.getElementById("ActiveEnergy1").textContent=items.measurements[7];
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
    item.switch[0]=true;
    item.whichAction=9;
    const btnSwitch1=document.getElementById("switch1");
    btnSwitch1.textContent = "ON";

   ws.send(JSON.stringify(item));
    
});
$('#switch2').on('click', function () {
    item.switch[1]=true;
    const btnSwitch2=document.getElementById("switch2");
    btnSwitch2.textContent = "ON";

    console.log("switch1Pressed");
   ws.send(JSON.stringify(item));
    
});


 $('#OpenRelay1').on('click', function () {
item.relay[1]=true;
item.whichAction=1;
     console.log("opened");
    ws.send(JSON.stringify(item));
     
});
$('#CloseRelay1').on('click', function () {
    item.relay[1]=false;
    item.whichAction=1;
    console.log("closed");
   ws.send(JSON.stringify(item));
    
});

$('#OpenRelay2').on('click', function () {
    item.relay[2]=true;
    item.whichAction=2;
         console.log("opened");
        ws.send(JSON.stringify(item));
         
});
$('#CloseRelay2').on('click', function () {
        item.relay[2]=false;
        item.whichAction=2;
        console.log("closed");
       ws.send(JSON.stringify(item));
        
});

$('#OpenRelay3').on('click', function () {
    item.relay[3]=true;
    item.whichAction=3;
         console.log("opened");
        ws.send(JSON.stringify(item));
         
});
$('#CloseRelay3').on('click', function () {
        item.relay[3]=false;
        item.whichAction=3;
        console.log("closed");
       ws.send(JSON.stringify(item));
        
});

$('#OpenRelay4').on('click', function () {
    item.relay[4]=true;
    item.whichAction=4;
         console.log("4opened");
        ws.send(JSON.stringify(item));
         
});
$('#CloseRelay4').on('click', function () {
        item.relay[4]=false;
        item.whichAction=4;
        console.log("4closed");
       ws.send(JSON.stringify(item));
        
});

$('#OpenRelay5').on('click', function () {
    item.relay[5]=true;
    item.whichAction=5;
         console.log("opened");
        ws.send(JSON.stringify(item));
         
});
$('#CloseRelay5').on('click', function () {
        item.relay[5]=false;
        item.whichAction=5;
        console.log("closed");
       ws.send(JSON.stringify(item));
        
});

$('#OpenRelay6').on('click', function () {
    item.relay[6]=true;
    item.whichAction=6;
         console.log("opened");
        ws.send(JSON.stringify(item));
         
});
$('#CloseRelay6').on('click', function () {
        item.relay[6]=false;
        item.whichAction=6;
        console.log("closed");
       ws.send(JSON.stringify(item));
        
});

$('#OpenRelay7').on('click', function () {
    item.relay[7]=true;
    item.whichAction=7;
         console.log("opened");
        ws.send(JSON.stringify(item));
         
});
$('#CloseRelay7').on('click', function () {
        item.relay[7]=false;
        item.whichAction=7;
        console.log("closed");
       ws.send(JSON.stringify(item));
        
});

$('#OpenRelay8').on('click', function () {
    item.relay[8]=true;
    item.whichAction=8;
         console.log("opened");
        ws.send(JSON.stringify(item));
         
});
$('#CloseRelay8').on('click', function () {
        item.relay[8]=false;
        item.whichAction=8;
        console.log("closed");
       ws.send(JSON.stringify(item));
        
});




*/
});

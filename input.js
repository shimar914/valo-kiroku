var infos = [];
var wins = 0,loses = 0,draws = 0;
var point;

function getRadioChecked(id){
    var element = document.getElementById(id);
    var radioNodeList;
    switch(id){
        case "gamemode":
            radioNodeList = element.gamemode;
            break;
        case "result":
            radioNodeList = element.result;
            break;
    }
    
    var a = radioNodeList.value;
    if(a === ''){
        return undefined;    
    }else{
        return a;
    }
}

function getAllInfo(){
    var info = {};

    info.gamemode = getRadioChecked('gamemode');
    info.agent = document.getElementById('agent').value;
    info.map = document.getElementById('map').value;
    info.result = getRadioChecked('result');
    info.increase = document.getElementById('increase').value;
    info.kills = document.getElementById('kills').value;
    info.deaths = document.getElementById('deaths').value;
    info.assists = document.getElementById('assists').value;

    switch(info.result){
        case "win":
            wins++; break;
        case "lose":
            loses++; break;
        case "draw":
            draws++; break;
    }

    console.log(info);
    infos.push(info);
    console.log(infos);
    //return info;
}

function updateResults(result){
    document.getElementById("wins").innerHTML = wins;
    document.getElementById("loses").innerHTML = loses;
    document.getElementById("draws").innerHTML = draws;
}

function uncheckRadio(id){
    var e = document.getElementById(id);
    for(var i=0;i<e.elements.length;i++){
        e.elements[i].checked = false;
    }
} 

function initDropdown(id){
    var e = document.getElementById(id);
    e.options[0].selected = true;
}

function clearNum(id){
    var numForm = document.getElementById(id);
    numForm.value = '';
}

function clearInputs(){
    uncheckRadio("gamemode");
    initDropdown("agent");
    initDropdown("map");
    uncheckRadio("result");
    clearNum("increase");
    clearNum("kills");
    clearNum("deaths");
    clearNum("assists");
}


function showInfos(){
    console.log(infos);
}
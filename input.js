var infos = [];

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

    console.log(info);
    return info;
}

function showInfos(){
    console.log(infos);
}
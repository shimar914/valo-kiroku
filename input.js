var rank;
var info = {};
var infos = [];
var wins = 0,loses = 0,draws = 0;
var point;
const ranks = [
    "Iron1","Iron2","Iron3","Bro1","Bro2","Bro3","Sil1","Sil2","Sil3","Gold1","Gold2","Gold3","Plat1","Plat2","Plat3","Dia1","Dia2","Dia3","Immo1","Immo2","Immo3"
]

function getUrlQueries() {
    var queryStr = window.location.search.slice(1);
    queries = {};

    if (!queryStr) {
        return queries;
    }

    queryStr.split('&').forEach(function(queryStr) {
        var queryArr = queryStr.split('=');
        queries[queryArr[0]] = queryArr[1];
    });

    info.currentRank = queries.rank;
    info.currentPoint = queries.point - 0;
    console.log(info.currentPoint);
}


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
    info.gamemode = getRadioChecked('gamemode');
    info.agent = document.getElementById('agent').value;
    info.map = document.getElementById('map').value;
    info.result = getRadioChecked('result');
    info.increase = document.getElementById('increase').value - 0;
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


    //return info;
}

function updateRanks(){
    var is0pt = 0;
    if(info.currentPoint === 0) is0pt = 1;
    info.currentPoint = info.currentPoint + info.increase;
    if(ranks.indexOf(info.currentRank) > 18){ //Immo2以上
        if(info.currentPoint >= 400) info.currentRank = "Radiant";
        else if(info.currentPoint >= 200) info.currentRank = "Immo3";
        else if(info.currentPoint >= 80) info.currentRank = "Immo2";
        else info.currentRank = "Immo1";
    }else{ //Immo1以下
        console.log(info.currentPoint);
        if(info.currentPoint >= 80 && info.currentRank === "Immo1"){ //Immo1で80RR以上になった場合
            info.currentRank = ranks[ranks.indexOf(info.currentRank)+1];
        }
        else if(info.currentPoint >= 100){ //Dia3以下で100RR以上になった場合
            info.currentRank = ranks[ranks.indexOf(info.currentRank)+1];
            info.currentPoint = 10;
        }else{ //ランクアップしなかったとき
            if(is0pt && info.increase < 0){ //RRが0の状態で負けたとき
                info.currentRank = ranks[ranks.indexOf(info.currentRank)-1];
                info.currentPoint = 100 + info.increase;
            }else if(info.currentPoint < 0){ //RRが0でない状態から負けてRRがマイナスになったとき
                info.currentPoint = 0;
            }
        }

    }
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

function processToNextMatch(){
    getAllInfo();
    updateRanks();
    updateResults();
    clearInputs();
    console.log(info);
    infos.push(info);
    console.log(infos);
}
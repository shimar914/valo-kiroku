var i=0;
var rank;
var info = {};
var infos = [];
var wins = 0,loses = 0,draws = 0;
var all_kills = 0,all_deaths = 0,all_assists = 0;
var point;
const ranks = [
    "Iron1","Iron2","Iron3","Bro1","Bro2","Bro3","Sil1","Sil2","Sil3","Gold1","Gold2","Gold3","Plat1","Plat2","Plat3","Dia1","Dia2","Dia3","Immo1","Immo2","Immo3"
]
var graphData = [];



function convert(str){
    if(str.startsWith("Bro")) return str.replace("Bro","Bronze");
    if(str.startsWith("Sil")) return str.replace("Sil","Silver");
    if(str.startsWith("Plat")) return str.replace("Plat","Platinum");
    if(str.startsWith("Dia")) return str.replace("Dia","Diamond");
    if(str.startsWith("Immo")) return str.replace("Immo","Immortal");
    else return str;
}

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

    queries.point -= 0; //数値へ型変換
    info.currentRank = queries.rank;
    info.currentPoint = queries.point;
    graphData.push({x:i,y:queries.point + ranks.indexOf(queries.rank)*100});
    i++;
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

function getYMax(){
    var max = 0;
    for(var i=0;i<graphData.length;i++){
        if(graphData[i].y > max) max = graphData[i].y;
    }
    return max;
}
function getYMin(){
    var min = 99999;
    for(var i=0;i<graphData.length;i++){
        if(graphData[i].y < min) min = graphData[i].y;
    }
    return min;
}

function drawGraph(){
    var stage = document.getElementById("graph");
    var chart = new CanvasJS.Chart(stage, {
        axisX:{
            margin:10,
            labelFormatter: function(e){
                if(e.value === 0) return "開始時";
                else return e.value + "戦目";
            },
            interval:1,
            minimum:0,
            maximum:graphData.length
        },
        axisY:{
            labelFormatter: function(e){
                return ranks[(e.value/100 | 0)] + " " + e.value%100 + "RR"; 
            },
            labelWrap : true,
            maximum: getYMax() + 10,
            minimum: getYMin() - 10
        },
        title:{
            text:"RR推移",
        },
        theme:"theme4",
        data: [{
            type:"line",
            dataPoints: graphData,
            mouseover: function(e){
                console.log("A");
            }
        }]
    });
    chart.render();
}

function getAllInfo(){
    info.gamemode = getRadioChecked('gamemode');
    info.agent = document.getElementById('agent').value;
    info.map = document.getElementById('map').value;
    info.result = getRadioChecked('result');
    info.increase = document.getElementById('increase').value - 0;
    info.kills = document.getElementById('kills').value - 0;
    info.deaths = document.getElementById('deaths').value - 0;
    info.assists = document.getElementById('assists').value - 0;

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

function setKDA(){
    all_kills += info.kills;
    all_deaths += info.assists;
    all_assists += info.assists;
    console.log(all_kills);
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
        graphData.push({x:i , y:info.currentPoint + 1800});
    }else{ //Immo1以下
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
        graphData.push({x:graphData.length,y:info.currentPoint + ranks.indexOf(info.currentRank) * 100});

    }
}

function displayRanks(){
    document.getElementById("current_rank").innerHTML = convert(info.currentRank);
    document.getElementById("current_RR").innerHTML = info.currentPoint;
}

function updateResults(result){
    document.getElementById("wins").innerHTML = wins;
    document.getElementById("loses").innerHTML = loses;
    document.getElementById("draws").innerHTML = draws;
    document.getElementById("winper").innerHTML = Math.round(wins/(wins+loses+draws)*100);
    
    document.getElementById("all_kills").innerHTML = all_kills;
    document.getElementById("all_deaths").innerHTML = all_deaths;
    document.getElementById("all_assists").innerHTML = all_assists;
    document.getElementById("all_KDA").innerHTML = Math.round(((all_kills + all_assists)/all_deaths)*100)/100;
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
    setKDA();
    updateRanks();
    updateResults();
    clearInputs();
    console.log(info);
    infos.push(info);
    console.log(infos);
    displayRanks();
    drawGraph();
}
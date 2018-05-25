var game = new Game()
game.init()
game.addSuccessFn(success)
game.addFailedFn(failed)

var mask = document.querySelector('.mask')
var restartButton = document.querySelector('.restart')
var uploadButton = document.querySelector('.upload')
var score = document.querySelector('.score')

var maxScoreContainerEl = document.querySelector('.max-score')
var maxAddressEl = document.querySelector('#maxAddress')
var maxScoreEl = document.querySelector('#maxScore')

restartButton.addEventListener('click', restart);

uploadButton.addEventListener('click',upload);

var maxscore = -1;

var nebPay = new NebPay();
//上传最高分
function upload(){
  var to = dappAddress;
  var value="0"
  var callFunction = "submit";
  var _score = score.innerText;
  var callArgs = JSON.stringify([_score])

  nebPay.call(to, value, callFunction, callArgs, {    
    listener: function(resp){ 
        if(!!resp.execute_err) return;
    }
  });
}
//获得最高分
function getMaxScore(){
  var to = dappAddress;
  var value="0"
  var maxScore = 0;
  var maxAddress = "";
  var callFunction = "getMaxScore";

  var callArgs = JSON.stringify([""])

  nebPay.simulateCall(to, value, callFunction, callArgs, {    
    listener: function(resp){ 
        if(!!resp.execute_err) return;
        var result = resp.result;
        var resultObj = JSON.parse(result);
        maxScore = resultObj.score;
        maxAddress = resultObj.address;
        maxAddressEl.innerHTML =  maxAddress;
        maxScoreEl.innerHTML = maxScore;
    }
  });
}


// 游戏重新开始，执行函数
function restart() {
  mask.style.display = 'none'
  maxScoreContainerEl.style.visibility= "hidden";
  game.restart()
}
// 游戏失败执行函数
function failed() {
  score.innerText = game.score
  mask.style.display = 'flex'
  getMaxScore();
  maxScoreContainerEl.style.visibility= "initial";
}
// 游戏成功，更新分数
function success(score) {
  var scoreCurrent = document.querySelector('.score-current')
  scoreCurrent.innerText = score
}
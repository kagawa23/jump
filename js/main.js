var game = new Game()
game.init()
game.addSuccessFn(success)
game.addFailedFn(failed)

var mask = document.querySelector('.mask')
var restartButton = document.querySelector('.restart')
var score = document.querySelector('.score')

restartButton.addEventListener('click', restart)

var maxscore = -1;

//
var nebpay = require('nebPay');
var to = this.dappAddress;
var maxScore = 0;
var maxAddress = "";
var callFunction = "getMaxScore";

var callArgs = JSON.stringify([""])

nebPay.simulateCall(to, value, callFunction, callArgs, {    
  listener: function(resp){ 
      var result = resp.result;
      var resultObj = JSON.parse(result);
      if(result.err) return;
      maxscore = resultObj.maxScore;
      maxAddress = resultObj.address;
  }
});

// 游戏重新开始，执行函数
function restart() {
  mask.style.display = 'none'
  game.restart()
}
// 游戏失败执行函数
function failed() {
  score.innerText = game.score
  mask.style.display = 'flex'
}
// 游戏成功，更新分数
function success(score) {
  var scoreCurrent = document.querySelector('.score-current')
  scoreCurrent.innerText = score
}
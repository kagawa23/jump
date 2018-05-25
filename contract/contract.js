"use strict";

var Player = function(text) { 
    if(text){
        var o = JSON.parse(text);
        this.address = o.address;
        this.nickName="";
    }
};

Player.prototype = {
    toString: function () {
      return JSON.stringify(this);
    }
};

var RankItem = function(text){
    if(text){
        var o = JSON.parse(text);
        this.score = o.score;
        this.address = o.address;
    }   
}

RankItem.prototype = {
    toString: function () {
      return JSON.stringify(this);
    }
};


var Ranklist = function () {
    LocalContractStorage.defineMapProperty(this, "rankMap",{
        parse: function (text) {
          return new RankItem(text);
        },
        stringify: function (o) {
          return o.toString();
        }
      });
    LocalContractStorage.defineMapProperty(this, "playerMap",{
        parse: function (text) {
          return new Player(text);
        },
        stringify: function (o) {
          return o.toString();
        }
      });
    LocalContractStorage.defineProperty(this, "rankIdx");
    LocalContractStorage.defineProperty(this, "maxScore");
    LocalContractStorage.defineProperty(this, "maxScoreAddress");
    LocalContractStorage.defineProperty(this, "addressList",{
        get: function(){

        },
        set:function(){

        }
    });
};

Ranklist.prototype = {
    init: function() {
        this.rankIdx = 0;
        this.maxScore = -1;
        this.maxScoreAddress = '';
        this.addressList = new Array();
    },
    _nextRank:function(){
        return this.rankIdx + 1;
    },
    submit:function(score) {
        var from = Blockchain.transaction.from;
        var player = this.playerMap.get(from);
        var address = this.addressList;
        if (!player) { 
            // insert new player
            player = new Player();
            player.address = from;
            player.nickName = "";
            this.playerMap.put(from, player);
            address.push(from);
            this.addressList = address;
        }
        // insert record to rank
        this.rankIdx = this._nextRank();
        var item = new RankItem();
        item.score = score;
        item.address = from;
        this.rankMap.put(this.rankIdx, item);
        // 
        if(score > this.maxScore){
            this.maxScoreAddress = from;
            this.maxScore = score;
        }
       return "success";
    },
    getMaxScore:function(){
        var player = this.playerMap.get(this.maxScoreAddress);
        if(!player){
            throw Error("no max score player")
        }
        player.score = this.maxScore;
        return player
    },
    getRankIdx:function(){
        return this.rankIdx;
    },
    getAddressList:function(){
        return this.addressList;
    },
    getAllPlayer:function(){
        var list = [];
        var address = this.addressList;
        for(var i =0;i<address.length;i++){
            var addr = address[i];
            var player = this.playerMap.get(addr);
            list.push(player);
        }
        return list;
    },
    getRankings: function() {
        var list = [];
        for(var i=0;i<this.rankIdx;i++){
            var item = this.rankMap.get(i);
            list.push(item)
        }   
        return list;
    },
    getAddressList:function(){
        return this.addressList;
    }
};

module.exports = Ranklist;
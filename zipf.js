/***
This library will map arbitrary synthetic language components to frequency distributions using Zipf's Law.
The following methods might be useful:
a set of phonemes -> a set of words
a set of words -> their frequency distributions
a set of parts of speech (including required parts) -> sentence structures
sentence structures, words -> sentences in the given language
***/

(function(){
  if (typeof Zipfs === "undefined"){
    window.Zipfs = {};
  }

  var Zipf = window.Zipfs.Zipf = function (args){
    var args = args || {};
    this.vowels = args.vowels || ['a','e','i','o','u'];
    this.consonants = args.consonants || ['b','c','d','f','g','h','j','k','l','m','n','p','q','r','s','t','v','w','x','y','z'];
    this.alphabet = this.vowels.concat(this.consonants);
    this.orderedAlphabet = orderEmes(this.alphabet);
  };

  var orderEmes = function(emes){
    for (var i = emes.length - 1; i > 0; i--){
      var old = emes[i];
      var j = Math.floor(Math.random() * (emes.length - 1));
      emes[i] = emes[j];
      emes[j] = old;
    }
    return emes;
  };

  Zipf.prototype.distributeEmes = function(totalEmes){
    var thresholds = [0];
    for (var i = 0; i < this.emes.length; i++){
      var lastThreshold = thresholds[thresholds.length - 1];
      var threshold = 1/((i+2) * Math.log(1.78 * this.emes.length)) + lastThreshold;
      thresholds.push(threshold);
    }
    console.log(thresholds);
    var distributedEmes = [];
    for (var i = 0; i < totalEmes; i++){
      var factor = Math.random() * thresholds[thresholds.length - 1];
      console.log(factor);
      var j = 0;
      while(thresholds[j+1] < factor && j < thresholds.length - 2){
        j++;
      }
      distributedEmes.push(this.emes[j]);
    }
    this.distributedEmes = distributedEmes;
  }
})();

/***
This library will map arbitrary synthetic language components to frequency distributions using Zipf's Law.
The following methods might be useful:
a set of phonemes -> a set of words
a set of words -> their frequency distributions
a set of parts of speech (including required parts) -> sentence structures
sentence structures, words -> sentences in the given language

Words, phonemes, and single letters roughly follow Zipf's law.

***/

(function(){
  if (typeof Zipfs === "undefined"){
    window.Zipfs = {};
  }

  var Zipfs = window.Zipfs;

  //Letter and Phoneme should be siblings
  var Letter = Zipfs.Letter = function(char, type){
    this.char = char;
    this.type = type;
  };

  var Phoneme = Zipfs.Phoneme = function(str){
    this.str = str;
    this.type;
    this.complete = false;
  }

  var Zipf = Zipfs.Zipf = function (args){
    var args = args || {};
    this.vowelChars = args.vowels || ['a','e','i','o','u','y'];
    this.consonantChars = args.consonants || ['b','c','d','f','g','h','j','k','l','m','n','p','q','r','s','t','v','w','x','z'];
    this.vowels = [];
    this.consonants = [];
    for (var i = 0; i < this.vowelChars.length; i++){
      var letter = new Letter(this.vowelChars[i], "vowel");
      this.vowels.push(letter);
    }
    for (var i = 0; i < this.consonantChars.length; i++){
      this.consonants.push(new Letter(this.consonantChars[i], "consonant"));
    }
    // alert(this.vowels[0].type);
    this.alphabet = this.vowels.concat(this.consonants);
    this.orderedAlphabet = this.orderEmes(this.alphabet);
    this.maxConsecutiveVowels = args.maxConsecutiveVowels || 2;
    this.maxConsecutiveConsonants = args.maxConsecutiveConsonants || 3;
    this.totalPhonemes = args.phonemes || 44;
    this.phonemes = this.makePhonemes();
  };

  Zipf.prototype.orderEmes = function(emes){
    for (var i = emes.length - 1; i > 0; i--){
      var old = emes[i];
      var j = Math.floor(Math.random() * (emes.length - 1));
      emes[i] = emes[j];
      emes[j] = old;
    }
    return emes;
  };

  Zipfs.choose = function(arr){
    var maximumFrequency = 0;
    for (var i = 0; i < arr.length - 1; i++){
      maximumFrequency += 1/(i+2);
    }
    var seed = Math.random() * maximumFrequency;
    var j = 0;
    var runningTotal = 0;
    while (seed > 1/(j+2) + runningTotal && j < arr.length - 1){
      j++;
      runningTotal += 1/(j+2);
    }
    return arr[j];
  }

  Zipf.prototype.makePhonemes = function(){
    var phonemes = [];
    for (var i = 0; i < this.totalPhonemes; i++){
      var phoneme = new Phoneme("");
      while(!(phoneme.complete)){
        if (phoneme.str.length === 0){
          var firstLetter = Zipfs.choose(this.alphabet);
          phoneme.str = firstLetter.char;
          phoneme.type = firstLetter.type;
          var maxLength;
          maxLength = phoneme.type === "vowel" ? this.maxConsecutiveVowels : this.maxConsecutiveConsonants;
          var lengthRange = [];
          for (var j = 1; j <= maxLength; j++){
            lengthRange.push(j);
          }
          var length = Zipfs.choose(lengthRange);
        } else {
          if (phoneme.str.length === length){
            var uniquePhoneme = true;
            var k = 0;
            while (uniquePhoneme && k < phonemes.length){
              uniquePhoneme = phonemes[k].str !== phoneme.str;
              k++;
            }
            if (uniquePhoneme){
              phoneme.complete = true;

            } else {
              phoneme = new Phoneme("");
            }
          } else {
            var possibleNextChar = Zipfs.choose(this.alphabet);
            while (possibleNextChar.type !== phoneme.type){
              possibleNextChar = Zipfs.choose(this.alphabet);
            }
            phoneme.str += possibleNextChar.char;
          }
        }
      }
      phonemes.push(phoneme);
    }
    for (var i = 0; i < phonemes.length; i++){
      console.log(phonemes[i].str);
    }
    return phonemes;
  };

  Zipf.prototype.distributeEmes = function(totalEmes){
    var thresholds = [0];
    for (var i = 0; i < totalEmes; i++){
      var lastThreshold = thresholds[thresholds.length - 1];
      var threshold = 1/((i+2) * Math.log(1.78 * totalEmes)) + lastThreshold;
      thresholds.push(threshold);
    }
    var distributedEmes = [];
    for (var i = 0; i < totalEmes; i++){
      var factor = Math.random() * thresholds[thresholds.length - 1];
      var j = 0;
      while(thresholds[j+1] < factor && j < thresholds.length - 2){
        j++;
      }
      distributedEmes.push(this.emes[j]);
    }
    return distributedEmes;
  }
})();

var z = new Zipfs.Zipf;

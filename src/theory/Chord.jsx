window.Chord = function(_root, _quality){
  this.setQuality = function(_quality){
    his.quality = Chord.quality_map[_quality]?_quality:'Major';
    this.reset.call(this);
  }

  this.add = function(_interval){
    var step = this.getStepSize(_interval);
    if (step >= 0)
      this.notes.push([1, new Note(this.root.note()+step)]);//Major7 is 11 steps
    return this;
  }

  this.remove = function(_id){
    if (_id == undefined) {
      this.notes.pop();
      return this;
    } else if (_id == 'random'){
      if (Math.random.flip())//reduce the changes of it deleting something
        return this;
      _id = Math.random.range(0, this.notes.length-1);
    }
    this.notes.splice(_id, 1);
    return this;
  }

  this.getStepSize = function(_interval){
    var split = /([mMdAP])([0-9]+)/.exec(_interval)
    var interval_digit = split.pop(), interval_quality = split.pop();
    var octave_multiplier = 0;
    if (interval_digit > 7){
      octave_multiplier = Math.floor(interval_digit/7);
      interval_digit %= 7;
    }
    var ret = Chord.interval_map[interval_quality+interval_digit];
    if (ret >= 0){
      return ret+octave_multiplier*12;
    }else{
      console.log(_interval+' is not a valid interval!');
      return FALSE;
    }
  }

  this.invertUp = function(){
    var note_array = this.notes.shift();
    //0 is the start timing, 1 is the actual note
    note_array[1].octaveUp();
    this.notes.push(note_array);
  }

  this.invertDown = function(){
    var note_array = this.notes.pop();
    //0 is the start timing, 1 is the actual note
    note_array[1].octaveDown();
    this.notes.unshift(note_array);
  }

  this.invert = function(type, n){
    if (n == undefined) n = 1;
    else n = parseInt(n);
    switch (type){
      case 'up':
        for (var i = 0; i<n;i++) this.invertUp();
        break;
      case 'down':
        for (var i = 0; i<n;i++) this.invertDown();
        break;
      default:
        for (var i = 0; i<n;i++){
          switch(Math.random.range(0, 2)){
            case 0: 
              this.invertUp();
            case 1:
              this.invertDown();
          }
        }
        break;
    }
    return this;
  }

  this.contract = function(amount){
    for (var n in this.notes){
      this.notes[n][1].contract(amount);
    }
    return this;
  }

  this.extend = function(amount){
    for (var n in this.notes){
      this.notes[n][1].extend(amount);
    }
    return this;
  }

  this.play = function(){
    for (var n in this.notes){
      (function(start, note){
        setTimeout(function(){
          note.play();
        }, start);
      })(this.notes[n][0]*beat_length, this.notes[n][1]);
    }
  }

  this.reset = function(){
    var pattern;
    if (Chord.quality_map[this.quality]){
      pattern = Chord.quality_map[this.quality];
    }else{
      pattern = Chord.quality_map['Major'];
    }
    for (var i in pattern){
      var step = this.getStepSize(pattern[i]);
      if (step == 0){
        this.notes.push([0, this.root]);
      }else{
        this.notes.push([0, new Note(this.root.note()+step, duration)]);
      }
    }
  }

  this.arpeggiate = function(amount){
    amount = amount>0?amount:1;
    for (var i in this.notes){
      this.notes[i][0] += i*amount;
    }
    return this;
  }

  this.transform = function(transformations){
    for (var t in transformations){
      var transform_type = transformations[t][0],
          transform_options = transformations[t][1]?transformations[t][1]:[];
      this[transform_type].apply(this, transform_options);
    }
    return this;
  }

  //
  //Initialize
  //

  //var options = _options||{};
  this.root = _root || new Note(60); //middle C
  this.quality = Chord.quality_map[_quality]?_quality:'Major';
  var duration = this.root.duration();
  //this.chromas = [_scale.note[this.root]];
  this.notes = [];

  this.reset.call(this);
}
window.Chord.generate = function(){

}
window.Chord.quality_map = {'Major': ['P1', 'M3', 'P5'], 'Minor': ['P1', 'm3', 'P5'], 'Diminished': ['P1', 'm3', 'd5'], 'Augmented': ['P1', 'M3', 'A5']};
window.Chord.interval_map = {
  'P1':0,'A1':1,
  'd2':0,'m2':1,'M2':2,'A2':3,
  'd3':2,'m3':3,'M3':4,'A3':5,
  'd4':4,'P4':5,'A4':6,
  'd5':6,'P5':7,'A5':8,
  'd6':7,'m6':8,'M6':9,'A6':10,
  'd7':9,'m7':10,'M7':11,'A7':12,
  'd8':11,'P8':12
};
window.Chord.prototype.toString = function(){
  var ret = this.root + ' ' + this.quality + ' chord (';
  for (var i in this.notes){
    if (i != 0)
      ret += ', ';
    ret += this.notes[i].name();
  }
  ret += ')';
  return ret;
}

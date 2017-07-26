import Tone from 'tone';
import Note from './Note.jsx';
let polySynth = new Tone.PolySynth(6, Tone.Synth).toMaster();

const Chords = {
  'maj': {
    default: ['P1', 'M3', 'P5'],
    E: ['P1', 'P5', 'P8', 'M10', 'P12', 'P15'],
    A: ['P1', 'P5', 'P8', 'M10'],
    D: ['P1', 'P5', 'P8', 'M10']
    // G:
    // B:
    // e:
  },
  'min': {
    default: ['P1', 'm3', 'P5'],
    E: ['P1', 'P5', 'P8', 'm10', 'P12', 'P15'],
    A: ['P1', 'P5', 'P8', 'm10', 'P12'],
    D: ['P1', 'P5', 'P8', 'm10']
    // G:
    // B:
    // e:
  },
  'aug': {
    default: ['P1', 'M3', 'A5'],
  },
  'dim': {
    default: ['P1', 'm3', 'd5'],
  },
  'maj7': {
    default: ['P1', 'M3', 'P5', 'M7'],
    E: ['P1', 'M7', 'M10', 'P12'],
    A: ['P1', 'P5', 'M7', 'M10', 'P12'],
    // D:
    // G:
    // B:
    // e:
  },
  'min7': {
    default: ['P1', 'm3', 'P5', 'm7'],
    E: ['P1', 'P5', 'm7', 'm10', 'P12', 'P15'],//We sometimes remove the P5
    A: ['P1', 'P5', 'm7', 'm10', 'P12'],
    // D:
    // G:
    // B:
    // e:
  },
  'dom7': {
    default: ['P1', 'M3', 'P5', 'm7'],
    E: ['P1', 'P5', 'm7', 'M10', 'P12', 'P15'],
    A: ['P1', 'P5', 'm7', 'M10', 'P12'],
    // D:
    // G:
    // B:
    // e:
  },
  'dim7': {
    default: ['P1', 'm3', 'd5', 'm7'],
    E: ['P1', 'm7', 'm10', 'd12'],
    A: ['P1', 'd5', 'm7', 'm10'],
    // D:
    // G:
    // B:
    // e:
  },
};
let Voicings = Object.keys(Chords).reduce((ret, key)=>{
  for (let voicing in Chords[key]){
    if (!ret[voicing]) ret[voicing] = {};
    ret[voicing][key] = Chords[key][voicing];
  }
  return ret;
}, {});

const Intervals = {
  'P1':0,'A1':1,
  'd2':0,'m2':1,'M2':2,'A2':3,
  'd3':2,'m3':3,'M3':4,'A3':5,
  'd4':4,'P4':5,'A4':6,
  'd5':6,'P5':7,'A5':8,
  'd6':7,'m6':8,'M6':9,'A6':10,
  'd7':9,'m7':10,'M7':11,'A7':12,
  'd8':11,'P8':12
};

module.exports = class Chord{
  static StringChords(voicing){
    if (voicing === 'all') voicing = 'default';
    return Object.keys(Voicings[voicing] || {}) || [];
  }

  constructor(root, quality, voicing){
    this._root = root || new Note(60);
    this._voicing = voicing !== 'all' && voicing || 'default';
    this._quality = Chords[quality]?quality:'maj';
    this._duration = this._root.duration();
    //this.chromas = [_scale.note[this._root]];
    this._notes = [];

    this.reset();
  }
  
  setQuality(quality){
    his.quality = Chords[quality]?quality:'maj';
    this.reset.call(this);
  }
  
  add(interval){
    var step = Chord.getStepSize(interval);
    if (step >= 0)
      this._notes.push([1, new Note(this._root.note()+step)]);//Major7 is 11 steps
    return this;
  }
  
  remove(id){
    if (id == undefined) {
      this._notes.pop();
      return this;
    } else if (id == 'random'){
      if (Math.random.flip())//reduce the changes of it deleting something
        return this;
      id = Math.random.range(0, this._notes.length-1);
    }
    this._notes.splice(id, 1);
    return this;
  }
  
  static getStepSize(interval){
    var split = /([mMdAP])([0-9]+)/.exec(interval);
    var intervalDigit = split.pop(), interval_quality = split.pop();
    var octaveMultiplier = 0;
    if (intervalDigit > 7){
      octaveMultiplier = Math.floor(intervalDigit/7);
      intervalDigit %= 7;
    }
    var ret = Intervals[interval_quality+intervalDigit];
    if (ret >= 0){
      return ret+octaveMultiplier*12;
    }else{
      console.log(interval+' is not a valid interval!');
      console.log('octaveMultiplier:', octaveMultiplier);
      console.log('intervalDigit:', intervalDigit);
      return FALSE;
    }
  }
  
  invertUp(){
    var note_array = this._notes.shift();
    //0 is the start timing, 1 is the actual note
    note_array[1].octaveUp();
    this._notes.push(note_array);
  }
  
  invertDown(){
    var note_array = this._notes.pop();
    //0 is the start timing, 1 is the actual note
    note_array[1].octaveDown();
    this._notes.unshift(note_array);
  }
  
  invert(type, n){
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
  
  contract(amount){
    for (var n in this._notes){
      this._notes[n][1].contract(amount);
    }
    return this;
  }
  
  extend(amount){
    for (var n in this._notes){
      this._notes[n][1].extend(amount);
    }
    return this;
  }
  
  play(){
    // for (var n in this._notes){
    //   (function(start, note){
    //     setTimeout(function(){
    //       note.play();
    //     }, start);
    //   })(this._notes[n][0]*beat_length, this._notes[n][1]);
    // }
    polySynth.triggerAttackRelease(this._notes.map(n=>n.name), '4n');//this._duration
  }
  
  reset(){
    var pattern = Chords[this._quality][this._voicing];
    for (var i in pattern){
      var step = Chord.getStepSize(pattern[i]);
      if (step === 0){
        // this._notes.push([0, this._root]);
        this._notes.push(this._root);
      }else{
        // this._notes.push([0, new Note(this._root.note()+step, this._duration)]);
        this._notes.push(new Note(this._root.note()+step, this._duration));
      }
    }
  }
  
  arpeggiate(amount){
    amount = amount>0?amount:1;
    for (var i in this._notes){
      this._notes[i][0] += i*amount;
    }
    return this;
  }
  
  transform(transformations){
    for (var t in transformations){
      var transform_type = transformations[t][0],
          transform_options = transformations[t][1]?transformations[t][1]:[];
      this[transform_type].apply(this, transform_options);
    }
    return this;
  }
  // static generate(){

  // }
  
  get name(){
    return this._root + this._quality;
  }

  toString(){
    var ret = this._root + ' ' + this._quality + ' chord (';
    for (var i in this._notes){
      if (i != 0)
        ret += ', ';
      ret += this._notes[i].name();
    }
    ret += ')';
    return ret;
  }
};
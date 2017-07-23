import MIDI from './MIDI.jsx';

// let delay = 0; // play note right away
// let length = 0.75;
// let velocity = 127; // how hard the note hits
let num_keys = 88;
// let default_octave = 3;
let tempo = 120;//beats per minute


let beat_length = 1000/(tempo/60);
let octave_range = [2, 5];

module.exports = class Note{
  constructor(_note, _duration){
    if (arguments.length === 2){
      let [_note, _duration] = arguments;
      if (typeof _note === 'string')
        _note = MIDI.noteNames.indexOf(_note);
      this.note(_note);
      this.duration(_duration);
    }else if (arguments.length === 3){
      let [_chroma, _octave, _duration] = arguments;
      this.chroma = parseInt(_chroma);
      this.octave = parseInt(_octave);
      this.note = this.octave*12+this.chroma;
      this.duration(_duration);
    }
  }

  get name(){
    return MIDI.letters[this.chroma] + this.octave;
  }

  get keyColor(){
    if (this.chroma === 1 || this.chroma === 3 || this.chroma === 6 || this.chroma === 8 || this.chroma === 10){
      return 'black';
    }else{
      return 'white';
    }
  }

  note(_note){
    if (_note){
      this.note = parseInt(_note);
      this.chroma = this.note%12;
      this.octave = Math.floor(this.note/12);
      return this;
    }else{
      return this.note;
    }
  }

  octave(_octave){
    if (_octave){
      this.octave = parseInt(_octave);
      this.note = this.octave*12+this.chroma;
      return this;
    }else{
      return this.octave;
    }
  }

  octaveUp(){
    this.octave(this.octave+1);
    return this;
  }

  octaveDown(){
    this.octave(this.octave-1);
    return this;
  }

  chroma(_chroma){
    if (_chroma){
      this.chroma = parseInt(chroma);
      this.note = this.octave*12+this.chroma;
      return this;
    }else{
      return this.chroma;
    }
  }

  duration(_duration){
    if (_duration){
      this.duration = _duration;
      return this;
    }else{
      return this.duration;
    }
  }

  extend(amount){
    amount = (amount === undefined)?1:parseInt(amount);
    this.duration += amount;
    return this;
  }

  contract(amount){
    amount = (amount === undefined)?1:parseInt(amount);
    this.duration -= amount;
    return this;
  }

  clone(){
    return new Note(this.note, this.duration);
  }

  play(synth, duration){
    synth.triggerAttackRelease(this.name, duration);
  }

  // play(){
  //   //length = length || tempo;//play for a whole measure
  //   let length = (this.duration*beat_length)/1000;
  //   if (MIDI.api){
  //     MIDI.noteOn(0, note, velocity);
  //     MIDI.noteOff(0, note, length);
  //     if (piano && piano.keys[note]) piano.keys[note].flash();
  //   }else{
  //     console.log('Can\'t play this note yet, not fully loaded.');
  //   }
  // }

  toString(){
    return this.name;
  }

  static fromGuitar (_options){
    let options = _options||{};
    // let chroma = options.chroma>=0?options.chroma:Math.round(Math.random()*11);
    // let octave = options.octave>=0?options.octave:Math.round(Math.random()*(octave_range[1]-octave_range[0])+octave_range[0]);
    // let note = octave*12+chroma;
    let duration = options.duration>0?options.duration:1;
    let note = Math.floor(Math.random()*(MIDI.guitarRange[1]-MIDI.guitarRange[0]+1)+MIDI.guitarRange[0]);
    return new Note(note, duration);
    //let note = Math.round(Math.random()*(MIDI.key_range[1]-MIDI.key_range[0])+MIDI.key_range[0]); 
  }

  static generate (_options){
    let options = _options||{};
    let chroma = options.chroma>=0?options.chroma:Math.round(Math.random()*11);
    let octave = options.octave>=0?options.octave:Math.round(Math.random()*(octave_range[1]-octave_range[0])+octave_range[0]);
    let duration = options.duration>0?options.duration:4;
    // let note = octave*12+chroma;
    return new Note(chroma, octave, duration);
    //let note = Math.round(Math.random()*(MIDI.key_range[1]-MIDI.key_range[0])+MIDI.key_range[0]); 
  }

  // static generate (_options){
  //   let octave_range = [Math.floor(MIDI.key_range[0]/12), Math.ceil(MIDI.key_range[1]/12)];
  //   let options = _options||{};
  //   let chroma = options.chroma>=0?options.chroma:Math.round(Math.random()*11);
  //   let octave = options.octave>=0?options.octave:Math.round(Math.random()*(octave_range[1]-octave_range[0])+octave_range[0]);
  //   let duration = options.duration>0?options.duration:1;
  //   let note = octave*12+chroma;
  //   if (note > MIDI.key_range[0] && note < MIDI.key_range[1]){
  //     return new Note(note, duration);
  //   }else if (options.tries > 4){
  //     options.tries++;
  //     return Note.generate(options);//if its not within the range just try again...
  //   }else{
  //     return Note.generate();//if something invalid happend, just make something up
  //   }
  //   //let note = Math.round(Math.random()*(MIDI.key_range[1]-MIDI.key_range[0])+MIDI.key_range[0]); 
  // }

};
//Note.chroma_key = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
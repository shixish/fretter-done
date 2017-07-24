import Tone from 'tone';
import MIDI from './MIDI.jsx';
let synth = new Tone.Synth().toMaster();

// let delay = 0; // play note right away
// let length = 0.75;
// let velocity = 127; // how hard the note hits
let num_keys = 88;
// let default_octave = 3;
let tempo = 120;//beats per minute


let beat_length = 1000/(tempo/60);
let octave_range = [2, 5];

module.exports = class Note{
  constructor(){
    if (arguments.length === 2){
      let [note, duration] = arguments;
      if (typeof note === 'string')
        note = MIDI.noteNames.indexOf(note);
      this.note(note);
      this.duration(duration);
    }else if (arguments.length === 3){
      let [chroma, octave, duration] = arguments;
      this._chroma = parseInt(chroma);
      this._octave = parseInt(octave);
      this._note = this._octave*12+this._chroma;
      this.duration(duration);
    }
  }

  get name(){
    return MIDI.letters[this._chroma] + this._octave;
  }

  get keyColor(){
    if (this._chroma === 1 || this._chroma === 3 || this._chroma === 6 || this._chroma === 8 || this._chroma === 10){
      return 'black';
    }else{
      return 'white';
    }
  }

  note(note){
    if (note){
      this._note = parseInt(note);
      this._chroma = this._note%12;
      this._octave = Math.floor(this._note/12);
      return this;
    }else{
      return this._note;
    }
  }

  octave(octave){
    if (octave){
      this._octave = parseInt(octave);
      this._note = this._octave*12+this._chroma;
      return this;
    }else{
      return this._octave;
    }
  }

  octaveUp(){
    this._octave(this._octave+1);
    return this;
  }

  octaveDown(){
    this._octave(this._octave-1);
    return this;
  }

  chroma(chroma){
    if (chroma){
      this._chroma = parseInt(chroma);
      this._note = this._octave*12+this._chroma;
      return this;
    }else{
      return this._chroma;
    }
  }

  duration(duration){
    if (duration){
      this._duration = duration;
      return this;
    }else{
      return this._duration || '4n';
    }
  }

  extend(amount){
    amount = (amount === undefined)?1:parseInt(amount);
    this._duration += amount;
    return this;
  }

  contract(amount){
    amount = (amount === undefined)?1:parseInt(amount);
    this._duration -= amount;
    return this;
  }

  clone(){
    return new Note(this._note, this._duration);
  }

  play(){
    synth.triggerAttackRelease(this.name, '4n');//this._duration
  }

  // play(){
  //   //length = length || tempo;//play for a whole measure
  //   let length = (this._duration*beat_length)/1000;
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

  static fromGuitar(string){
    let range = [MIDI.guitarRange[0], MIDI.guitarRange[1]];
    if (string === 'E'){
      range[1] = MIDI.guitarRange[0]+12;
    }else if (string === 'A'){
      range[0] = MIDI.guitarRange[0]+5;
      range[1] = range[0]+12;
    }else if (string === 'D'){
      range[0] = MIDI.guitarRange[0]+5+5;
      range[1] = range[0]+12;
    }else if (string === 'G'){
      range[0] = MIDI.guitarRange[0]+5+5+5;
      range[1] = range[0]+12;
    }else if (string === 'B'){
      range[0] = MIDI.guitarRange[0]+5+5+5+4;
      range[1] = range[0]+12;
    }else if (string === 'e'){
      range[0] = MIDI.guitarRange[0]+5+5+5+4+5;
      range[1] = range[0]+12;
    }
    console.log('Picking a note between', MIDI.noteNames[range[0]], 'and', MIDI.noteNames[range[1]]);
    let note = Math.floor(Math.random()*(range[1]-range[0]+1)+range[0]);
    return new Note(note, 1);
    //let note = Math.round(Math.random()*(MIDI.key_range[1]-MIDI.key_range[0])+MIDI.key_range[0]); 
  }

  static generate (options){
    options = options||{};
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
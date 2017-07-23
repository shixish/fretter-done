window.Scale = function(_options){
  var options = _options||{};
  this.tonic = options.tonic!=undefined?options.tonic:0;
  this.type = options.type||'Major';
  this.notes = [];
  octave_breakpoint = 0;
  
  var _this = this;//stupid scoping...
  var parse_pattern = function(steps){
    var chroma = _this.tonic;
    _this.notes = [];
    for (var s in steps){
      _this.notes[s] = chroma;
      chroma += parseInt(steps[s]);
      if (chroma > 11){
        chroma -= 12;
        octave_breakpoint = s;
      }
      //chroma = step(chroma, parseInt(steps[s]));
    }
  }
  
  function step(p, s){
    var r = p+s;
    if (r > 11)
      return r-12;
    else
      return r;
  }
  
  //var stepper = this.tonic;
  switch (this.type){
    case 'Major':
      parse_pattern([2, 2, 1, 2, 2, 2, 1]);
      break;
    case 'Minor':
      parse_pattern([2, 1, 2, 2, 1, 2, 2]);
      break;
  }
  
  this.getNote = function(_id, _octave, _duration){
    var id = _id!=undefined?_id:0;
    var octave = _octave!=undefined?parseInt(_octave):default_octave;
    var duration = _duration>0?_duration:1;
    var note_count = this.notes.length;
    //if (id >= note_count || id < 0){
      octave += Math.floor(id/note_count);
      id = Math.abs(id%note_count);
      if (id > octave_breakpoint){
        octave++;
      }
    //}
    return Note.generate({chroma:this.notes[id], octave:octave, duration:duration});
  }
  
  this.getChord = function(_id, _octave, _duration){
    var id = _id!=undefined?parseInt(_id):0;
    //return new Chord([this.getNote(id, _octave), this.getNote(id+2, _octave), this.getNote(id+4, _octave)]);
    quality = Scale.chord_qualities[this.type][id];
    return new Chord(this.getNote(id, _octave, _duration), quality);
  }
}
//see: http://musictheoryblog.blogspot.com/2007/01/minor-scales.html
window.Scale.scales = {
  'Major': [2, 2, 1, 2, 2, 2, 1],
  'Minor': [2, 1, 2, 2, 1, 2, 2],
  'HMinor': [2, 1, 2, 2, 1, 3, 1],
  'MMinor': [2, 1, 2, 2, 2, 2, 1],//This is the ascending scale, decending you use natural minor...
};
//See: http://musictheory.alcorn.edu/Version2/theory1/Roman.htm
window.Scale.chord_qualities = {
  'Major':['Major', 'Minor', 'Minor', 'Major', 'Major', 'Minor', 'Diminished'],
  'Minor':['Minor', 'Diminished', 'Major', 'Minor', 'Minor', 'Major', 'Major'],//'Major', 'Major', 'Diminished'],//natural minor
  'HMinor':['Minor', 'Diminished', 'Augmented', 'Minor', 'Major7', 'Major', 'Diminished'],
  'MMinor':['Minor', 'Minor', 'Augmented', 'Major', 'Major', 'Diminished', 'Diminished'],
};
window.Scale.tonic_map = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
//http://www.tsmp.org/theory/lias/pdf/quickfacts.pdf
//I ii iii IV V vi vii°
window.Scale.generate = function(){
  var tonic = Math.round(Math.random()*11);
  var type = Math.round(Math.random())?"Major":"Minor";
  return new Scale({tonic:tonic, type:type});
}
window.Scale.prototype.toString = function(){
  return Scale.tonic_map[this.tonic] + ' ' + this.type;
}
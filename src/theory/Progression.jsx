window.Progression = function(_scale, _octave){
  this.scale = _scale;
  this.octave = _octave!=undefined?parseInt(_octave):default_octave;
  this.progression = [];
  this.length = 0;
  //this.bpm = 4; //beats per measure
  //this.progression.push([0, scale.getChord(0, this.octave, 1)]);
  //this.progression.push([1, scale.getChord(0, this.octave, .25)]);
  //this.progression.push([1.30, scale.getChord(0, this.octave, .75)]);
  //this.progression.push([2, scale.getChord(2, this.octave, 1)]);
  //this.progression.push([3, scale.getChord(1, this.octave, 1)]);
  //this.progression.push([4, scale.getChord(4, this.octave, 1)]);
  //this.progression.push([5, scale.getChord(5, this.octave, 1)]);
  //this.progression.push([6, scale.getChord(0, this.octave+1, 3)]);

  this.generate = function(type){
    this.progression = [];
    var total_notes = 8;
    for (var i = 0; i<total_notes; i++){
      var tonic = (i+1 == total_notes)?0:Math.floor(Math.random()*8);//always end on the tonic
      var high1 = scale.getChord(tonic, this.octave+2, 1).contract(.5).arpeggiate(.33).invert();
      var high2 = scale.getChord(tonic, this.octave+2, 1).contract(.5).arpeggiate(.33).invert().remove();
      var low = scale.getChord(tonic, this.octave, 1).invert().extend();
      this.add(i*2+1, high1);
      this.add(i*2+2, high2);
      this.add(i*2, low);
    }
    return this;
  }

  this.init = function(tonic_array, _options){
    var opt = $.extend({
      duration:1,
      spacing:1,
      transform:[],
    }, _options);
    var start_time = this.length;
    for (var i in tonic_array){
      this.add(start_time, scale.getChord(tonic_array[i], this.octave, opt.duration).transform(opt.transform));
      start_time += opt.spacing;
    }
    this.length = start_time;
    return this;
  }

  //time == when to play it, thing = a chord or note or something that can be played
  this.add = function(time, thing){
    this.progression.push([time, thing]);
    return this;
  }

  this.demo = function(){
    this.progression = [];
    //for (var i = 0; i<8; i++){
    //  this.add(i, scale.getChord(i, this.octave, 1));//tonic, octave, length
    //}
    this.init([0, 1, 2, 3, 4, 5, 6, 7]);
    return this;
  }

  this.play = function(){
    //var pos = 0, len = this.progression.length;
    //var player = function(){
    //  var chord = this.progression[pos][0], length = this.progression[pos][1]*beat_length;
    //  console.log(this.progression[pos], chord);
    //  if (chord) chord.play(length);
    //  if (++pos < len) setTimeout(player, length);
    //}
    ////player();
    //player.call(this);
    for (var p in this.progression){
      (function(start, chord){
        setTimeout(function(){
          chord.play();
        }, start);
      })(this.progression[p][0]*beat_length, this.progression[p][1]);
    }
  }
}
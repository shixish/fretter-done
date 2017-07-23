window.Composition = function(){
  this.lines = [];
  this.add = function(line, time, thing){
    if (!this.lines[line]) this.lines[line] = [];
    this.lines[line].push([time, thing]);
  }
  this.generate = function(line, time){
    
  }
  this.play = function(){
    for (var l in this.lines){
      for (var t in this.lines[l]){
        (function(line, start, thing){
          setTimeout(function(){
            thing.play();
          }, start);
        })(l, this.lines[l][t][0]*beat_length, this.lines[l][t][1]);
      }
    }
  }
}
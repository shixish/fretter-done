window.Piano = function(element, _options){
  var options = _options||{};
  var key_width = options.key_width||23;
  var black_key_width = options.black_key_width||13;
  var black_key_shift = black_key_width/2;

  var Key = function(_note, x){
    this.note = _note;
    var is_white = _note.isWhite();
    var key_color = is_white?'#fff':'#000';
    var rect;//Paper.rect(x, y, width, height, [r])

    if (is_white){//white key
      rect = paper.rect(x, 0, key_width, 120).toBack();//move it behind the black keys
    }else{//black key
      rect = paper.rect(x-black_key_shift, 0, black_key_width, 80);
    }
    rect.attr("fill", key_color);

    this.flash = function(d){
      var duration = d||1e2;
      var return_color = key_color, new_color = is_white?'#ee0':'#cc0';
      rect.animate({ fill: new_color }, duration, function(){
        rect.animate({ fill: return_color }, duration*4);
      });
    }

    var _this = this;
    rect.mousedown(function (e){
      _note.play();
      _this.flash();
    });

    rect.mouseover(function(e){
      var new_color = is_white?'#7d7':'#090'
      rect.animate({ fill: new_color }, 1e2);
    });

    rect.mouseout(function(e){
      rect.animate({ fill: key_color }, 1e2);
    });
  }

  //initialize the piano:
  var h = 120, w = key_width*51;
  var paper = Raphael(element, w, h);//x,y,w,h
  paper.setViewBox(0,0,w,h,true);

  this.keys = {};

  var num = 0;
  for (var i = MIDI.key_range[0]; i<MIDI.key_range[1]; i++){
    var note = new Note(i);
    var key = new Key(note, key_width*num);
    this.keys[i] = key;
    if (note.isWhite())//only increment when it's a white key
      num++;
  }
}
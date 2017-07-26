import './index.sss';
// import styles from './index.css';

import React from 'react';
import {render} from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
//See: http://www.material-ui.com/#/
import injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap 
// http://stackoverflow.com/a/34015469/988941 
injectTapEventPlugin(); //Docs say this is temporary until React's native implementation becomes available...

import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import Random from 'random-js';
let random = new Random();
window.random = random;

// import Pizzicato from 'pizzicato';
// import Tone from 'tone';
import Note from './theory/Note.jsx';
import Chord from './theory/Chord.jsx';
// import Arrows from './img/arrows.svg';

// let polySynth = new Tone.PolySynth(4, Tone.Synth).toMaster();
// let synth = new Tone.Synth().toMaster();

const strings = ['all', 'E', 'A', 'D', 'G', 'B', 'e'];

const stringNames = (string)=>{
  switch(string){
    case 'all':
      return 'All Strings';
    default:
      return string+' String';
  }
}

const chordNames = (chord)=>{
  switch(chord){
    case 'root':
      return 'Single Note';
    case 'random':
      return 'Random Chord';
    default:
      return chord;
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);

    // > The only place where you can assign this.state is the constructor.
    //  Need to use this.setState otherwise.
    this.state = {
      note: '',
      notesLabel: '',
      string: '',
      quality: ''
    };
  }

  componentDidMount() {
    this.setString('E');
    this.setQuality('root');
    this.newNote();
    window.addEventListener('keyup', (e)=>{
      // console.log(e);
      if (e.code === 'Space'){
        this.next();
      } else if (e.code === 'Enter' || e.code === 'NumpadEnter'){
        this.play();
      }else if (e.code === 'ArrowLeft'){
        this.setString(strings[Math.max(strings.indexOf(this.string)-1, 0)]);
      }else if (e.code === 'ArrowRight'){
        this.setString(strings[Math.min(strings.indexOf(this.string)+1, strings.length-1)]);
      }else if (e.code === 'ArrowUp'){
        let qualities = this.stringMenuItems(this.string);
        this.setQuality(qualities[Math.max(qualities.indexOf(this.quality)-1, 0)]);
      }else if (e.code === 'ArrowDown'){
        let qualities = this.stringMenuItems(this.string);
        this.setQuality(qualities[Math.min(qualities.indexOf(this.quality)+1, qualities.length-1)]);
      }
    });
  }

  newNote(){
    let old = this.root;
    do{
      this.root = Note.fromGuitar(this.string);
    }while(old && this.root.name === old.name);
    this.newChord();
    return this;
  }

  newChord(){
    if (this.quality !== 'root'){
      let quality = this.quality === 'random'?random.pick(Chord.StringChords(this.string)):this.quality;
      this.chord = new Chord(this.root, quality, this.string);
      this.setState({
        note: this.chord.name,
        notesLabel: this.chord._notes.map(n=>n.name).join(' ')
      });
    }else{
      this.setState({
        note: this.root.name,
        notesLabel: ''
      });
      delete this.chord;
    }
  }

  next(){
    this.play(); //replay the old note before moving on..
    setTimeout(()=>{
      this.newNote();  
      this.play();
    }, 400);
  }

  play(){
    if (this.chord){
      this.chord.play();
    }else{
      this.root.play();
    }
    return this;
  }

  setString(value){
    this.string = value;
    this.quality = 'root';
    this.setState({
      string: this.string,
      quality: this.quality
    });
    this.newNote();
  }

  setQuality(value){
    this.quality = value;
    this.setState({
      quality: this.quality
    });
    this.newChord();
  }

  stringMenuItems(string){
    return ['root','random'].concat(Chord.StringChords(string));
  }

  render(){
    return <div>
      <DropDownMenu value={this.state.string} onChange={(event, index, value) => this.setString(value)} style={{width: 200}}>
        {strings.map(s=><MenuItem key={s} value={s} primaryText={stringNames(s)} />)}
      </DropDownMenu>
      <DropDownMenu value={this.state.quality} onChange={(event, index, value) => this.setQuality(value)} style={{width: 200}}>
        {this.stringMenuItems(this.state.string).map(c=><MenuItem key={c} value={c} primaryText={chordNames(c)} />)}
      </DropDownMenu>
      {/* <RaisedButton label="Default" style={{"vertical-align": "bottom"}}/> */}
      <div id="note">{this.state.note}</div>
      <div>{this.state.notesLabel}</div>
    </div>;
  }
}

render(<MuiThemeProvider><App /></MuiThemeProvider>, document.getElementById('app'));
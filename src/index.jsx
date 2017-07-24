import './index.sss';
// import styles from './index.css';

import React from 'react';
import {render} from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
//See: http://www.material-ui.com/#/
import injectTapEventPlugin from 'react-tap-event-plugin';
import RaisedButton from 'material-ui/RaisedButton';

// Needed for onTouchTap 
// http://stackoverflow.com/a/34015469/988941 
injectTapEventPlugin(); //Docs say this is temporary until React's native implementation becomes available...

// import Pizzicato from 'pizzicato';
// import Tone from 'tone';
import Note from './theory/Note.jsx';
import Chord from './theory/Chord.jsx';
// import Arrows from './img/arrows.svg';

// let polySynth = new Tone.PolySynth(4, Tone.Synth).toMaster();
// let synth = new Tone.Synth().toMaster();

class App extends React.Component {
  constructor(props) {
    super(props);

    // > The only place where you can assign this.state is the constructor.
    //  Need to use this.setState otherwise.
    this.state = {
      note: ''
    };
  }

  componentDidMount() {
    this.newNote();
    window.addEventListener('keyup', (e)=>{
      // console.log(e);
      if (e.code === 'Space'){
        this.next();
      } else if (e.code === 'Enter' || e.code === 'NumpadEnter'){
        this.play();
      }
    });
  }

  newNote(){
    let old = this.note;
    do{
      this.note = Note.fromGuitar('A');
    }while(old && this.note.name === old.name);
    this.chord = new Chord(this.note, 'Adim7');
    this.setState({
      note: this.note.name
    });
    console.log(this.chord.name, this.chord._notes.map(n=>n.name), this.chord);
    return this;
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
      this.note.play();
    }
    console.log(this.note);
    return this;
  }

  render(){
    return <div>
      <RaisedButton label="Default" />
      <div id="note">{this.state.note}</div>
    </div>;
  }
}

render(<MuiThemeProvider><App /></MuiThemeProvider>, document.getElementById('app'));
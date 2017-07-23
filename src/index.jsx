import './index.sss';
import React from 'react';
import {render} from 'react-dom';
// import Pizzicato from 'pizzicato';
import Tone from 'tone';
import Note from './theory/Note.jsx';
// import Arrows from './img/arrows.svg';

let polySynth = new Tone.PolySynth(4, Tone.Synth).toMaster();
let synth = new Tone.Synth().toMaster();

class App extends React.Component {
  constructor(props) {
    super(props);

    this.note = Note.fromGuitar();

    // > The only place where you can assign this.state is the constructor.
    //  Need to use this.setState otherwise.
    this.state = {
      date: new Date(),
      note: this.note.name
    };
  }

  componentDidMount() {
    window.addEventListener('keydown', (e)=>{
      if (e.code === 'Space'){
        this.next();
      } else if (e.code === 'Enter'){
        this.play();
      }
    });
  }

  next(){
    this.note = Note.fromGuitar();
    this.setState({
      note: this.note.name
    });
  }

  play(){
    this.note.play(synth, '8n');
  }

  render(){
    return <div>
      <div id="note">{this.state.note}</div>
    </div>;
  }
}

render(<App />, document.getElementById('app'));
import './index.sss';
// import styles from './index.css';

import React from 'react';
import {render} from 'react-dom';
import {Button} from 'react-toolbox/lib/button';

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
      <Button label="Hello World!" />
      <div id="note">{this.state.note}</div>
    </div>;
  }
}

render(<App />, document.getElementById('app'));
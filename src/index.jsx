import React from 'react';
import {render} from 'react-dom';
import Pizzicato from 'pizzicato';
import './index.sss';

class App extends React.Component {
  render () {
    return <p>Hello React!</p>;
  }
}

render(<App />, document.getElementById('app'));

function component() {
  var element = document.createElement('div');

  // Lodash, now imported by this script
  element.innerHTML = 'test';
  element.classList.add('hello');

  console.log('hello');
  var sawtoothWave = new Pizzicato.Sound({ 
    source: 'wave',
    options: {
      type: 'sawtooth'
    }
  });

  // sawtoothWave.play();

  return element;
}

document.body.appendChild(component());
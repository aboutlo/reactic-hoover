require ('../../assets/stylesheets/input.scss');

import React        from 'react';
import RoombaAction from '../actions/RoombaAction';
import TileStore    from '../stores/TileStore';

const Input = React.createClass({

  getInitialState () {
    return {
      inputs: ['5 5', '1 2', '1 0', '2 2', '2 3', 'NNESEESWNWW' ],
      tiles: TileStore.findAll()
    }
  },

  doRun (e) {
    e.preventDefault();
    RoombaAction.run();

  },

  componentDidMount: function() {
    TileStore.addChangeListener(this.onChange);
  },

  componentWillUnmount: function() {
    TileStore.removeChangeListener(this.onChange);
  },

  doSeed (e) {
    // use data from input field.
    e.preventDefault();
    if (this.isValid()){
      RoombaAction.seed(this.state.inputs.slice(0));
    }
  },

  onChange (event) {
    this.setState({
      tiles: TileStore.findAll()
    });
  },

  isValid () {
    return this.state.inputs.every(line => {
      return line.match(/^[0-9].[0-9]$|^[NSWE]*$/g)
    });
  },

  handlerChange: function(event) {
    this.setState({
      inputs: event.target.value.split('\n')
    });
  },

  render () {
    return (<section className="app__container">
              <h2 className="app__title-section">Input</h2>
              <form className="app__content" onSubmit={this.doRun} >
                <textarea ref="inputValues" className={this.isValid() ? 'input__values' : 'input__values input__values--error'  }
                          rows="6" columns="5"
                          onChange={this.handlerChange}
                          defaultValue={this.state.inputs.join('\n')} />
                <ul className="input__info">
                  <li className="input__item-info">The first line holds the room dimensions (X Y), separated by a single space</li>
                  <li className="input__item-info">The second line holds the hoover position</li>
                  <li className="input__item-info">Subsequent lines contain the zero or more positions of patches of dirt</li>
                  <li className="input__item-info">The next line then always contains the driving instructions</li>
                </ul>
                <input className={this.isValid() ? 'input__button' : 'input__button input__button--disabled' } type="button" value="seed" onClick={this.doSeed} disabled={this.isValid() ? '' : 'disabled'}   />
                <input className={this.isValid() && this.state.tiles.length > 0 ? 'input__button': 'input__button input__button--disabled'} type="button" value="run" disabled={this.isValid() && this.state.tiles.length > 0 ? '' : 'disabled'} onClick={this.doRun} />
              </form>
            </section>);
  }

});

export default Input;
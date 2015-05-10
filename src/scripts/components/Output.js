require('../../assets/stylesheets/output.scss');

import React          from 'react';
import RoombaAction   from '../actions/RoombaAction';
import TileStore      from '../stores/TileStore';
import TileConstants  from '../constants/TileConstants';

const Output = React.createClass({

  getInitialState () {
    var hoverPosition = TileStore.findByStatus(TileConstants.COVERED);
    return {
      cleanedTiles: TileStore.findAllByStatus(TileConstants.CLEANED),
      hoverPosition: hoverPosition ? hoverPosition : {x:'',y:''}
    }
  },

  componentDidMount: function() {
    TileStore.addChangeListener(this.onChange);
  },

  componentWillUnmount: function() {
    TileStore.removeChangeListener(this.onChange);
  },

  onChange: function() {
    var hoverPosition = TileStore.findByStatus(TileConstants.COVERED);
    this.setState({
      cleanedTiles: TileStore.findAllByStatus(TileConstants.CLEANED),
      hoverPosition:  hoverPosition ? hoverPosition : {x:'',y:''}
    });
  },

  render () {
    return (<section className="app__container">
              <h2 className="app__title-section">Output</h2>
              <section className="app__content output__container">
                <p>Dirty Patches Cleaned:[<em className="output__label output__label--blue" >{this.state.cleanedTiles.length}</em>]</p>
                <p>Hover Position:[<em className="output__label output__label--green" >{this.state.hoverPosition.x} {this.state.hoverPosition.y}</em>]</p>
              </section>
            </section>);
  }

});

export default Output;
require ('../../assets/stylesheets/room.scss');

import React      from 'react';
import TileStore  from '../stores/TileStore';

const Room = React.createClass({

  getInitialState () {
    return {
      tiles: TileStore.findAll(),
      dimensions: TileStore.getDimensions()
    }

  },

  componentDidMount: function() {
    TileStore.addChangeListener(this.onChange);
  },

  componentWillUnmount: function() {
    TileStore.removeChangeListener(this.onChange);
  },

  onChange: function() {
    this.setState({
      tiles: TileStore.findAll(),
      dimensions: TileStore.getDimensions()
    });
  },

  render (){
    var rows = [];
    var tiles = this.state.tiles.slice(0);
    var rowId = 0;
    while (tiles.length){
      //debugger;
      var columns = tiles.splice(0,this.state.dimensions.columns);
      columns = columns.map(tile => {
        // WORKAROUND status should return just the proper status. Use bitmask
        var status = tile.status.length > 1 ? 'covered' : tile.status;
        return <td key={tile.x+''+tile.y} className={"room__tile--" + status + " room__tile"} >{tile.x+','+tile.y}</td>
      } );
      rows.push(<tr key={rowId++}>{columns}</tr>)
    }

    return (<section className="app__container app__container--text-align-centered">
              <h2 className="app__title-section">Room</h2>
              <section className="app__content">
                <table className="room__container">
                  {rows}
                </table>
              </section>
            </section>)
  }

});

export default Room;
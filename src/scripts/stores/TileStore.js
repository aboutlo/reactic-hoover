import _                from 'underscore';
import assign           from 'object-assign';
import { EventEmitter } from 'events';

import AppDispatcher    from '../dispatcher/AppDispatcher';
import TileConstants    from '../constants/TileConstants';
import ActionType       from '../constants/RoombaConstants';

const CHANGE_EVENT = 'change';

let _tiles = [];
let _dimensions = {
  rows: 5,
  columns: 5
};
let _patches = [];
let _hoverPosition = {x:0,y:0};
let _instructions = [];


const TileStore = assign({}, EventEmitter.prototype, {

  addChangeListener (callback)  {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  emitChange () {
    this.emit(CHANGE_EVENT);
  },

  onChange (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  off (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  seed (options) {
    options = options || {};
    if (options.dimensions){
      _dimensions = options.dimensions
    }
    if (options.instructions){
      _instructions = options.instructions
    }
    if (options.patches){
      _patches = options.patches
    }
    if (options.startPosition){
      _hoverPosition = options.startPosition
    }

    this.$createTiles(_dimensions);
    this.$soil(_patches);
    this.$cover(_hoverPosition.x, _hoverPosition.y );

    this.emitChange();
  },

  findByStatus(status){
    return _.find(_tiles, function(tile) {
      return _.contains(tile.status,status);
    });
  },

  findByXAndY(x,y){
    return _.findWhere(_tiles, {x: x, y: y})
  },

  findAll(){
    return _tiles;
  },

  findAllByStatus(status){
    return _.filter(_tiles, function(tile) {
      return _.contains(tile.status,status);
    });
  },

  getDimensions(){
    return _dimensions;
  },

  getInstuctions(){
    return _instructions;
  },

  run () {
    setInterval(this.tick.bind(this),500);
    //this.tick();
  },

  tick () {
    var tile = this.findByStatus(TileConstants.COVERED);
    var instruction = this.getInstuctions().shift();
    var covered = this.moveTo(tile, instruction);
    this.$hovering(covered);
    this.emitChange();
  },

  moveTo (tile, instruction) {
    var x = tile.x;
    var y = tile.y;

    //console.log('instruction:',instruction);
    switch (instruction){
      case 'N':
        y++;
        break;

      case 'S':
        y--;
        break;

      case 'W':
        x--;
        break;

      case 'E':
        x++;
        break;

      default:
      // DONOTHING
    }

    //console.log('tile.status:',tile.status);
    this.$uncover();
    var covered = this.$cover(x,y);
    //console.log('covered.status:',covered.status);

    return covered;

  },

  $createTiles (dimensions) {
    _tiles = [];
    //console.log('dimensions.columns:',dimensions.columns);
    //console.log('dimensions.rows:',dimensions.rows);
    for (let r = dimensions.rows; r > 0 ; r--) {
      for (let c =  0; c < dimensions.columns; c++) {
        var tile = {x: c , y: r-1 , status: [TileConstants.EMPTY]};
        //console.log(tile);
        _tiles.push(tile);
      }
    }
    //console.log('_tiles:',_tiles.length);
  },

  $soil (patches) {
    patches.forEach(patch => {
      var tile = this.findByXAndY(patch.x, patch.y);
      tile.status = [TileConstants.DIRTY];
    });

  },

  $hovering (tile) {
    if ( _.contains(tile.status, TileConstants.DIRTY)){
      tile.status = _.without(tile.status, TileConstants.DIRTY);
      tile.status.push(TileConstants.CLEANED);
    }
    return tile;
  },

  $uncover () {
    var tile = this.findByStatus(TileConstants.COVERED);
    tile.status = _.without(tile.status,TileConstants.COVERED);
    return tile;
  },

  $cover (x,y) {
    var tile = this.findByXAndY(x, y);
    if (tile) tile.status.push(TileConstants.COVERED);
    return tile;
  }

});

TileStore.dispatchToken = AppDispatcher.register(function(action) {

  switch(action.id) {

    case ActionType.RUN:
      TileStore.run(action);
      break;

    case ActionType.SEED:
      TileStore.seed(action);
      break;

    default:
      // do nothing
  }

});

export default TileStore;

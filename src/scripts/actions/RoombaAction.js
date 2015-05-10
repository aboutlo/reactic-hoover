import  AppDispatcher from'../dispatcher/AppDispatcher';
import  ActionTypes   from'../constants/RoombaConstants';

const RoombaAction = {

  run () {
    AppDispatcher.dispatch({
      id:            ActionTypes.RUN
    });
  },

  seed (inputs) {
    var dimensions = this.extractCoordinate(inputs.shift());
    var startPosition = this.extractCoordinate(inputs.shift());
    var instruction = inputs.pop().split('');

    AppDispatcher.dispatch({
      id:            ActionTypes.SEED,
      dimensions:    { rows: dimensions.y, columns: dimensions.x },
      startPosition: startPosition,
      patches:       this.extractCoordinates(inputs),
      instructions:  instruction
    });

  },

  extractCoordinate (input){
    var coordinates = input.split(' ');
    return {x: parseInt(coordinates[0]), y: parseInt(coordinates[1])};
  },

  extractCoordinates (coordinates){
    return coordinates.map(coordinate => {
      return this.extractCoordinate(coordinate)
    });
  }

};

export default RoombaAction;

jest.dontMock('object-assign');
jest.dontMock('underscore');

jest.dontMock('../../constants/TileConstants');
jest.dontMock('../TileStore');

import TileConstants from '../../constants/TileConstants';
import _ from 'underscore';

describe('TileStore', () => {

  let subject;

  beforeEach(() => {
    subject = require('../TileStore');
  });

  describe('#default', () => {

    it('findAll', () => {
      expect(subject.findAll().length).toBe(0);
    });

    it('getDimensions', ()=> {
      expect(subject.getDimensions()).toEqual({rows: 5, columns: 5});
    });

    it('getInstructions', ()=> {
      expect(subject.getInstuctions().length).toBe(0);
    });
  });

  describe('#seed', () => {

    it('empty',()=>{
      subject.seed();
      expect(subject.findAll().length).toBe(25);
    });

    it('dimensions 2x3',()=>{
      subject.seed({dimensions:{rows:2, columns:3}});
      expect(subject.findAll().length).toBe(6);
    });

    it('has a dirty patch on bottom left corner',()=>{
      var pos = {x:0, y:0}
      subject.seed({patches:[pos]});
      expect(subject.findByXAndY(pos.x,pos.y).status).toContain(TileConstants.DIRTY);
    });

    it('has a dirty patch on top right corner',()=>{
      var pos = {x:1, y:2}
      subject.seed({dimensions:{columns:2, rows:3}, patches:[pos]});
      expect(subject.findByXAndY(pos.x,pos.y).status).toContain(TileConstants.DIRTY);
    });

  });

  describe('#moveTo', () => {

    beforeEach(()=>{
      subject.seed({startPosition:{x:2,y:2}});
    });

    it('move to north', () => {
      var tile = subject.findByStatus(TileConstants.COVERED)
      expect(subject.moveTo(tile,'N'))
          .toEqual({x:2,y:3,status:[TileConstants.EMPTY,TileConstants.COVERED]});
    });

    it('move to south', () => {
      var tile = subject.findByStatus(TileConstants.COVERED)
      expect(subject.moveTo(tile,'S'))
          .toEqual({x:2,y:1,status:[TileConstants.EMPTY,TileConstants.COVERED]});
    });

    it('move to west', () => {
      var tile = subject.findByStatus(TileConstants.COVERED)
      expect(subject.moveTo(tile,'W'))
          .toEqual({x:1,y:2,status:[TileConstants.EMPTY,TileConstants.COVERED]});
    });

    it('move to est', () => {
      var tile = subject.findByStatus(TileConstants.COVERED)
      expect(subject.moveTo(tile,'E'))
          .toEqual({x:3,y:2,status:[TileConstants.EMPTY,TileConstants.COVERED]});
    });

  });

  describe('#tick', () => {

    beforeEach(()=>{
      subject.seed({patches:[ {x:0,y:1} ], instructions:['N'] });
    });

    it('clean one dirty patch', () => {
      subject.tick();
      expect(subject.findAllByStatus(TileConstants.CLEANED).length)
          .toEqual(1)
      expect(subject.findByStatus(TileConstants.COVERED))
          .toEqual({x:0,y:1,status:[TileConstants.COVERED,TileConstants.CLEANED]})
    });

  });

});

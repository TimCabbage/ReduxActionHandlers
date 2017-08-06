"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const actionHandlers = {
  map: {},
  add: (shard, type, callback) => {
    if(!actionHandlers.map[shard]) actionHandlers.map[shard] = {}
    actionHandlers.map[shard][type] = callback
  },
  remove: (shard, type) => {
    if(!actionHandlers.map[shard]) return
    delete actionHandlers.map[shard][type]
  },
  runReducer: (shard, state, action) => {
    if(!actionHandlers.map[shard]) return state
    if(actionHandlers.map[shard][action.type]){
      const res = actionHandlers.map[shard][action.type](state, action);
      if(typeof(res) === 'object') {
        return res;
      }
      console.error('The actionHandler did NOT return a valid object, ignoring result ', state, action);
    }
    return state;
  }
}

exports.default = actionHandlers; 

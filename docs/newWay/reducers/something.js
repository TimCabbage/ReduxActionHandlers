import actionHandlers from 'redux-action-handlers'

export const initialState = {
  isFetching: false,
  data: {},
  registration: null,
  visible: false
};

const reducer = (state = initialState, action = {}) => {
  return actionHandlers.runReducer('something', state, action);
}

export default reducer

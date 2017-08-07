import {
  OPEN_INFO_PANEL,
  CLOSE_INFO_PANEL,
  READ_INFO_REQUEST,
  READ_INFO_SUCCESS,
  READ_INFO_FAILURE,
  UPDATE_TIMES_REQUEST,
  UPDATE_TIMES_SUCCESS,
  UPDATE_TIMES_FAILURE,
  UPDATE_POSITION_STAND_REQUEST,
  UPDATE_POSITION_STAND_SUCCESS,
  UPDATE_POSITION_STAND_FAILURE
} from 'features/info/actions'


export const defaultState = {
  data: {},
  flightId: null,
  isFetching: false,
  isUpdating: false,
  visible: false
}

export default (state = defaultState, action = {}) => {

  if (!action.type) return state

  switch(action.type) {

    case OPEN_INFO_PANEL:
      return {
        ...state,
        flightId: action.payload,
        isFetching: false,
        visible: true
      }

    case CLOSE_INFO_PANEL:
      return {
        ...state,
        flightId: null,
        isFetching: false,
        visible: false
      }

    case READ_INFO_REQUEST:
      return {
        ...state,
        data: {},
        flightId: action.payload,
        isFetching: true
      }

    case READ_INFO_SUCCESS:
      return {
        ...state,
        data: action.payload,
        isFetching: false
      }

    case READ_INFO_FAILURE:
      return {
        ...state,
        data: {},
        isFetching: false
      }

    case UPDATE_TIMES_SUCCESS:
      return {
        ...state,
        isUpdating: false,
        data: { ...state.data,
          times: {...state.data.times,
            actual: {...action.payload.actualTimes}
          }
        }
      }

    case UPDATE_POSITION_STAND_SUCCESS:
      return {
        ...state,
        isUpdating: false,
        data: {
          ...state.data,
          gatesInfo: {
            ...action.payload
          }
        }
      }

    case UPDATE_TIMES_REQUEST:
      return {
        ...state,
        isUpdating: true
      }

    case UPDATE_POSITION_STAND_REQUEST:
      return {
        ...state,
        isUpdating: true
      }

    case UPDATE_TIMES_FAILURE:
      return {
        ...state,
        isUpdating: false
      }

    case UPDATE_POSITION_STAND_FAILURE:
      return {
        ...state,
        isUpdating: false
      }

    default:
      return state
  }
}

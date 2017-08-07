import {
  DOWNLOAD_SOMETHING_REQUEST,
  DOWNLOAD_SOMETHING_SUCCESS,
  DOWNLOAD_SOMETHING_FAILURE
} from 'actions/downloadSomething_types.js'

export const initialState = {
  isFetching: false,
  data: {},
  registration: null,
  visible: false
};

const reducer = (state = initialState, action = {}) => {

  if (!action.type) return state

  switch (action.type) {

    case DOWNLOAD_SOMETHING_REQUEST:
      return {
        ...state,
        registration: action.payload,
        isFetching: true,
        data: {}
      }

    case DOWNLOAD_SOMETHING_SUCCESS:
      return {
        ...state,
        data: action.payload,
        isFetching: false
      }

    case DOWNLOAD_SOMETHING_FAILURE:
      return {
        ...state,
        data: {},
        isFetching: false
      }

    default:
      return state

  }
}

export default reducer

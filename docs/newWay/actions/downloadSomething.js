import actionHandlers from 'redux-action-handlers'

const DOWNLOAD_SOMETHING_REQUEST = '@request/DOWNLOAD_SOMETHING_REQUEST'
const DOWNLOAD_SOMETHING_SUCCESS = '@request/DOWNLOAD_SOMETHING_SUCCESS'
const DOWNLOAD_SOMETHING_FAILURE = '@request/DOWNLOAD_SOMETHING_FAILURE'

export function downloadSomethingRequest_actionHandler(state, action) {
  return {
    ...state,
    registration: action.payload,
    isFetching: true,
    data: {}
  }
}

export function downloadSomethingSuccess_actionHandler(state, action) {
  return {
    ...state,
    data: action.payload,
    isFetching: false
  }
}

export function downloadSomethingFailure_actionHandler(state, action) {
  return {
    ...state,
    data: {},
    isFetching: false
  }
}

export default function downloadSomethingAction() {
  return (dispatch) => {
    dispatch({
      type: DOWNLOAD_SOMETHING_REQUEST
    })

    return api.downloadSomething()
      .then(
        json => dispatch({
          type: DOWNLOAD_SOMETHING_SUCCESS,
          payload: json
        }),
        exception => {
          dispatch({
            type: DOWNLOAD_SOMETHING_FAILURE
          })
        }
      )
  }
}

actionHandlers.add('something', DOWNLOAD_SOMETHING_REQUEST, downloadSomethingRequest_actionHandler)
actionHandlers.add('something', DOWNLOAD_SOMETHING_SUCCESS, downloadSomethingSuccess_actionHandler)
actionHandlers.add('something', DOWNLOAD_SOMETHING_FAILURE, downloadSomethingFailure_actionHandler)

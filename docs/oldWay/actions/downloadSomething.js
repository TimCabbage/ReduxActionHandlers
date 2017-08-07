import {
  DOWNLOAD_SOMETHING_REQUEST,
  DOWNLOAD_SOMETHING_SUCCESS,
  DOWNLOAD_SOMETHING_FAILURE
} from 'src/actions/downloadSomething_types.js'

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
          dispatch(notifyError(exception.message))
        }
      )
  }
}

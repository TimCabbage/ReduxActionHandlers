# ReduxActionHandlers
ActionHandlers library to improve the Redux development experience

[![Node version](https://img.shields.io/node/v/redux-action-handlers.svg?style=flat)](http://nodejs.org/download/)

[![https://nodei.co/npm/redux-action-handlers.png?downloads=true&downloadRank=true&stars=true](https://nodei.co/npm/redux-action-handlers.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/redux-action-handlers)

[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/dwyl/esta/issues)

# Benefits of using this library:
- **One file describing all the functionality of an action.** Instead of splitting the action creator logic and reducer logic to two separate files, one **concern** is in one file.
- **Huge reducers are no longer a problem.** Instead of having all the reducer handling code in one huge switch...case block, each action is in it's own function which makes it cleaner.
- **When using combineReducers, You create shards. Those shards are enforced in actionHandlers.** This means that You will never have a polluted root reducer namespace

# Compatibility:
- This library has **no** dependencies
- It does not force the ActionHandlers on Your whole project. You can still use both classic reducer switch...case and ActionHandlers.
- It does not pollute the redux state with functions.
- It's a clean library - it supports all use cases.
- Supports nested combineReducers
- Supports many-to-many relationships between actions and reducer cases.
- It's tiny. All it takes is 31 lines of code.

# ReduxActionHandlers reason to exist

To create a single action and a reducer, you have to create multiple files and put a part of the implementation in each of them:
*For the full sources please look in docs/projects/rawRedux_01*

### src/actions/downloadSomething_types.js
```javascript
export const DOWNLOAD_SOMETHING_REQUEST = '@request/DOWNLOAD_SOMETHING_REQUEST'
export const DOWNLOAD_SOMETHING_SUCCESS = '@request/DOWNLOAD_SOMETHING_SUCCESS'
export const DOWNLOAD_SOMETHING_FAILURE = '@request/DOWNLOAD_SOMETHING_FAILURE'
```

### src/actions/downloadSomething.js
```javascript
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
```

### src/reducers/downloadReducer.js
```javascript
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
```

## This single concern, single chunk of functionality is spread over three separate files.

(We're not touching the testing files because this library does not influence testing at all - You can test the way You do now)
It makes it difficult to reason about and debug. The reducer construction is also an issue because it very easily can grow into a monster like this (and this has a potential to be **much** bigger):
```javascript
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
```

# Solution:
ReduxActionHandlers!
### Idea:
Put all the reducer cases into functions like so:
## Before:
```javascript
case DOWNLOAD_SOMETHING_REQUEST:
  return {
    ...state,
    registration: action.payload,
    isFetching: true,
    data: {}
  }
```

## After:
```javascript
function downloadSomethingRequest_actionHandler(state, action) {
  return {
    ...state,
    registration: action.payload,
    isFetching: true,
    data: {}
  }
}
```

### Then, instead of attaching actions externally ( from reducer ) we would attach actions to a reducer like so:

```javascript
actionHandlers.add('something', DOWNLOAD_SOMETHING_REQUEST, downloadSomethingRequest_actionHandler)
```

## Resulting files would be as follows:

### src/actions/downloadSomething.js
```javascript
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
          dispatch(notifyError(exception.message))
        }
      )
  }
}

actionHandlers.add('something', DOWNLOAD_SOMETHING_REQUEST, downloadSomethingRequest_actionHandler)
actionHandlers.add('something', DOWNLOAD_SOMETHING_SUCCESS, downloadSomethingSuccess_actionHandler)
actionHandlers.add('something', DOWNLOAD_SOMETHING_FAILURE, downloadSomethingFailure_actionHandler)
```

### src/reducers/downloadSomethingReducer.js
```javascript
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
```

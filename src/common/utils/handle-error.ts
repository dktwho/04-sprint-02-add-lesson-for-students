import { Dispatch } from 'redux'
import { isAxiosError } from 'axios'
import { setAppErrorAC } from '../../app/app-reducer.ts'

type ServerError = {
  errorMessages: Array<{
    message: string
    field: string
  }>
}

export const handleError = (e: unknown, dispatch: Dispatch) => {
  let errorMessage = ''
  if (isAxiosError<ServerError>(e)) {
    // case - 1, case - 2
    errorMessage = e.response
      ? e.response.data.errorMessages[0].message  // case - 1
      : e.message // case - 2
  } else {
    // case -3
    errorMessage = (e as Error).message
  }
  dispatch(setAppErrorAC(errorMessage))
}
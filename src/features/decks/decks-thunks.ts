import { Dispatch } from 'redux'
import { decksAPI, UpdateDeckParams } from './decks-api.ts'
import { addDeckAC, deleteDeckAC, setDecksAC, updateDeckAC } from './decks-reducer.ts'
import { setAppStatusAC } from '../../app/app-reducer.ts'
import { isAxiosError } from 'axios'

export const fetchDecksTC = () => async (dispatch: Dispatch) => {
  dispatch(setAppStatusAC('loading'))
  try {
    const res = await decksAPI.fetchDecks()
    dispatch(setDecksAC(res.data.items))
    dispatch(setAppStatusAC('succeeded'))
  } catch (e) {
    dispatch(setAppStatusAC('failed'))
  }
}

export const addDeckTC = (name: string) => async (dispatch: Dispatch) => {
  return decksAPI.addDeck(name).then((res) => {
    dispatch(addDeckAC(res.data))
  })
}

export const deleteDeckTC = (id: string) => (dispatch: Dispatch) => {
  return decksAPI.deleteDeck(id).then((res) => {
    dispatch(deleteDeckAC(res.data.id))
  })
}


// case - 1: ошибка запроса, axios создает объект ошибки, в response.data помещает ответ сервера
// case - 2: network error на стороне клиента - axios создает объект ошибки, текст ошибки берем из message
// case - 3: ошибка вне запроса, в нативном коде, не связана с запросом
export const updateDeckTC = (params: UpdateDeckParams) => async (dispatch: Dispatch) => {
  try {
    const res = await decksAPI.updateDeck(params)
    dispatch(updateDeckAC(res.data))
  } catch (e) {
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
    console.log(errorMessage)
  }
}

type ServerError = {
  errorMessages: Array<{
    message: string
    field: string
  }>
}

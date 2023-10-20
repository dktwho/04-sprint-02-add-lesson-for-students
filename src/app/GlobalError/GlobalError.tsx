import { useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { useAppSelector } from '../store.ts'
import { selectAppError } from '../app-selectors.ts'

export const GlobalError = () => {
  const errorMessage = useAppSelector(selectAppError)

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage)
    }
  }, [errorMessage])

  return <ToastContainer theme='dark' autoClose={3000} />
}


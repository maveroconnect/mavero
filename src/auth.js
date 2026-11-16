import { createContext, useContext } from 'react'
export const Auth = createContext()
export const useAuth = () => useContext(Auth)

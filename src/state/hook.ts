import { TypedUseSelectorHook, useDispatch as dispatch, useSelector as selector } from 'react-redux'
import type { RootState, AppDispatch } from './store'

export const useDispatch: () => AppDispatch = dispatch
export const useSelector: TypedUseSelectorHook<RootState> = selector
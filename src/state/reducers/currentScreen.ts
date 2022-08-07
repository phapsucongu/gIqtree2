import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CurrentScreen, ProjectScreenState, ScreenState } from './screenState';

const initialState: ScreenState = {
    currentScreen: CurrentScreen.Dashboard
}

export const screenSlice = createSlice({
    name: 'screen',
    initialState,
    reducers: {
        setScreen: (s, action: PayloadAction<CurrentScreen>) => {
            if (action.payload === CurrentScreen.Project) {
                throw new Error('Use setScreenProject to set action');
            }

            s.currentScreen = action.payload;
        },
        setScreenProject: (s, action : PayloadAction<ProjectScreenState>) => {
            for (let key in action) {
                (s as any)[key] = (action.payload as any)[key];
            }
        }
    }
})

export const { setScreen, setScreenProject } = screenSlice.actions
export default screenSlice.reducer;
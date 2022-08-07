
export enum CurrentScreen {
    Dashboard = 1,
    Project
}

export enum CurrentProjectSubScreen {
    Setting = 1,
    Log,
    File
}

export interface ScreenState {
    currentScreen: CurrentScreen;
}
export interface ProjectScreenState extends ScreenState {
    currentScreen: CurrentScreen.Project;
    currentSubScreen: CurrentProjectSubScreen;
    currentFile?: string;
}

export function isProjectScreenState(state: ScreenState): state is ProjectScreenState {
    return state.currentScreen === CurrentScreen.Project;
}
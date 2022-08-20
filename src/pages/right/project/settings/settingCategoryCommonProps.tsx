export interface SettingCategoryCommonProp<T> {
    settings?: T;
    onChange?: (newSetting: T) => void;
}
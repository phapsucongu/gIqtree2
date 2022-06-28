export enum DateInfoType {
    Tip = "Tip",
    Ancestral = "Ancestral"
}

export const DateInfoTypes = [
    { type: DateInfoType.Tip, name: "Tip" },
    { type: DateInfoType.Ancestral, name: "Ascentral date" },
]

export interface DatingSettings {
    dateInfoType?: DateInfoType;
    dateFile?: string;
}
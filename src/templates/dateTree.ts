import { Settings } from "../interfaces";
import { DateInfoType } from "../interfaces/datingSettings";

export default function dateTree() : Partial<Settings> {
    return {
        dating: {
            dateInfoType: DateInfoType.Tip
        }
    }
}
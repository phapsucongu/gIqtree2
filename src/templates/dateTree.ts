import { Settings } from "../interfaces";
import { DateInfoType } from "../interfaces/settings/datingSettings";

export default function dateTree() : Partial<Settings> {
    return {
        dating: {
            dateInfoType: DateInfoType.Tip
        }
    }
}
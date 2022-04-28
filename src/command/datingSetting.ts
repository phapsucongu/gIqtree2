import { Settings } from "../interfaces";
import { DateInfoType } from "../interfaces/datingSettings";

function prepare({ dating }: Settings) {
    let { dateFile, dateInfoType } = dating;
    let output : string[] = [];

    switch (dateInfoType) {
        case null:
        case undefined:
            return output;
        case DateInfoType.Ancestral:
            output.push('--date-tip', '0');
            output.push('--date', `${dateFile}`)
            break;
        case DateInfoType.Tip:
            output.push('--date', dateFile ? dateFile : 'TAXNAME');
            break;
    }

    return output;
}

export default prepare;
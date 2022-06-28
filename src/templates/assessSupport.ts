import { Settings } from "../interfaces";
import { BootstrapMethod } from "../interfaces/assessmentSettings";

export default function assessSupport() : Partial<Settings> {
    return {
        assessment: {
            bootstrapMethod: BootstrapMethod.Standard
        }
    }
}
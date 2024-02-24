import { Settings } from "../interfaces";
import { BootstrapMethod } from "../interfaces/settings/assessmentSettings";

export default function assessSupport() : Partial<Settings> {
    return {
        assessment: {
            bootstrapMethod: BootstrapMethod.Standard
        }
    }
}
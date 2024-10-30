import { Settings } from "../interfaces";
import { BootstrapMethod } from "../interfaces/settings/assessmentSettings";

export default function inferTree() : Partial<Settings> {
    return {
        treeSearch: {
            enabled: true
        },
        assessment: {
            bootstrapMethod: BootstrapMethod.UltraFastBootstrap
        }
    }
}
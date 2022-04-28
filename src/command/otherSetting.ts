import { Settings } from "../interfaces";

function prepare({ others }: Settings, defaultPrefix?: string) {
    let output: string[] = [];
    let { thread, prefix } = others ?? {};
    output.push('-T', thread ? thread.toString() : 'AUTO');

    if (prefix || defaultPrefix)
        output.push('--prefix', (prefix || defaultPrefix)!);

    return output;
}

export default prepare;
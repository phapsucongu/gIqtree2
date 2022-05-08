import { Settings } from "../interfaces";

function prepare({ others }: Settings, defaultPrefix?: string, threadOverwrite?: number) {
    let output: string[] = [];
    let { thread, prefix } = others ?? {};
    if (threadOverwrite)
        thread = threadOverwrite;
    output.push('-T', thread ? thread.toString() : 'AUTO');

    if (prefix || defaultPrefix)
        output.push('--prefix', (prefix || defaultPrefix)!);

    return output;
}

export default prepare;
import { Settings } from "../interfaces";

export function getThreadCommand(threadCount? : number) {
    return ['-T', threadCount ? threadCount.toString() : 'AUTO'];
}

function prepare({ others }: Settings, defaultPrefix?: string, threadOverwrite?: number) {
    let output: string[] = [];
    let { thread } = others ?? {};
    if (threadOverwrite)
        thread = threadOverwrite;
    output.push(...getThreadCommand(thread))

    if (defaultPrefix)
        output.push('--prefix', defaultPrefix);

    return output;
}

export default prepare;
declare module 'merge-stream' {
    interface MergedStream extends NodeJS.ReadWriteStream {
        add(source: NodeJS.ReadableStream | ReadonlyArray<NodeJS.ReadableStream>): MergedStream;
        isEmpty(): boolean;
    }

    function merge<T extends NodeJS.ReadableStream>(...streams: Array<T | ReadonlyArray<T>>): MergedStream;
    export = merge;
}
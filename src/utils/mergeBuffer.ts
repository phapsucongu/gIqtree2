function mergeBuffer(buffers: Uint8Array[]) {
    let all = buffers;
    let allLength = all.reduce((r, a) => r + a.length, 0);
    let merged = new Uint8Array(allLength);
    let offset = 0;
    all.forEach(item => {
        merged.set(item, offset);
        offset += item.length;
    });

    return merged;
}

export { mergeBuffer };
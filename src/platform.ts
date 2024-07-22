import { app } from "@electron/remote";
import { type } from "os";
import { join } from "path";

export const CompressedPath = {
    Linux: join('iqtree-2.1.3-Linux', 'bin', 'iqtree2'),
    Mac: join('iqtree-2.1.3-MacOSX', 'bin', 'iqtree2'),
    Windows: join('iqtree-2.1.3-Windows', 'bin', 'iqtree2.exe')
}

export const BinaryUrls = {
    Linux: "https://github.com/iqtree/iqtree2/releases/download/v2.1.3/iqtree-2.1.3-Linux.tar.gz",
    Mac: "https://github.com/iqtree/iqtree2/releases/download/v2.1.3/iqtree-2.1.3-MacOSX.zip",
    Windows: "https://github.com/iqtree/iqtree2/releases/download/v2.1.3/iqtree-2.1.3-Windows.zip"
}

export const supportedPlatforms = ['Linux', 'Darwin', 'Windows_NT'];
export const downloadPath = app.getPath('userData');

export function isPlatformSupported() {
    return supportedPlatforms.includes(type());
}

export function getCompressedPath() {
    switch (type()) {
        case 'Windows_NT': return CompressedPath.Windows;
        case 'Linux': return CompressedPath.Linux;
        case 'Darwin': return CompressedPath.Mac;
    }
}

export function getArchiveUrl() {
    switch (type()) {
        case 'Windows_NT': return BinaryUrls.Windows;
        case 'Linux': return BinaryUrls.Linux;
        case 'Darwin': return BinaryUrls.Mac;
    }
}

export function getBinaryPath() {
    if (isPlatformSupported())
        return join(downloadPath, getCompressedPath()!);
}
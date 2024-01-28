import { useEffect, useState } from 'react';
import { app } from '@electron/remote';
import axios from 'axios';
import { type } from 'os';
import prettyBytes from 'pretty-bytes';
import './index.css';
import { downloadPath, isPlatformSupported, supportedPlatforms, getArchiveUrl, getBinaryPath } from '../../platform';
import { ipcRenderer } from 'electron-better-ipc';
import useSsh from '../../hooks/useSsh';

let supported = isPlatformSupported()
let binaryUrl = getArchiveUrl();
let binaryPath = getBinaryPath();

async function decompress(zip: Uint8Array, path: string) {
    return await ipcRenderer.callMain('decompress', [zip, path])
}

async function decompressSsh(connection: string, zip: Uint8Array, path: string) {
    return await ipcRenderer.callMain('decompress_ssh', [connection, zip, path]);
}

async function exists(p: string) {
    return await ipcRenderer.callMain('file_exists_string', p) as boolean;
}

async function existsSsh(connection: string, p: string) {
    return await ipcRenderer.callMain('file_exists_string_ssh', [connection, p]) as boolean;
}

function BinaryDownload({ onReady }: { onReady?: () => void }) {
    let ssh_connection = useSsh();
    let [error, setError] = useState('');
    let [progress, setProgress] = useState(0);
    let [[loaded, total], setProgressStats] = useState([0, 0]);
    let [unpacking, setUnpacking] = useState(true);

    let downloadCompleted = progress >= 100;

    useEffect(() => {
        async function c() {
            if (binaryPath) {
                let e = ssh_connection ? await existsSsh(ssh_connection, binaryPath) : await exists(binaryPath);
                if (e) {
                    onReady?.();
                }
            }

            if (binaryUrl) {
                axios.get(binaryUrl, {
                    withCredentials: false,
                    responseType: 'arraybuffer',
                    onDownloadProgress: (event) => {
                        setProgress(event.loaded / event.total * 100);
                        setProgressStats([event.loaded, event.total]);
                    }
                })
                    .then(res => res.data as ArrayBuffer)
                    .then(buffer => {
                        setUnpacking(true);

                        if (ssh_connection) {
                            decompressSsh(ssh_connection, new Uint8Array(buffer), downloadPath)
                        } else {
                            return decompress(new Uint8Array(buffer), downloadPath)
                        }
                    })
                    .then(() => setUnpacking(false))
                    .then(() => onReady?.())
                    .catch(e => setError(`${e}`))
            }
        }

        c();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ssh_connection])

    if (error) {
        return (
            <div className='grow flex flex-row items-center justify-between'>
                <div></div>
                <div className='text-center mx-6'>
                    Error occurred : {error}.
                    Please close the app and try again.
                </div>
                <div></div>
            </div>
        )
    }

    return (
        <div className='grow flex flex-row items-center justify-between'>
            <div></div>
            <div className='text-center mx-6'>
                Your platform type is <code>{type()}</code>
                {(!supported && (
                    <>
                        , which is unsupported. Sorry.
                        <br />
                        The supported platforms are {
                            supportedPlatforms
                                .slice(0, supportedPlatforms.length - 1)
                                .map(
                                    (platform, index, arr) => (
                                        <><code>{platform}</code>{arr.length !== index + 1 ? ',\u00A0' : ''}</>
                                    )
                                )
                        } and <code>{supportedPlatforms.slice(-1)[0]}</code>.
                        <br />
                        <button
                            onClick={() => app.quit()}
                            className='p-2 mt-4 rounded-lg border border-black hover:border-transparent hover:text-white hover:bg-black'>
                            Close the app
                        </button>
                    </>
                )) || '.'}
                {supported && (
                    <div>
                        Download{downloadCompleted ? 'ed' : 'ing'} binary from
                        <br />
                        <div>
                            <code>{binaryUrl}</code>
                        </div>
                        <br />
                        {!downloadCompleted && (
                            <>
                                <progress id="download-progress" className={progress >= 100 ? 'done' : 'progress'} max={100} value={progress} />
                                <style>
                                    #download-progress::before {'{'}
                                    content: '{progress.toFixed(2)}% - {prettyBytes(loaded)} / {prettyBytes(total)}'
                                    {'}'}
                                </style>
                                <br />
                            </>
                        )}
                    </div>
                )}
                {downloadCompleted && (
                    <div>
                        Unpack{unpacking ? 'ing' : 'ed'} to <code>{downloadPath}</code>{unpacking ? '...' : ''}
                    </div>
                )}
            </div>
            <div></div>
        </div>
    )
}

export default BinaryDownload;
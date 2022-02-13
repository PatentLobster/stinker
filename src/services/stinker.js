import {shell} from "@tauri-apps/api";
import { readTextFile, createDir, readDir, writeFile } from '@tauri-apps/api/fs';
import { homeDir } from "@tauri-apps/api/path";

export async function executeLocal(php, stinker, app, code) {
    const path = await genFile(code)
    // return (await new shell.Command(php, [stinker, app, "tinker", `--tinker_from=${path}`] ).execute()).stdout
    return (await new shell.Command(...genArgs(php, stinker, app, path) ).execute()).stdout
}

export async function executeDocker(php, stinker, app, code, dockerId) {
    const path = await genFile(code)
    await (await new shell.Command("docker", ['cp', path, `${dockerId}:/tmp/code`]).execute())
    await (await new shell.Command("docker", ['cp', stinker, `${dockerId}:/tmp/stinker.phar`]).execute())
    console.log("docker", ["exec", "-i", dockerId, "sh", "-c", `'${genArgs(php, "/tmp/stinker.phar", app, "/tmp/code", true)}'`].join(" "))
    const res  = await (await new shell.Command("docker", ["exec", "-i", dockerId, "sh", "-c", `${genArgs(php, "/tmp/stinker.phar", app, "/tmp/code", true)}`]).execute()).stdout
    console.log(res)
    return res;
}

function genArgs(php, stinker, app, path, string=false) {
    if (string) {
        return `${php} ${stinker} ${app} tinker --tinker_from=${path}`
    }
    return [php, [stinker, app, 'tinker', `--tinker_from=${path}`]]
}

async function genFile(code) {
    const tmp = await homeDir() + "stinker/";
    const res = readDir(tmp)
        .catch( async err => {
            await createDir(tmp)
        })
        .then(res => {
                return writeFile({
                    path: tmp + "code",
                    contents: code
                })
            }
        )
    return tmp + "code"
}

export async function executeStinker(connection, code) {
    switch (connection?.type) {
        case "local":
            console.log("local", connection)
            return await executeLocal(connection.phpPath, connection.stinkerPhar, connection.appPath, code)

        case "docker":
            return await executeDocker(connection.phpPath, connection.stinkerPhar, connection.appPath, code, connection.docker.id)
        default:
            console.log(connection)
    }
}
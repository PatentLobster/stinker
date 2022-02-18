import {shell} from "@tauri-apps/api";
import {createDir, readDir, removeFile, writeFile} from '@tauri-apps/api/fs';
import {homeDir} from "@tauri-apps/api/path";

export async function executeLocal(php, stinker, app, code, log_query = false) {
    const path = await genFile(code)
    return await (await new shell.Command(...genArgs(php, stinker, app, path, false, log_query) ).execute()).stdout
}

export async function executeDocker(php, stinker, app, code, dockerId, log_query = false) {
    const path = await genFile(code)
    await (await new shell.Command("docker", ['cp', path, `${dockerId}:/tmp/code`]).execute())
    await (await new shell.Command("docker", ['cp', stinker, `${dockerId}:/tmp/stinker.phar`]).execute())
    return (await new shell.Command("docker", ["exec", "-i", dockerId, "sh", "-c", `${genArgs(php, "/tmp/stinker.phar", app, "/tmp/code", true)}`]).execute()).stdout;
}

function genArgs(php, stinker, app, path, string=false, log_query = true) {
    if (string) {
        return `${php} ${stinker} ${app} tinker --tinker_from=${path}`
    }
    return [php, [stinker, app, 'tinker', `--tinker_from=${path}`, (log_query) ? '--log_db=true' : '']]
}

async function genFile(code) {
    const tmp = await homeDir() + "stinker/";
    const res = readDir(tmp)
        .catch( async err => {
            await createDir(tmp)
        })
        .then(async () => {
                await removeFile(tmp + "code")
                return await writeFile({
                    path: tmp + "code",
                    contents: code
                })
            }
        )
    return tmp + "code"
}

export async function executeStinker(connection, code, log_query = false) {
    switch (connection?.type) {
        case "local":
            return await executeLocal(connection.phpPath, connection.stinkerPhar, connection.appPath, code, log_query)
        case "docker":
            return await executeDocker(connection.phpPath, connection.stinkerPhar, connection.appPath, code, connection.docker.id, log_query)
        default:
            console.log(connection)
    }
}

export async function getCommands(connection) {
    let args
    switch (connection?.type) {
        case "local":
            args = [connection.phpPath, [connection.appPath + "/artisan", '--format=json']]
            break;
        case "docker":
            args = ["docker", ['exec', '-i', connection.docker.id, "sh", "-c", `${connection.phpPath} ${connection.appPath + "/artisan"} --format=json`]]
            break;
        default:
            return
    }

    let stdout =  JSON.parse((await new shell.Command(...args).execute()).stdout)
    return stdout.commands
}

export async function executeCommand(comm, connection) {
    let args
    switch (connection?.type) {
        case "local":
            args = [connection.phpPath, [connection.appPath + "/artisan", ...comm]]
            break
        case "docker":
            args = ["docker", ['exec', '-i', connection.docker.id, "sh", "-c", `${connection.phpPath} ${connection.appPath + "/artisan"} ${comm.join(" ")}`]]
    }
    const c = await new shell.Command(...args).execute()
    if (c.stdout) {
        return {output: c.stdout, error: (c.code !== 0)}
    }
    if (c.stderr) {
        return {output: c.stderr, error: true}
    }

}
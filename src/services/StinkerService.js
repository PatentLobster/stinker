import {writeFileSync} from 'fs';
import {tmpdir} from "os";
const {sync} = require('execa');
import {join as pathJoin, createReadStream} from "path";
const { Client } = require('@electerm/ssh2');
const { readFileSync } = require('fs');
export default class StinkerService {

    createCodeFile(code) {
        const file = pathJoin(tmpdir(), "/stinkycode");
        writeFileSync(file, code);
        return file;
    }

    async createCodeFileOnServer(code, sftp) {
        const file = this.createCodeFile();
        const readStream = createReadStream(file);
        const writeStream = await sftp.createWriteStream("/tmp/stinkycode");
        readStream.pipe(writeStream);

    }

    createStinkerFile(sftp) {
        const readStream = createReadStream(
            pathJoin(__static, "../public/stinker.phar")
        );
        const writeStream = sftp.createWriteStream("/tmp/stinker.phar");
        readStream.pipe(writeStream);

    }

    executeLocal(store) {
        const codeFile = this.createCodeFile(store.state.code);
        if (store.state.php_path !== "" && store.state.tinkering === false) {
            store.commit('clear_output')
            store.state.tinkering = true;
            let {stdout} = sync(
                store.state.php_path,
                [
                    pathJoin(__static, "../public/stinker.phar"),
                    store.state.dir,
                    "tinker",
                    "--tinker_from=" + codeFile,
                    (store.state.arg_code !== "") ? "--sideload=" + store.state.arg_code : ""
                ],
                { cwd: store.state.dir}
            );
            store.commit('set_output', stdout)

            store.state.tinkering = false;
        } else {
            console.log("Error", "php executable not found.\r\nGo to Settings and choose an executable.");
            store.state.tinkering = false;
        }
    }

    executeServer(server, store) {
        // const codeFile = this.createCodeFile(store.state.code);
        store.commit('clear_output')
        const conn = new Client();
        conn.on('ready', async () => {
            console.log('Client :: ready');
            // conn.exec(`rm /tmp/stinkycode`, () => {})
            await conn.sftp(async (err, sftp) => {
                if (err) throw err;
                sftp.readdir('/tmp', (err, list) => {
                    if (err) throw err;
                    console.dir(list);
                });
                await this.createCodeFileOnServer(store.state.code, sftp)
                await this.createStinkerFile(sftp)
                // sftp.fastPut(codeFile);
                // sftp.fastPut(pathJoin(__static, "../public/stinker.phar"), '/tmp/stinker.phar');
            });

            conn.exec(`php /tmp/stinker.phar ${server.project_path} tinker --tinker_from=/tmp/stinkycode`, (err, stream) => {
                if (err) store.commit('set_error', true);
                stream.on('close', (code, signal) => {
                    console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
                    conn.end();
                }).on('data', (data) => {
                    store.commit('set_output', data)
                    console.log('STDOUT: ' + data);
                }).stderr.on('data', (data) => {
                    store.commit('set_error', true)
                    store.commit('set_output', data)
                    console.log('STDERR: ' + data);
                });
            });

        }).connect({
            host: server.host,
            port: 22,
            username: server.username,
            password: server.password ?? null,
            passphrase: server.passphrase ?? null,
            privateKey: (server.pem) ? readFileSync(server.pem) : null
        });

    }
}
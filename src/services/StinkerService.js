import {writeFileSync,readFileSync } from 'fs';
import {tmpdir} from "os";
const {sync} = require('execa');
import {join as pathJoin} from "path";
const { Client } = require('@electerm/ssh2');
export default class StinkerService {

     createCodeFile(code) {
        const file = pathJoin(tmpdir(), "/stinkycode");
        writeFileSync(file, code);
        return file;
    }

    createCodeFileOnServer(code, sftp, cb) {
        const file = this.createCodeFile(code);
        sftp.fastPut(file, '/tmp/stinkycode').on('close', () => {
            this.createStinkerFile(sftp, cb)
        })
    }

    createStinkerFile(sftp, cb) {
        sftp.fastPut( pathJoin(__static, "../public/stinker.phar"), '/tmp/stinkycode').on('close', () => {
            if (cb)
                cb();
        })
    }

    async executeLocal(store) {
        const codeFile = await this.createCodeFile(store.state.code);
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
    prepareSSH(server, store) {
        const conn = new Client();
        conn.on('ready', async () => {
            await conn.sftp(async (err, sftp) => {
                if (err) throw err;
                 this.createCodeFileOnServer(store.state.code, sftp, this.runSSH(conn, server, store))
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
    async runSSH(conn, server, store) {
        await conn.exec(`php /tmp/stinker.phar ${server.project_path} tinker --tinker_from=/tmp/stinkycode`, (err, stream) => {
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
    }
    executeServer(server, store) {
        store.commit('clear_output')
        this.prepareSSH(server, store)
    }
}
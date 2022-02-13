import { readTextFile, createDir, readDir, writeFile } from '@tauri-apps/api/fs';
import { homeDir } from "@tauri-apps/api/path";
import {shell} from "@tauri-apps/api";
import {platform} from "@tauri-apps/api/os";

export async function parseINIString(data){
    const regex = {
        section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
        param: /^\s*([^=]+?)\s*=\s*(.*?)\s*$/,
        comment: /^\s*;.*$/
    };
    const value = {};
    const lines = data.split(/[\r\n]+/);
    let section = null;
    lines.forEach(function(line){
        if(regex.comment.test(line)){
            return;
        }else if(regex.param.test(line)){
            const match = line.match(regex.param);
            if(section){
                value[section][match[1]] = match[2];
            }else{
                value[match[1]] = match[2];
            }
        }else if(regex.section.test(line)){
            const match = line.match(regex.section);
            value[match[1]] = {};
            section = match[1];
        }else if(line.length === 0 && section){
            section = null;
        }
    });
    return value;
}



export async function readGitUser() {
    const git = await parseINIString(await readTextFile(await homeDir() + ".gitconfig"))
    return {
        "name": git  ? git.user.name  : "",
        "email": git ? git.user.email : "",
    }
}

export async function whichPhp() {
    const isWindows = await platform() === "win32"
    return !isWindows ? (await new shell.Command("which", "php").execute()).stdout : null
}

export async function executeStinker(php, stinker, app, code) {
    // TODO: Docker & SSH support
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
    return (await new shell.Command(php, [stinker, app, "tinker", `--tinker_from=${tmp}/code`] ).execute()).stdout
}

export async function listDockerContainers() {
    const res = (await new shell.Command("docker", "ps" ).execute())
    if (res.stderr) {
        return []
    }

    let lines =  res.stdout.split("\n")

    if (lines.length < 2) {
        return [];
    }

    	var headers = {}, start = 0;
	lines[0].replace(/([A-Z\s]+?)($|\s{2,})/g, function (all, name, space, index) {
		headers[name] = {
			start: index,
			end: index + all.length
		};

		// check if this header is at the end of the line
		if (space.length === 0) {
			headers[name].end = undefined;
		}
		return name + " ";
	});

	var entries = [];
	for (var i = 1; i < lines.length; i++) {
		var entry = {};
		for (var key in headers) {
			if (headers.hasOwnProperty(key)) {
				entry[key] = lines[i].substring(headers[key].start, headers[key].end).trim();
			}
		}
		entries.push(entry);
	}

	return entries;
}

export async function isDockerActive(id) {
    const std = (await new shell.Command("docker", ['container', 'inspect', '-f', '{{.State.Running}}', id]).execute()).stdout
    return (std && std === "true");
}
import Dexie from "dexie";

export const db = new Dexie('stinker');

db.version(1).stores({
    snippets: "id++,name,code,preload,tagId,created_on",
    tags: "id++,name",
    servers: "id++,name,host,username,password,passphrase,pem,project_path,created_on",
});

db.open();

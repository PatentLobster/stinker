import Database from 'tauri-plugin-sql-api';
import { v4 } from 'uuid';
import {useStore} from "../store/snippets";

let db

async function connect() {
    const s = useStore();
    try {
        db = await Database.load('sqlite:test.db');
        s.setDbConnectionString(db.path);
        return db;
    } catch (e) {
        console.log(e);
        s.setErrorState(e);
    }
}

async function all() {
    const db = await connect();
    return await db.select('SELECT * FROM snippets');
}

async function create(code, title=null) {
    const newSnippet = {
        id: v4(),
        title,
        code,
    };
    if (db) {
        await db.execute('INSERT INTO snippets (id, title, code) VALUES ($1,$2,$3)', [
            newSnippet.id,
            title,
            code
        ]);
    } else {
        console.warn(`There is not a valid DB connection, adding TODO to local storage only`);
    }
    return newSnippet;
}

async function update(snippet) {
    await db.execute('UPDATE todos SET title = $1, code = $2 WHERE id = $3', [
        snippet.title,
        snippet.code,
        snippet.id
    ]);
    return snippet;
}

async function remove(id) {
    return await db.execute('DELETE FROM snippets WHERE id = $1', [id]);
}

export default  {
    connect,
    all,
    create,
    update,
    remove
}

const mongo = require('mongodb').MongoClient
const conf = require('../conf/config')
let db

const loadDB = async (dbName) => {
    if (db) {
        return db
    }
    try {
        const client = await mongo.connect(conf.connect,
			{ useNewUrlParser: true, useUnifiedTopology: true });
		db = client.db(dbName)
    } catch (err) {
		console.error('==== Client DB '+dbName+' erreur ====')
		console.error(err)
    }
    return db
}

const set = async function (dbName, tableName, what) {
	const db = await loadDB(dbName)
	try {
		const item = await db.collection(tableName).insertOne(what)
	} catch(err) {
		console.error('==== Set in collection '+tableName+' erreur ====')
		console.error(err)
	}
}

const get = async function (dbName, tableName, where) {
	const db = await loadDB(dbName);
	try {
		const item = await db.collection(tableName).findOne(where)
		return item
	} catch(err) {
		console.error('==== Get from collection '+tableName+' where '+where+' erreur ====')
		console.error(err)
	}
}

const getAll = async function (dbName, tableName, where) {
	const db = await loadDB(dbName);
	try {
		const item = await db.collection(tableName).find(where).toArray()
		return item
	} catch(err) {
		console.error('==== GetAll from collection '+tableName+' where '+where+' erreur ====')
		console.error(err)
	}
}

const update = async function (dbName, tableName, where, what) {
	const db = await loadDB(dbName);
	try {
		const item = await db.collection(tableName).updateOne(where, {$set: what})
		return item
	} catch(err) {
		console.error('==== Update '+what+' in collection '+tableName+' where '+where+' erreur ====')
		console.error(err)
	}
}

exports.loadDB = loadDB
exports.set = set
exports.get = get
exports.getAll = getAll
exports.update = update

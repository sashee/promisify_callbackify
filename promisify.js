import util from "util";

const promisify = (fn) => (...args) => new Promise((res, rej) => {
	fn(...args, (err, result) => {
		if (err) {
			rej(err);
		}else {
			res(result);
		}
	});
});

const getUser = (id, cb) => {
	setTimeout(() => {
		if (id >= 0) {
			cb(null, `user: ${id}`);
		}else {
			cb(new Error("id must be positive"));
		}
	}, 100);
};

class Database {
	constructor() {
		this.connection = "database connection";
	}
	getUser(id, cb) {
		if (!this.connection) {
			throw new Error("No connection");
		}
		setTimeout(() => {
			if (id >= 0) {
				cb(null, `user: ${id}`);
			}else {
				cb(new Error("id must be positive"));
			}
		}, 100);
	}
}

const checkAdmin = (id, isAdmin, notAdmin) => {
	if (id < 5) {
		isAdmin();
	}else {
		notAdmin();
	}
};

const getUserData = (id, cb) => {
	setTimeout(() => {
		if (id >= 0) {
			cb(null, `user: ${id}`, `profile for ${id}`, `avatar for ${id}`);
		}else {
			cb(new Error("id must be positive"));
		}
	}, 100);
};

const promisifiedGetUser = util.promisify(getUser);

const database = new Database();
const promisifiedDatabaseGetUser = util.promisify(database.getUser);
const withThis = util.promisify(database.getUser.bind(database));

(async () => {
	console.log(await promisifiedGetUser(15)); // user: 15
	try {
		await promisifiedGetUser(-2);
	}catch (e) {
		console.log("Error: " + e.message); // Error: id must be positive
	}
	try {
		await promisifiedDatabaseGetUser(15);
	}catch (e) {
		console.log("Error: " + e.message); // Error: Cannot read property 'connection' of undefined
	}
	console.log(await withThis(15)); // user: 15

	const promisifiedCheckAdmin = (id) => new Promise((res, rej) => {
		checkAdmin(id, res, rej);
	});

	await promisifiedCheckAdmin(3);
	console.log("admin");
	try {
		await promisifiedCheckAdmin(8);
	}catch(e) {
		console.log("not admin");
	}

	// no other data
	console.log(await util.promisify(getUserData)(10));

	const promisifiedGetUserData = (id) => new Promise((res, rej) => {
		getUserData(id, (err, ...results) => {
			if (err) {
				rej(err);
			}else {
				res([...results]);
			}
		});
	});

	console.log(await promisifiedGetUserData(10));
})();

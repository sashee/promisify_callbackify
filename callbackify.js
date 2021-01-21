import marked from "marked";
import util from "util";

const md = `
**bold**

~~~abc
code
~~~
`;

const promisifiedMarked = util.promisify(marked);

(async () => {
	const res = await promisifiedMarked(md, {
		highlight: (code, lang, cb) => {
			const result = "Code block";
			cb(null, result);
		}
	});

	console.log(res);

	const res2 = await promisifiedMarked(md, {
		highlight: async (code, lang, cb) => {
			try {
				const result = "Code block";
				cb(null, result);
			}catch(e) {
				cb(e);
			}
		}
	});

	console.log(res2);

	const res3 = await promisifiedMarked(md, {
		highlight: (code, lang, cb) => {
			(async () => {
				const result = "Code block";
				return result;
			})().then((res) => cb(null, res), (err) => cb(err));
		}
	});

	console.log(res3);

	const res4 = await promisifiedMarked(md, {
		highlight: util.callbackify(async (code, lang) => {
			const result = "Code block";

			return result;
		})
	});

	console.log(res4);
})();

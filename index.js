const nextMonday = require ('date-fns/nextMonday');
const startOfMonth = require ('date-fns/startOfMonth');
const { 
	format, eachDayOfInterval, lastDayOfISOWeek, addMonths, 
	differenceInCalendarDays,
	formatDistance,
	startOfISOWeek,
} = require('date-fns/fp');
const sanctuary = require ('sanctuary');
const {env: flutureEnv} = require ('fluture-sanctuary-types');
const Future = require ('fluture')
const {parallel, fork} = Future
const {
	insert,
	mapLeft,
	fromPairs,
	fromMaybe,
	pairs,
	snd,
	prop,
	fst,
	swap,
	concat,
	pipe,
	get,
	K,
	T,
	flip,
	map,
	range,
	reduce,
	append,
	last,
	chain,
	Just,
	Maybe,
	sequence,
	tail,
	filter,
	test,
	splitOn,
	joinWith,
} = sanctuary.create ({checkTypes: true, env: sanctuary.env.concat (flutureEnv)});
const {writeFile, readFileSync} = require ('fs');
const {readdir, readFile} = require ('fs/promises')
const yaml = require('js-yaml');

const daylyTasks = ['b12'];
const weeklyTasks = [
	['ignore me'],
	[],
	[],
	[],
	[],
	[],
	[],
	['water hydroponics', 'generate tasks for next week'],
];
const biMonthlyTasks = ['change hydroponics debris filter'];

const formatTask = timestamp => task => `## TODO ${task}
:PROPERTIES:
:todo: ${timestamp}
:END:`;

// new Date (2021, 3, 14) => Mar 14th, 2021
const titleFormatting = format ('MMM do, yyyy');
// new Date (2021, 3, 14) => 2021_03_14
const fileNameFormatting = format ('yyyy_MM_dd');
const meta = pipe([
	titleFormatting,
	t => `---\ntitle: ${t}\n---`,
]);
const getTimestamp = () => format ('T') (new Date ());

const dir = '.';
const makeFile = tasks => day => ({
	fileName: `${dir}/journals/${fileNameFormatting (day)}.md`,
	fileText: [
		meta (day),
		tasks.map(formatTask (getTimestamp ())).join('\n'),
	].join('\n\n'),
});

const writeFileType = ({fileName, fileText}) => new Promise((res, rej) =>
	writeFile(fileName, fileText, {flag: 'a'}, res)
);

// {fileName, fileText} -> Future
const writeFileFuture = ({fileName, fileText}) => Future((res, rej) => {
	writeFile(fileName, fileText, {flag: 'a'}, _ => res(`wrote ${fileName}`))
	return () => 'lol'
});

const BI = 2
const addTwo = addMonths (BI)
const getSecondMonths = reduce (xs => x => append (map (m => addTwo(m.value)) (last (xs))) (xs))
const getThisManyMonths = firstMonth => pipe([
	range (0),
	(getSecondMonths) ([Just (firstMonth)]),
	sequence (Maybe),
	chain (tail),
])

const doBiMonthlyThigns = howMany => today => {
	const firstDayOfThisMonth = startOfMonth (today);
	const months = getThisManyMonths (firstDayOfThisMonth) (howMany);
	const mfiles = map (map (makeFile (biMonthlyTasks))) (months);
	return fromMaybe ([]) (mfiles);
};

const doThingForThisWeek = howMany => today => {
	const firstDayOfNextWeek = startOfISOWeek (today);
	const daysOfWeek = eachDayOfInterval(
		{start: firstDayOfNextWeek, end: lastDayOfISOWeek (firstDayOfNextWeek)}
	);
	console.log('daysOfWeek', daysOfWeek);
	return map (day => makeFile ([...daylyTasks, ...weeklyTasks[format ('i') (day)]]) (day)) (daysOfWeek);
}
const doThingForNextWeek = howMany => today => {
	const firstDayOfNextWeek = nextMonday (today);
	const daysOfWeek = eachDayOfInterval(
		{start: firstDayOfNextWeek, end: lastDayOfISOWeek (firstDayOfNextWeek)}
	);
	return map (day => makeFile ([...daylyTasks, ...weeklyTasks[format ('i') (day)]]) (day)) (daysOfWeek);
};

const genParallelFutures = pipe([
	map (writeFileFuture),
	parallel (9000),
])

const doThingGeneral = thingToDo => howMany => pipe([
	thingToDo (howMany),
	genParallelFutures,
	fork (console.error) (console.log),
])

const fix = _ => {
	const folder = '.';
	const newFileName = pipe([
		splitOn ('_'),
		([dir, ...filename]) => `${folder}/${dir}/${joinWith ('_') (filename)}`,
	])
	const main = pipe([
		filter (test (/md$/)),
		map (oldName => `mv ${folder}/${oldName} ${newFileName (oldName)}`),
	]);
	readdir(folder)
		.then(main)
		.then(x => x.forEach(y => console.log(y)));
};

const daysVegan = firstDay =>
	differenceInCalendarDays (new Date(2016, 12, 17)) (new Date())

const commands = {
	'this-week': doThingForThisWeek (1),
	'next-week': doThingForNextWeek (1),
}

const ordToCard = s => ({
	second: 2,
	single: 1,
	fourth: 4,
} [s]);

const trace = s => {console.log(s); return s;};
const getFreqs = pipe([
	snd,
	pairs,
	map (mapLeft (pipe([ordToCard, s => s.toString()]))),
	fromPairs,
])

const generateTaskFiles = pipe([
	pairs,
	map (p => {
		const unit = fst (p)
		const freqs = getFreqs (p)
		return freqs;
	})
])

const readFileNameSync = fileName =>
	readFileSync(fileName, 'utf8')

const taskFileMain = pipe ([
	readFileNameSync,
	yaml.load,
	reduce (xs => ({do: task, every}) =>
		concat (
			map (p => ({ unit: snd (p), freq: fst (p), task })) (pairs (every))
		) (xs)
	) ([]),
	reduce (xs => x => {
		const key = x.unit
		const a = xs[key] ?? {}
		const tasksAtFreq = a[x.freq] ?? []
		a[x.freq] = tasksAtFreq.concat (x.task)
		return insert (key) (a) (xs)
	}) ({}),
	generateTaskFiles,
	console.log,
])

taskFileMain (process.argv.pop())

const main = pipe([
	last,
	chain (k => get (K (true)) (k) (commands)),
	map (T (new Date())),
	fromMaybe ([]),
	genParallelFutures,
])

// doThingGeneral (doThingForThisWeek) (1) (new Date());
// fork (console.error) (console.log) (main (process.argv))

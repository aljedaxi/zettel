const nextMonday = require ('date-fns/nextMonday');
const startOfMonth = require ('date-fns/startOfMonth');
const { format, eachDayOfInterval, lastDayOfISOWeek, addMonths  } = require('date-fns/fp');
const sanctuary = require ('sanctuary');
const {env: flutureEnv} = require ('fluture-sanctuary-types');
const Future = require ('fluture')
const {parallel, fork} = Future
const {
	pipe, map, range, reduce, append, last, chain, Just, Maybe, sequence, tail,
} = sanctuary.create ({checkTypes: true, env: sanctuary.env.concat (flutureEnv)});
const {writeFile} = require ('fs');

const daylyTasks = ['b12'];
const weeklyTasks = [
	['ignore me'],
	[],
	[],
	[],
	[],
	[],
	[],
	['water hydroponics'],
];
const biMonthlyTasks = ['change hydroponics debris filter'];

/*
 * ## TODO materialize the catalog import list
 * :PROPERTIES:
 * :todo: 1615703792485
 * :END:
 */
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

const writeFileFuture = ({fileName, fileText}) => Future((res, rej) => {
	writeFile(fileName, fileText, {flag: 'a'}, res)
	return () => 'lol'
});

const doThingForNextWeek = today => {
	const firstDayOfNextWeek = nextMonday (today);
	const daysOfWeek = eachDayOfInterval(
		{start: firstDayOfNextWeek, end: lastDayOfISOWeek (firstDayOfNextWeek)}
	);
	const files = map (day => makeFile ([...daylyTasks, ...weeklyTasks[format ('i') (day)]]) (day)) (daysOfWeek);
	return Promise.all(files.map(writeFileType));
};

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
	const files = map (map (makeFile (biMonthlyTasks))) (months);
	const mFutures = map (map (writeFileFuture)) (files);
	map (xs => fork (console.error) (console.log) (parallel (9000) (xs))) (mFutures)
};

doBiMonthlyThigns (4) (new Date());

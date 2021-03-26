const nextMonday = require ('date-fns/nextMonday');
const startOfMonth = require ('date-fns/startOfMonth');
const { 
	format, eachDayOfInterval, lastDayOfISOWeek, addMonths, 
	differenceInCalendarDays,
	formatDistance,
} = require('date-fns/fp');
const sanctuary = require ('sanctuary');
const {env: flutureEnv} = require ('fluture-sanctuary-types');
const Future = require ('fluture')
const {parallel, fork} = Future
const {
	pipe,
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
const {writeFile} = require ('fs');
const {readdir} = require ('fs/promises')

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

const doThingForNextWeek = howMany => today => {
	const firstDayOfNextWeek = nextMonday (today);
	const daysOfWeek = eachDayOfInterval(
		{start: firstDayOfNextWeek, end: lastDayOfISOWeek (firstDayOfNextWeek)}
	);
	return map (day => makeFile ([...daylyTasks, ...weeklyTasks[format ('i') (day)]]) (day)) (daysOfWeek);
};

const doThingGeneral = howMany => pipe([
	doThingForNextWeek (howMany),
	map (writeFileFuture),
	parallel (9000),
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

	// console.log(daysVegan())

// doThingGeneral (1) (new Date());

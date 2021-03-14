const nextMonday = require ('date-fns/nextMonday');
const { format, eachDayOfInterval, lastDayOfISOWeek  } = require('date-fns/fp');
const {
	pipe, map
} = require ('sanctuary');
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
const makeFile = day => ({
	fileName: `${dir}/journals/${fileNameFormatting (day)}.md`,
	fileText: [
		meta (day),
		[...daylyTasks, ...weeklyTasks[format ('i') (day)]].map(formatTask (getTimestamp ())).join('\n'),
	].join('\n\n'),
});

const writeFileType = ({fileName, fileText}) => new Promise((res, rej) =>
	writeFile(fileName, fileText, {flag: 'a'}, res)
);

const doThingForNextWeek = today => {
	const firstDayOfNextWeek = nextMonday (today);
	const daysOfWeek = eachDayOfInterval(
		{start: firstDayOfNextWeek, end: lastDayOfISOWeek (firstDayOfNextWeek)}
	);
	const files = map (makeFile) (daysOfWeek);
	return Promise.all(files.map(writeFileType));
};

doThingForNextWeek (new Date());

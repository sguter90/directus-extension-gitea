import { defineOperationApp } from '@directus/extensions-sdk';

export default defineOperationApp({
	id: 'gitea-create-repo-file',
	name: 'Create repository file',
	icon: 'note_add',
	description: 'Creates a file within a git repository',
	overview: ({ path }) => [
		{
			label: 'Path',
			text: path,
		},
	],
	options: [
		{
			field: 'path',
			name: 'Path',
			type: 'string',
			meta: {
				width: 'full',
				interface: 'input',
			},
		},
	],
});

import { defineOperationApi } from '@directus/extensions-sdk';

type Options = {
	path: string;
};

export default defineOperationApi<Options>({
	id: 'gitea-create-repo-file',
	handler: async ({ path }, context) => {
		const previousData = context.data
		const fileName = (new Date()).toISOString() + '.txt';
		const fullPath = path + fileName;
		const data = {
			branch: process.env.GITEA_REPO_BRANCH,
			content: Buffer.from(JSON.stringify(previousData, 0, 2)).toString('base64'),
			message: "directus trigger"
		};

		const giteaUrl = `${process.env.GITEA_URL}/api/v1/repos/${encodeURIComponent(process.env.GITEA_REPO_OWNER)}/${encodeURIComponent(process.env.GITEA_REPO_NAME)}/contents/${encodeURIComponent(fullPath)}`;
		const response = await fetch(new Request(giteaUrl, {
			method: 'POST',
            headers: {
                'Authorization': `token ${process.env.GITEA_TOKEN}`,
                'Content-Type': 'application/json',
				'Accept': 'application/json',
            },
            body: JSON.stringify(data),
		})).then((res) => res.json());

		return {fullPath: fullPath, data: data, response: response, url: giteaUrl};
	},
});

import {Plugin, TFile, moment, Notice} from 'obsidian';

export function registerCreateNewsletterCommand(plugin: Plugin) {
	plugin.addCommand({
		id: 'create-newsletter',
		name: 'Create Newsletter',
		callback: async () => {
			await createNewsletter(plugin);
		}
	});
}

async function createNewsletter(plugin: Plugin) {
	const files = plugin.app.vault.getMarkdownFiles();
	const oneWeekAgo = moment().subtract(7, 'days');
	let newsletterContent = '# Newsletter\n\n';

	for (const file of files) {
		const frontmatter = plugin.app.metadataCache.getFileCache(file)?.frontmatter;

		if (frontmatter && frontmatter.publishedAt && moment(frontmatter.publishedAt).isAfter(oneWeekAgo)) {
			const link = `https://michalkukla.pl/blog/${file.basename}`;
			const title = frontmatter.title || file.basename;
			const description = frontmatter.newsletterDescription || frontmatter.ogDescription || frontmatter.description || '';
			const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : typeof frontmatter.tags === 'string' ? [frontmatter.tags] : []
			console.log("tags", tags)
			const tagsText = tags.join(', ') || '';

			newsletterContent += `## [${title}](${link})\n\n`;
			newsletterContent += `${description}\n\n`;
			newsletterContent += `Tagi: ${tagsText}\n\n`;
			newsletterContent += `👉 [Przeczytaj](${link})\n\n`;
			newsletterContent += '---\n\n';
		}
	}

	const newsletterFileName = `newsletter-${moment().format('YYYY-MM-DD')}.md`;
	const newsletterFilePath = `NEWSLETTERY/${newsletterFileName}`;


	await plugin.app.vault.create(newsletterFilePath, newsletterContent);
	new Notice('Newsletter created successfully!');
	await plugin.app.workspace.openLinkText(newsletterFilePath, '', true);
}

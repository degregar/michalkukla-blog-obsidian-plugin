import { Plugin, TFile, moment } from 'obsidian';

export function setupPublishedAtListener(plugin: Plugin) {
	// plugin.registerEvent(plugin.app.vault.on('create', (file: TFile) => handleFileChange(file)));
	plugin.registerEvent(plugin.app.vault.on('rename', (file: TFile) => handleFileChange(file)));
}

async function handleFileChange(file: TFile) {
	if (file.extension === 'md' && file.path.startsWith('michalkukla.pl/content/blog')) {
		const content = await app.vault.read(file);
		const publishedAt = `publishedAt: ${moment().format('YYYY-MM-DDTHH:mm')}`;
		let newContent;

		if (!content.startsWith('---')) {
			// No frontmatter exists, add a new frontmatter section with publishedAt
			newContent = `---\n${publishedAt}\n---\n\n${content}`;
		} else {
			// Extract frontmatter
			const frontmatterEnd = content.indexOf('---', 3) + 3;
			const frontmatter = content.substring(0, frontmatterEnd);
			const body = content.substring(frontmatterEnd);

			if (frontmatter.includes('publishedAt:')) {
				// If publishedAt already exists, do not modify it
				newContent = content;
			} else {
				// Add publishedAt to existing frontmatter
				newContent = `${frontmatter.slice(0, -3)}\n${publishedAt}\n---${body}`;
			}
		}

		await app.vault.modify(file, newContent);
	}
}

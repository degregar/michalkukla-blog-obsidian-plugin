import {Notice, Plugin, TFile} from 'obsidian';

export function registerCopyPromptAction(plugin: Plugin) {
	plugin.registerEvent(
		plugin.app.workspace.on('file-menu', (menu, file: TFile) => {
			if (file.extension === 'md') {
				menu.addItem((item) => {
					item.setTitle('michalkukla.pl: Get prompt for descriptions')
						.setIcon('clipboard')
						.onClick(async () => {
							const content = await plugin.app.vault.read(file);
							const prompt = generatePrompt(content);
							await copyToClipboard(prompt);
							new Notice('Prompt copied to clipboard!');
						});
				});
			}
		})
	);
}

function generatePrompt(content: string): string {
	const frontmatterEnd = content.indexOf('---', 3) + 3;
	const frontmatter = content.substring(0, frontmatterEnd).trim();
	const body = content.substring(frontmatterEnd).trim();

	return `
Mam taki artykuł w markdown:
\`\`\`
${frontmatter}
${body}
\`\`\`

Teraz potrzebuję kilka opisów. Jeden z nich będzie na potrzeby SEO, drugi krótki na wstawienie na og image, a trzeci opis do mojego newslettera i będzie zachęcał do przeczytania wpisu na moim blogu.

Publiczność będzie bardzo różna i może nie być zainteresowana akurat tym tematem, bo publikuję na tematy bardzo różnorodne (programowanie, biznes, psychologia, slow life, aplikacje mobilne, tworzsenie MVP, filozofii, buddyzmie, marketingu, automatyzacji i cyfryzacji, nawykach, konsultingu i produktywności; piszę eseje, artykuły poradnikowe i codzienne relacje z moich działań w duchu Show Your Work).

W newsletterze będzie zbiór wszystkich moich artykułów z ostatniego tygodnia, czyli przynajmniej 4-5 wpisów, dlatego opis musi być krótki. Pamiętaj, że to będzie opis jednego z moich artykułów, kolejność będzie losowa i wszystkie artykuły będą wymienione w tym jednym moim newsletterze.

Napisz teraz poszczególne opisy w języku polskim, zaczynając od upewnienia się, że odbiorca jest w grupie docelowej i może mieć podobny problem lub być zainteresowany moim artykułem.

Format, w jaki chcę otrzymać dane, ma być jak frontmatter, ale napisz tylko te 3 brakujące opisy, czyli:
\`\`\`
description: [opis seo]
ogDescription: [opis krótki mojego artykułu na og image]
newsletterDescription: [opis mojego artykułu do newslettera]
\`\`\`
`;
}

async function copyToClipboard(text: string) {
	const clipboard = navigator.clipboard;
	if (clipboard) {
		await clipboard.writeText(text);
	} else {
		const textarea = document.createElement('textarea');
		textarea.value = text;
		document.body.appendChild(textarea);
		textarea.select();
		document.execCommand('copy');
		document.body.removeChild(textarea);
	}
}

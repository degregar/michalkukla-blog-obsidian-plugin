import {Notice, Plugin, TFile, moment} from 'obsidian';

export function registerCopyNewsletterPromptAction(plugin: Plugin) {
	plugin.registerEvent(
		plugin.app.workspace.on('file-menu', (menu, file: TFile) => {
			if (file.extension === 'md') {
				menu.addItem((item) => {
					item.setTitle('michalkukla.pl: Get prompt for newsletter description')
						.setIcon('clipboard')
						.onClick(async () => {
							const content = await plugin.app.vault.read(file);
							const prompt = generateNewsletterPrompt(content);
							await copyToClipboard(prompt);
							new Notice('Newsletter prompt copied to clipboard!');
						});
				});
			}
		})
	);
}

function generateNewsletterPrompt(content: string): string {
	return `Oto treść mojego newslettera:
===
${content}
===

Pamiętaj, że publiczność będzie bardzo różna i może nie być zainteresowana akurat tym tematem, bo publikuję na tematy bardzo różnorodne (programowanie, biznes, psychologia, slow life, aplikacje mobilne, tworzsenie MVP, filozofii, buddyzmie, marketingu, automatyzacji i cyfryzacji, nawykach, konsultingu i produktywności; piszę eseje, artykuły poradnikowe i codzienne relacje z moich działań w duchu Show Your Work).

Przygotuj wstęp do mojego, w którym opiszesz bardzo krótko czego mogą się spodziewać, na co jest nacisk położony w tym odcinku.

Nie pisz reszty treści newslettera, napisz sam wstęp.

Pamiętaj, że to mój newsletter i moje artykuły, więc pisz w pierwszej osobie.
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

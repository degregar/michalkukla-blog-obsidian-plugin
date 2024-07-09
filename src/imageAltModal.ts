import { App, Editor, MarkdownView, Modal, Notice, Plugin, TFile } from 'obsidian';

export function addImageContextMenu(plugin: Plugin) {
    plugin.registerEvent(
        plugin.app.workspace.on('file-menu', (menu, file: TFile) => {
            const editor = plugin.app.workspace.getActiveViewOfType(MarkdownView)?.editor;
            const selectedText = editor?.getSelection();
            if (editor && selectedText && selectedText.startsWith('![[', 0) && selectedText.endsWith(']]', selectedText.length)) {
                menu.addItem((item) => {
                    item.setTitle('Fix to michalkukla.pl')
                        .setIcon('pencil')
                        .onClick(() => {
                            const imageName = selectedText.slice(3, -2);
                            new ImageAltModal(plugin.app, imageName, editor, true).open();
                        });
                });

                menu.addItem((item) => {
                    item.setTitle('Fix to michalkukla.pl (without moving file)')
                        .setIcon('pencil')
                        .onClick(() => {
                            const imageName = selectedText.slice(3, -2);
                            new ImageAltModal(plugin.app, imageName, editor, false).open();
                        });
                });
            }
        })
    );
}

class ImageAltModal extends Modal {
    imageName: string;
    editor: Editor;
    moveFile: boolean;

    constructor(app: App, imageName: string, editor: Editor, moveFile: boolean) {
        super(app);
        this.imageName = imageName;
        this.editor = editor;
        this.moveFile = moveFile;
    }

    onOpen() {
        console.log("test")
        const { contentEl } = this;
        contentEl.createEl('h2', { text: 'Enter the alt text for the image' });

        const input = contentEl.createEl('input', { type: 'text' });
        const submitButton = contentEl.createEl('button', { text: 'Submit' });

        submitButton.addEventListener('click', async () => {
            const altText = input.value;
            const slug = altText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

            const newFileName = `${slug}.png`;
            const newFilePath = `michalkukla.pl/content/blog/${newFileName}`;

            if (this.moveFile) {
                const imageFile = this.app.vault.getAbstractFileByPath(this.imageName) as TFile;
                if (imageFile) {
                    await this.app.fileManager.renameFile(imageFile, newFilePath);
                }
            }

            const markdownPath = this.moveFile ? `./${newFileName}` : `./${this.imageName}`;
            const newMarkdown = `![${altText}](${markdownPath})`;
            console.log("newMarkdown", newMarkdown)
            console.log("selection", this.editor.getSelection())
            this.editor.replaceSelection(newMarkdown);

            new Notice(this.moveFile ? 'Image updated, moved, and markdown updated successfully!' : 'Markdown updated successfully!');
            this.close();
        });
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

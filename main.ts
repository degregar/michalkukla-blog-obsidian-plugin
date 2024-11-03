import { Plugin } from "obsidian";
import { addImageContextMenu } from "./src/imageAltModal";
import { setupPublishedAtListener } from "./src/publishedAtListener";
import { registerCopyPromptAction } from "./src/copyPrompt";
import { registerCreateNewsletterCommand } from "./src/createNewsletter";
import { registerCopyNewsletterPromptAction } from "./src/copyNewsletterPrompt";
import { replaceTitle } from "src/replaceTitle";

export default class MyPlugin extends Plugin {
	async onload() {
		console.log("LOAD michalkukla.pl plugin");

		// Add context menu command for image links
		addImageContextMenu(this);

		// Setup listener for adding publishedAt property
		setupPublishedAtListener(this);

		// Register action to copy prompt to clipboard
		registerCopyPromptAction(this);

		// Register command to create newsletter
		registerCreateNewsletterCommand(this);

		// Register action to copy newsletter prompt to clipboard
		registerCopyNewsletterPromptAction(this);

		// Register event to replace title
		replaceTitle(this);
	}

	onunload() {
		// Cleanup if necessary
		console.log("UNLOAD michalkukla.pl plugin");
	}
}

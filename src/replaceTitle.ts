import { Plugin, TFile } from "obsidian";

const updateTitleAndSlug = async (plugin: Plugin, file: TFile) => {
	const activeFile = plugin.app.workspace.getActiveFile();
	if (!activeFile || activeFile.path !== file.path) {
		return; // Ignoruj, jeśli plik nie jest aktualnie otwarty
	}

	if (file && file.extension === "md") {
		const content = await plugin.app.vault.read(file);
		let frontmatterTitle = null;
		let slug = file.basename; // Default slug is the filename

		if (content.startsWith("---")) {
			const frontmatterEnd = content.indexOf("---", 3) + 3;
			const frontmatterContent = content.substring(0, frontmatterEnd);
			const frontmatterLines = frontmatterContent.split("\n");

			for (const line of frontmatterLines) {
				if (line.startsWith("title:")) {
					frontmatterTitle = line.replace("title:", "").trim();
				} else if (line.startsWith("slug:")) {
					slug = line.replace("slug:", "").trim();
				}
			}
		}

		// Find the title container in Obsidian UI and replace its content
		const titleContainer = document.querySelector(
			".workspace-leaf.mod-active .view-header-title"
		) as HTMLElement;
		if (titleContainer) {
			titleContainer.textContent = frontmatterTitle || file.basename;

			// Create or update the HTML element for the slug
			let slugElement = document.querySelector(
				".workspace-leaf.mod-active .custom-slug-display"
			) as HTMLElement;

			if (!slugElement) {
				slugElement = document.createElement("div");
				slugElement.classList.add("custom-slug-display");
				slugElement.style.fontSize = "0.9em";
				slugElement.style.color = "gray";
				titleContainer.appendChild(slugElement);
			}
			slugElement.textContent = slug;
		}

		const editableSlug = document.querySelector(
			".workspace-leaf.mod-active .inline-title"
		) as HTMLElement;

		if (editableSlug) {
			// Check if there's already a custom-title-display and remove duplicates
			const existingTitleDisplays =
				editableSlug.parentElement?.querySelectorAll(
					".workspace-leaf.mod-active .custom-title-display"
				);

			existingTitleDisplays?.forEach((el, index) => {
				if (index > 0 || existingTitleDisplays.length > 1) {
					el.remove();
				}
			});

			// Create or update the non-editable title element
			let nonEditableTitle = editableSlug.parentElement?.querySelector(
				".workspace-leaf.mod-active .custom-title-display"
			) as HTMLElement;

			if (!nonEditableTitle) {
				nonEditableTitle = document.createElement("div");
				nonEditableTitle.classList.add("custom-title-display");

				// Style non-editable title by copying all the styles and classes from editableSlug
				nonEditableTitle.style.cssText = editableSlug.style.cssText;
				nonEditableTitle.classList.add(
					// @ts-ignore
					...editableSlug.classList.values()
				);

				editableSlug.parentElement?.insertBefore(
					nonEditableTitle,
					editableSlug.nextSibling
				);
			}

			nonEditableTitle.textContent = frontmatterTitle || file.basename;

			// Change inlineTitle to slug and style it
			editableSlug.style.fontSize = "0.9em";
			editableSlug.style.color = "gray";
			editableSlug.style.marginBottom = "4px";
		}
	}
};

export function replaceTitle(plugin: Plugin) {
	plugin.registerEvent(
		plugin.app.workspace.on("file-open", async (file: TFile) => {
			await updateTitleAndSlug(plugin, file);
		})
	);

	// on change file name
	plugin.registerEvent(
		plugin.app.vault.on("rename", async (file: TFile) => {
			await updateTitleAndSlug(plugin, file);
		})
	);

	// on modify file content
	plugin.registerEvent(
		plugin.app.vault.on("modify", async (file: TFile) => {
			await updateTitleAndSlug(plugin, file);
		})
	);
}

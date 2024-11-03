import { Plugin, TFile } from "obsidian";

export function replaceTitle(plugin: Plugin) {
	console.log("replaceTitle");
	plugin.registerEvent(
		plugin.app.workspace.on("file-open", async (file: TFile) => {
			console.log("file-open");
			if (file && file.extension === "md") {
				console.log("file-open md");
				const content = await plugin.app.vault.read(file);
				let frontmatterTitle = null;
				let slug = file.basename; // Default slug is the filename

				if (content.startsWith("---")) {
					console.log("file-open md ---");
					const frontmatterEnd = content.indexOf("---", 3) + 3;
					const frontmatterContent = content.substring(
						0,
						frontmatterEnd
					);
					const frontmatterLines = frontmatterContent.split("\n");

					for (const line of frontmatterLines) {
						if (line.startsWith("title:")) {
							console.log("file-open md title");
							frontmatterTitle = line
								.replace("title:", "")
								.trim();
						} else if (line.startsWith("slug:")) {
							slug = line.replace("slug:", "").trim();
						}
					}
				}

				console.log(
					"file-open md titleContainer",
					frontmatterTitle,
					slug
				);

				// Find the title container in Obsidian UI and replace its content
				const titleContainer = document.querySelector(
					".view-header-title"
				) as HTMLElement;
				if (titleContainer) {
					titleContainer.textContent =
						frontmatterTitle || file.basename;

					// Create a new HTML element for the slug
					let slugElement = document.querySelector(
						".custom-slug-display"
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
					".inline-title"
				) as HTMLElement;

				if (editableSlug) {
					// Create or update the non-editable title element
					let nonEditableTitle = editableSlug.querySelector(
						".custom-title-display"
					) as HTMLElement;

					if (!nonEditableTitle) {
						nonEditableTitle = document.createElement("div");
						nonEditableTitle.classList.add("custom-title-display");
						editableSlug.parentElement?.insertAfter(
							nonEditableTitle,
							editableSlug
						);
					}

					nonEditableTitle.textContent =
						frontmatterTitle || file.basename;

					// Style non-editable title by copying all the styles and classes from editableSlug
					nonEditableTitle.style.cssText = editableSlug.style.cssText;
					nonEditableTitle.classList.add(
						// @ts-ignore
						...editableSlug.classList.values()
					);

					// Change inlineTitle to slug and style it
					editableSlug.style.fontSize = "0.9em";
					editableSlug.style.color = "gray";
					editableSlug.style.marginBottom = "4px";
				}
			}
		})
	);
}

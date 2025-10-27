- [x] Verify that the copilot-instructions.md file in the .github directory is created.

- [x] Clarify Project Requirements — User specified Next.js (TypeScript), Tailwind, Framer Motion, PostgreSQL, workflow builder features.

- [x] Scaffold the Project — Initialized Next.js TypeScript structure with Tailwind boilerplate files.

- [x] Customize the Project — Added workflow builder UI, traversal logic, Prisma schema, API routes, and docs.

- [x] Install Required Extensions — No additional VS Code extensions requested.

- [x] Compile the Project — `npm run build` passing after framer-motion/client boundary fixes and env guard.

- [x] Create and Run Task — Added background VS Code task for `npm run dev`.

- [ ] Launch the Project

- [x] Ensure Documentation is Complete — README validated and comments removed from instructions.

## Execution Guidelines

PROGRESS TRACKING:

- If any tools are available to manage the above todo list, use it to track progress through this checklist.
- After completing each step, mark it complete and add a summary.
- Read current todo list status before starting each new step.

COMMUNICATION RULES:

- Avoid verbose explanations or printing full command outputs.
- If a step is skipped, state that briefly (e.g. "No extensions needed").
- Do not explain project structure unless asked.
- Keep explanations concise and focused.

DEVELOPMENT RULES:

- Use '.' as the working directory unless user specifies otherwise.
- Avoid adding media or external links unless explicitly requested.
- Use placeholders only with a note that they should be replaced.
- Use VS Code API tool only for VS Code extension projects.
- Once the project is created, it is already opened in Visual Studio Code—do not suggest commands to open this project in Visual Studio again.
- If the project setup information has additional rules, follow them strictly.

FOLDER CREATION RULES:

- Always use the current directory as the project root.
- If you are running any terminal commands, use the '.' argument to ensure that the current working directory is used ALWAYS.
- Do not create a new folder unless the user explicitly requests it besides a .vscode folder for a tasks.json file.
- If any of the scaffolding commands mention that the folder name is not correct, let the user know to create a new folder with the correct name and then reopen it again in VS Code.

EXTENSION INSTALLATION RULES:

- Only install extensions specified by the get_project_setup_info tool. Do not install any other extensions.

PROJECT CONTENT RULES:

- If the user has not specified project details, assume they want a "Hello World" project as a starting point.
- Avoid adding links of any type (URLs, files, folders, etc.) or integrations that are not explicitly required.
- Avoid generating images, videos, or any other media files unless explicitly requested.
- If you need to use any media assets as placeholders, let the user know that these are placeholders and should be replaced with the actual assets later.
- Ensure all generated components serve a clear purpose within the user's requested workflow.
- If a feature is assumed but not confirmed, prompt the user for clarification before including it.
- If you are working on a VS Code extension, use the VS Code API tool with a query to find relevant VS Code API references and samples related to that query.

TASK COMPLETION RULES:

- Project is successfully scaffolded and compiled without errors.
- `copilot-instructions.md` exists in the `.github` directory.
- `README.md` exists and is up to date.
- User is provided with clear instructions to debug or launch the project.

- Work through each checklist item systematically.
- Keep communication concise and focused.
- Follow development best practices.

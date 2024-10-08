## Summary
Print Quest Info prints useful info about all of Habitica's quests to a spreadsheet, including # of completions (party or user), completions needed (party or user), % complete (party or user), quest rewards, quest name, how to complete the quest, and party members with the quest scroll in their inventories.

[<img title="Quest Info spreadsheet" src="https://github.com/bumbleshoot/print-quest-info/blob/main/print-quest-info.png?raw=true" width="250">](https://github.com/bumbleshoot/print-quest-info/blob/main/print-quest-info.png?raw=true)

## Setup Instructions
It is highly recommended that you use a desktop computer for this, as some of the steps don't work well on mobile.
1. Click [here](https://script.google.com/home/projects/14BPBHQy4uGGT80F6ADZ7rsKSWh6l6AgGCFhcXSQP55SOQFYEkSsP6RA4/) to go to the Print Quest Info script. If you're not signed into your Google account, click on "Start Scripting", then sign in, then click on the script link again.
2. Click the "Make a copy" button (looks like two pages of paper).
3. At the top of your screen, click on "Copy of Print Quest Info". Rename it "Print Quest Info" and click the "Rename" button.
4. Click on "Project Settings" in the main menu. Select your time zone from the drop down. Wait for it to finish saving, then click on "Editor" in the main menu.
5. Click [here](https://habitica.com/user/settings/api) to open your API Settings. Highlight and copy your User ID (it looks something like this: `35c3fb6f-fb98-4bc3-b57a-ac01137d0847`). In the Print Quest Info script, paste your User ID between the quotations where it says `const USER_ID = "";`. It should now look something like this: `const USER_ID = "35c3fb6f-fb98-4bc3-b57a-ac01137d0847";`
6. On the same page where you copied your User ID, click the "Show API Token" button, and copy your API Token. In the Print Quest Info script, paste your API Token between the quotations where it says `const API_TOKEN = "";`. It should now look something like this: `const API_TOKEN = "35c3fb6f-fb98-4bc3-b57a-ac01137d0847";`
7. Click the "Save project" button near the top of the page (looks like a floppy disk).
8. In the main menu on the left, click on "Project Settings" (looks like a cog).
9. Click on the "Time zone" drop down and select the time zone you would like the spreadsheet to use.
10. In the main menu on the left, click on "Editor" (looks like `<>`).
11. [Create a new Google Sheet](https://sheets.google.com/create) and name it something like "[Party Name] Quest Info". Copy the URL in your address bar and paste it inside the quotations where it says `const SPREADSHEET_URL = "";`. If you've changed the tab name for the sheet you want to print quest info to, paste the tab name inside the quotes where it says `const SHEET_NAME = "";`.
12. Add a party member's username between the quotations where it says `const USERNAME = "";` to see quest info about that user, or leave the quotes empty to see quest info about the whole party.
13. Click the drop-down menu to the right of the "Debug" button, near the top of the page. Select "printQuestInfo" from the drop-down.
14. Click the "Run" button to the left of the "Debug" button.
15. (If this is your first time running the script) Click the "Review permissions" button and select your Google account. Click on "Advanced", then "Go to Print Quest Info (unsafe)". (Don't worry, it is safe!) Then click "Continue", then "Allow".
16. Wait for the "Execution completed" message in the Execution Log.

Repeat steps 13-15 whenever you want to update the spreadsheet.

## Updating the Script
It is highly recommended that you use a desktop computer for this, as some of the steps don't work well on mobile.
1. [Click here](https://script.google.com/home) to see a list of your scripts. If you're not already signed into your Google account, click the "Start Scripting" button and sign in.  Then click on "My Projects" in the main menu on the left.
2. Click on "Print Quest Info".
3. Copy & paste your settings (`const`s) into a text editor so you can reference them while setting up the new version.
4. In the main menu on the left, click on "Overview" (looks like a lowercase letter i inside a circle).
5. Click the "Remove project" button (looks like a trash can).
6. Follow the [Setup Instructions](#setup-instructions) above.

## Contact
❔ Questions: [https://github.com/bumbleshoot/print-quest-info/discussions/categories/q-a](https://github.com/bumbleshoot/print-quest-info/discussions/categories/q-a)  
💡 Suggestions: [https://github.com/bumbleshoot/print-quest-info/discussions/categories/suggestions](https://github.com/bumbleshoot/print-quest-info/discussions/categories/suggestions)  
🐞 Report a bug: [https://github.com/bumbleshoot/print-quest-info/issues](https://github.com/bumbleshoot/print-quest-info/issues)  
💗 Donate: [https://github.com/sponsors/bumbleshoot](https://github.com/sponsors/bumbleshoot)
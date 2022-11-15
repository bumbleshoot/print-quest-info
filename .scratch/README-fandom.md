== Summary ==
Print Quest Info prints useful info about all of Habitica's quests to a spreadsheet, including # of completions (party or user), completions needed (party or user), % complete (party or user), quest rewards, quest name, and party members with the quest scroll in their inventories.

== Setup Instructions ==
#Click [https://script.google.com/d/14BPBHQy4uGGT80F6ADZ7rsKSWh6l6AgGCFhcXSQP55SOQFYEkSsP6RA4/edit?usp=sharing here] to go to the Print Quest Info script. If you're not already signed into your Google account, you will be asked to sign in.
#In the main menu on the left, click on "Overview" (looks like a lowercase letter i inside a circle).
#Click the "Make a copy" button (looks like two pages of paper).
#At the top of your screen, click on "Copy of Print Quest Info". Rename it "Print Quest Info" and click the "Rename" button.
#Click [https://habitica.com/user/settings/api here] to open your API Settings. Highlight and copy your User ID (it looks something like this: <code>35c3fb6f-fb98-4bc3-b57a-ac01137d0847</code>). In the Print Quest Info script, paste your User ID between the quotations where it says <code>const USER_ID = "";</code>. It should now look something like this: <code>const USER_ID = "35c3fb6f-fb98-4bc3-b57a-ac01137d0847";</code>
#On the same page where you copied your User ID, click the "Show API Token" button, and copy your API Token. In the Print Quest Info script, paste your API Token between the quotations where it says <code>const API_TOKEN = "";</code>. It should now look something like this: <code>const API_TOKEN = "35c3fb6f-fb98-4bc3-b57a-ac01137d0847";</code>
#[https://sheets.google.com/create Create a new Google Sheet] and name it something like "[Party Name] Quest Info". Copy the URL in your address bar and paste it inside the quotations where it says <code>const SPREADSHEET_URL = "";</code>. If you've changed the tab name for the sheet you want to print quest info to, paste the tab name inside the quotes where it says <code>const SHEET_NAME = "";</code>.
#Add a party member's username between the quotations where it says <code>const USERNAME = "";</code> to see quest info about that user, or leave the quotes empty to see quest info about the whole party.
#Click the drop-down menu to the right of the "Debug" button, near the top of the page. Select "printQuestInfo" from the drop-down.
#Click the "Run" button to the left of the "Debug" button.
#Click "Review permissions", then select your Google account. Click on "Advanced", then "Go to Print Quest Info (unsafe)". (Don't worry, it is safe!) Then click the "Allow" button.
#Wait for it to say "Execution completed".

Repeat steps 8-10 whenever you want to update the spreadsheet.

== Updating the Script ==
#[https://script.google.com/home Click here] to see a list of your scripts. If you're not already signed into your Google account, click the "Start Scripting" button and sign in.  Then click on "My Projects" in the main menu on the left.
#Click on "Print Quest Info".
#In the main menu on the left, click on "Overview" (looks like a lowercase letter i inside a circle).
#Click the "Remove project" button (looks like a trash can).
#Follow the [[Print Quest Info#Setup Instructions|Setup Instructions]] above.

== Contact ==
:grey_question: Questions: [https://github.com/bumbleshoot/print-quest-info/discussions/categories/q-a https://github.com/bumbleshoot/print-quest-info/discussions/categories/q-a]  
:bulb: Suggestions: [https://github.com/bumbleshoot/print-quest-info/discussions/categories/suggestions https://github.com/bumbleshoot/print-quest-info/discussions/categories/suggestions]  
:lady_beetle: Report a bug: [https://github.com/bumbleshoot/print-quest-info/issues https://github.com/bumbleshoot/print-quest-info/issues]  
:heartpulse: Donate: [https://github.com/sponsors/bumbleshoot https://github.com/sponsors/bumbleshoot]

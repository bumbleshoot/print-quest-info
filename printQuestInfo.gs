/**
 * Print Quest Info v2.0.1 by @bumbleshoot
 *
 * See GitHub page for info & setup instructions:
 * https://github.com/bumbleshoot/print-quest-info
 */

const USER_ID = "";
const API_TOKEN = "";
const SPREADSHEET_URL = "";
const SPREADSHEET_TAB_NAME = "Sheet1";
const USERNAME = ""; // optional

/*************************************\
 *  DO NOT EDIT ANYTHING BELOW HERE  *
\*************************************/

const PARAMS = {
  "headers": {
    "x-api-user": USER_ID, 
    "x-api-key": API_TOKEN,
    "x-client": "35c3fb6f-fb98-4bc3-b57a-ac01137d0847-PrintQuestInfo"
  },
  "muteHttpExceptions": true
};
const GET_PARAMS = Object.assign({ "method": "get" }, PARAMS);

const scriptProperties = PropertiesService.getScriptProperties();
 
/**
 * printQuestInfo()
 * 
 * Prints useful info for each of Habitica's quests into a spreadsheet.
 * Assign a party member's username to the USERNAME constant above to 
 * print info pertaining to that user. (Note: usernames are case 
 * sensitive!)
 */
let members;
let content;
function printQuestInfo() {

  // open spreadsheet & sheet
  try {
    var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_URL.match(/[^\/]{44}/)[0]);
    var sheet = spreadsheet.getSheetByName(SPREADSHEET_TAB_NAME);

    // if sheet doesn't exist, print error & exit
    if (sheet === null) {
      console.log("ERROR: SPREADSHEET_TAB_NAME \"" + SPREADSHEET_TAB_NAME + "\" doesn't exit.");
      return;
    }

  // if spreadsheet doesn't exist, print error & exit
  } catch (e) {
    if (e.stack.includes("Unexpected error while getting the method or property openById on object SpreadsheetApp")) {
      console.log("ERROR: SPREADSHEET_URL not found: " + SPREADSHEET_URL);
      return;
    } else {
      throw e;
    }
  }

  // get API data
  members = JSON.parse(fetch("https://habitica.com/api/v3/groups/party/members?includeAllPublicFields=true", GET_PARAMS)).data;
  content = JSON.parse(fetch("https://habitica.com/api/v3/content", GET_PARAMS)).data;

  // if username not in party, print error & exit
  if (USERNAME !== "") {
    let found = false;
    for (member of members) {
      if (member.auth.local.username === USERNAME) {
        found = true;
        break;
      }
    }
    if (!found) {
      console.log("ERROR: there is nobody in the party with the username \"" + USERNAME + "\".");
      return;
    }
  }

  // get quest data
  let questData = getQuestData();

  // sort egg quests by reward
  questData.eggQuests.sort((a, b) => {
    return a.rewards.map(x => x.name).join(",").localeCompare(b.rewards.map(x => x.name).join(","));
  });

  // sort hatching potion quests by reward
  questData.hatchingPotionQuests.sort((a, b) => {
    return a.rewards.map(x => x.name).join(",").localeCompare(b.rewards.map(x => x.name).join(","));
  });

  // sort masterclasser quests chronologically
  let masterclasserOrder = ["Dilatory Distress", "Terror in the Taskwoods", "Stoïkalm Calamity", "Mayhem in Mistiflying", "The Mystery of the Masterclassers"];
  questData.masterclasserQuests.sort((a, b) => {
    masterclasserOrder.indexOf(a.name) > masterclasserOrder.indexOf(b.name) ? 1 : -1;
  });

  // sort unlockable quests alphabetically
  questData.unlockableQuests.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  // sort achievement quests alphabetically
  questData.achievementQuests.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  // combine quest lists into one
  let quests = questData.eggQuests.concat(questData.hatchingPotionQuests).concat(questData.seasonalQuests).concat(questData.masterclasserQuests).concat(questData.unlockableQuests).concat(questData.achievementQuests);

  console.log("Printing quest info");

  // print column headings
  sheet.clearContents();
  let span = USERNAME == "" ? "whole party" : USERNAME;
  sheet.getRange("A1").setValue("Report ran for " + span + ", " + new Date().toString());
  var headings = ["#", "Quest Type", "Completions/Completions Needed", "% Complete", "# Members Who Need This Quest", "Quest Reward(s)", "Quest Name", "Complete By", "Members With Scroll", "Members Who Need This Quest"];
  sheet.getRange(2, 1, 1, headings.length).setValues([headings]);
  var numHeadings = sheet.getLastRow();

  // for each quest
  let questsArray = [];
  for (let i=0; i<quests.length; i++) {

    // get members incomplete
    let numMembersIncomplete = 0;
    let membersIncomplete = "";
    if (USERNAME == "") {
      for ([username, completions] of Object.entries(quests[i].completedIndividual)) {
        if (completions < quests[i].neededIndividual) {
          numMembersIncomplete++;
          membersIncomplete += username + ", ";
        }
      }
      membersIncomplete = membersIncomplete.substring(0, membersIncomplete.length-2);
    } else if (quests[i].completedIndividual[USERNAME] < quests[i].neededIndividual) {
      numMembersIncomplete = 1;
      membersIncomplete = USERNAME;
    }

    // get list of members with scrolls as string
    let membersWithScroll = "";
    if (USERNAME == "") {
      for (let j=0; j<quests[i].membersWithScroll.length; j++) {
        membersWithScroll += quests[i].membersWithScroll[j];
        if (j < quests[i].membersWithScroll.length - 1) {
          membersWithScroll += ", ";
        }
      }
    } else if (quests[i].membersWithScroll.includes(USERNAME)) {
      membersWithScroll = USERNAME;
    }
 
    // add row to array
    if (USERNAME != "") {
      questsArray[i] = [sheet.getLastRow()-numHeadings+i+1, quests[i].type, quests[i].completedIndividual[USERNAME] + "/" + quests[i].neededIndividual, Math.round(quests[i].completedIndividual[USERNAME] / quests[i].neededIndividual * 100) + "%", numMembersIncomplete, quests[i].rewards.map(x => x.name).join(", "), quests[i].name, quests[i].completeBy, membersWithScroll, membersIncomplete];
    } else {
      questsArray[i] = [sheet.getLastRow()-numHeadings+i+1, quests[i].type, quests[i].completedParty + "/" + quests[i].neededParty, Math.round(quests[i].completedParty / quests[i].neededParty * 100) + "%", numMembersIncomplete, quests[i].rewards.map(x => x.name).join(", "), quests[i].name, quests[i].completeBy, membersWithScroll, membersIncomplete];
    }
  }

  // print quests to spreadsheet
  if (questsArray.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, questsArray.length, headings.length).setValues(questsArray);
  }

  console.log("Done!");
}

/**
 * fetch(url, params)
 * 
 * Wrapper for Google Apps Script's UrlFetchApp.fetch(url, params):
 * https://developers.google.com/apps-script/reference/url-fetch/url-fetch-app#fetchurl,-params
 * 
 * Retries failed API calls up to 2 times & handles Habitica's rate 
 * limiting.
 */
 function fetch(url, params) {

  // try up to 3 times
  for (let i=0; i<3; i++) {

    // if rate limit reached
    let rateLimitRemaining = scriptProperties.getProperty("X-RateLimit-Remaining");
    let rateLimitReset = scriptProperties.getProperty("X-RateLimit-Reset");
    if (rateLimitRemaining != null && Number(rateLimitRemaining) < 1) {

      // wait until rate limit reset
      let waitUntil = new Date(rateLimitReset);
      waitUntil.setSeconds(waitUntil.getSeconds() + 1);
      let now = new Date();
      Utilities.sleep(Math.max(waitUntil.getTime() - now.getTime(), 0));
    }

    // call API
    let response = UrlFetchApp.fetch(url, params);

    // store rate limiting data
    scriptProperties.setProperties({
      "X-RateLimit-Reset": response.getHeaders()["x-ratelimit-reset"],
      "X-RateLimit-Remaining": response.getHeaders()["x-ratelimit-remaining"]
    });

    // if success, return response
    if (response.getResponseCode() < 300) {
      return response;

    // if 3xx or 4xx or failed 3 times, throw exception
    } else if (response.getResponseCode() < 500 || i >= 2) {
      throw new Error("Request failed for https://habitica.com returned code " + response.getResponseCode() + ". Truncated server response: " + response.getContentText());
    }
  }
}

/**
 * getQuestData()
 * 
 * Gathers relevant quest data from Habitica's API, arranges it
 * in a JavaScript Object, and returns the object.
 */
function getQuestData() {

  console.log("Getting quest data");

  // sort party members by username
  members.sort((a, b) => {
    return a.auth.local.username.localeCompare(b.auth.local.username);
  })

  // get # each egg & hatching potion owned/used for each member
  for (member of members) {
    member.numEachEggOwnedUsed = member.items.eggs;
    member.numEachPotionOwnedUsed = member.items.hatchingPotions;
    for ([pet, amount] of Object.entries(member.items.pets)) {
      if (amount > 0) { // 5 = newly hatched pet, >5 = fed pet, -1 = mount but no pet
        pet = pet.split("-");
        let species = pet[0];
        let color = pet[1];
        if (member.numEachEggOwnedUsed.hasOwnProperty(species)) {
          member.numEachEggOwnedUsed[species] = member.numEachEggOwnedUsed[species] + 1;
        } else {
          member.numEachEggOwnedUsed[species] = 1;
        }
        if (member.numEachPotionOwnedUsed.hasOwnProperty(color)) {
          member.numEachPotionOwnedUsed[color] = member.numEachPotionOwnedUsed[color] + 1;
        } else {
          member.numEachPotionOwnedUsed[color] = 1;
        }
      }
    }
    for (mount of Object.keys(member.items.mounts)) {
      mount = mount.split("-");
      let species = mount[0];
      let color = mount[1];
      if (member.numEachEggOwnedUsed.hasOwnProperty(species)) {
        member.numEachEggOwnedUsed[species] = member.numEachEggOwnedUsed[species] + 1;
      } else {
        member.numEachEggOwnedUsed[species] = 1;
      }
      if (member.numEachPotionOwnedUsed.hasOwnProperty(color)) {
        member.numEachPotionOwnedUsed[color] = member.numEachPotionOwnedUsed[color] + 1;
      } else {
        member.numEachPotionOwnedUsed[color] = 1;
      }
    }
  }

  // get lists of premium eggs, premium hatching potions & wacky hatching potions
  let premiumEggs = [];
  for (egg of Object.values(content.questEggs)) {
    premiumEggs.push(egg.key);
  }
  let premiumHatchingPotions = [];
  for (potion of Object.values(content.premiumHatchingPotions)) {
    premiumHatchingPotions.push(potion.key);
  }
  let wackyHatchingPotions = [];
  for (potion of Object.values(content.wackyHatchingPotions)) {
    wackyHatchingPotions.push(potion.key);
  }

  // create quest lists
  let eggQuests = [];
  let hatchingPotionQuests = [];
  let seasonalQuests = [];
  let masterclasserQuests = [];
  let unlockableQuests = [];
  let achievementQuests = [];

  // for each quest
  for (quest of Object.values(content.quests)) {

    // if not a world boss quest
    if (quest.category != "world") {

      // get rewards
      let rewards = [];
      if (typeof quest.drop.items !== "undefined") {

        for (drop of quest.drop.items) {

          let rewardName = drop.text;
          let rewardType = "";

          if (drop.type == "eggs" && premiumEggs.includes(drop.key)) {
            rewardName = content.eggs[drop.key].text + " Egg";
            rewardType = "egg";
          } else if (drop.type == "hatchingPotions" && premiumHatchingPotions.includes(drop.key)) {
            rewardType = "hatchingPotion";
          } else if (drop.type == "hatchingPotions" && wackyHatchingPotions.includes(drop.key)) {
            rewardType = "wackyPotion";
          } else if (drop.type == "mounts") {
            rewardType = "mount";
          } else if (drop.type == "pets") {
            rewardType = "pet";
          } else if (drop.type == "gear") {
            rewardType = "gear";
          }

          if (rewardType != "") {
            let index = rewards.findIndex(reward => reward.name == rewardName);
            if (index == -1) {
              rewards.push({
                key: drop.key,
                name: rewardName,
                type: rewardType,
                qty: 1
              });
            } else {
              rewards[index].qty++;
            }
          }
        }
      }

      // get completions needed & completions (party & individual)
      let neededIndividual;
      let neededParty;
      let completedParty = 0;
      let completedIndividual = {};
      if (rewards.length > 0 && rewards[0].type == "egg") {
        neededIndividual = 20 / rewards[0].qty;
        for (member of members) {
          let timesCompleted = Math.min(member.numEachEggOwnedUsed[rewards[0].key] / rewards[0].qty, neededIndividual);
          completedParty += timesCompleted;
          completedIndividual[member.auth.local.username] = Math.floor(Math.ceil(neededIndividual) * timesCompleted / neededIndividual);
        }
      } else if (rewards.length > 0 && (rewards[0].type == "hatchingPotion" || rewards[0].type == "wackyPotion")) {
        if (rewards[0].type == "hatchingPotion") {
          neededIndividual = 18 / rewards[0].qty;
        } else {
          neededIndividual = 9 / rewards[0].qty;
        }
        for (member of members) {
          let timesCompleted = Math.min(member.numEachPotionOwnedUsed[rewards[0].key] / rewards[0].qty, neededIndividual);
          completedParty += timesCompleted;
          completedIndividual[member.auth.local.username] = Math.floor(Math.ceil(neededIndividual) * timesCompleted / neededIndividual);
        }
      } else {
        neededIndividual = 1;
        for (member of members) {
          let timesCompleted = 0;
          for ([questKey, completions] of Object.entries(member.achievements.quests)) {
            if (questKey == quest.key) {
              timesCompleted = Math.min(completions, neededIndividual);
              completedParty += timesCompleted;
              break;
            }
          }
          completedIndividual[member.auth.local.username] = timesCompleted;
        }
      }
      neededParty = neededIndividual * members.length;
      let percentComplete = completedParty / neededParty;
      neededIndividual = Math.ceil(neededIndividual);
      neededParty = neededIndividual * members.length;
      completedParty = Math.floor(neededParty * percentComplete);

      // get complete by
      let completeBy = quest?.boss?.hp;
      if (typeof completeBy !== "undefined") {
        completeBy += " HP";
      } else {
        completeBy = "";
        for (collect of Object.values(quest.collect)) {
          completeBy += collect.count + " " + collect.text + ", ";
        }
        completeBy = completeBy.substring(0, completeBy.length-2);
      }

      // get members with scroll
      let membersWithScroll = [];
      for (member of members) {
        for ([questKey, numScrolls] of Object.entries(member.items.quests)) {
          if (questKey == quest.key && numScrolls > 0) {
            membersWithScroll.push(member.auth.local.username);
            break;
          }
        }
      }

      // create quest object
      let questInfo = {
        name: quest.text,
        rewards,
        membersWithScroll,
        neededParty,
        completedParty,
        neededIndividual,
        completedIndividual,
        completeBy
      };

      // determine quest type & add to corresponding quest list
      let rewardType = rewards.length > 0 ? rewards[0].type : null;
      if (typeof quest.event !== "undefined") {
        questInfo.type = "S";
        seasonalQuests.push(questInfo);
      } else if (quest.group == "questGroupDilatoryDistress" || quest.group == "questGroupTaskwoodsTerror" || quest.group == "questGroupStoikalmCalamity" || quest.group == "questGroupMayhemMistiflying" || quest.group == "questGroupLostMasterclasser") {
        questInfo.type = "M";
        masterclasserQuests.push(questInfo);
      } else if (quest.text == "The Basi-List" || quest.text == "The Feral Dust Bunnies") {
        questInfo.type = "A";
        achievementQuests.push(questInfo);
      } else if (quest.category == "unlockable") {
        questInfo.type = "U";
        unlockableQuests.push(questInfo);
      } else if (rewardType == "egg") {
        questInfo.type = "E";
        eggQuests.push(questInfo);
      } else if (["hatchingPotion", "wackyPotion"].includes(rewardType)) {
        questInfo.type = "H";
        hatchingPotionQuests.push(questInfo);
      }
    }
  }

  // compare each pair of egg quests
  for (let i=0; i<eggQuests.length; i++) {
    for (let j=i+1; j<eggQuests.length; j++) {

      // if rewards are the same
      if (eggQuests[i].rewards.map(x => JSON.stringify(x)).sort((a, b) => a.localeCompare(b)).join(",") === eggQuests[j].rewards.map(x => JSON.stringify(x)).sort((a, b) => a.localeCompare(b)).join(",")) {

        // combine neededIndividual
        let neededIndividual = Math.max(eggQuests[i].neededIndividual, eggQuests[j].neededIndividual);

        // combine completedParty & completedIndividual
        let completedParty = 0;
        let completedIndividual = {};
        for (key of Object.keys(eggQuests[i].completedIndividual)) {
          let timesCompleted = Math.min(eggQuests[i].completedIndividual[key] + eggQuests[j].completedIndividual[key], neededIndividual);
          completedIndividual[key] = timesCompleted;
          completedParty += timesCompleted;
        }

        // combine membersWithScroll
        let membersWithScroll = eggQuests[i].membersWithScroll;
        for (member of eggQuests[j].membersWithScroll) {
          if (!membersWithScroll.includes(member)) {
            membersWithScroll.push(member);
          }
        }
        membersWithScroll.sort();

        // combine everything else & save to quest list
        eggQuests.push({
          name: eggQuests[i].name + " OR " + eggQuests[j].name,
          rewards: eggQuests[i].rewards,
          membersWithScroll,
          neededParty: neededIndividual * members.length,
          completedParty,
          neededIndividual,
          completedIndividual,
          type: eggQuests[i].type,
          completeBy: eggQuests[i].completeBy === eggQuests[j].completeBy ? eggQuests[i].completeBy : eggQuests[i].completeBy + " OR " + eggQuests[j].completeBy
        });

        // delete individual quests
        eggQuests.splice(j, 1);
        eggQuests.splice(i, 1);
        j = i;
      }
    }
  }

  // return quest lists
  return {
    eggQuests,
    hatchingPotionQuests,
    seasonalQuests,
    masterclasserQuests,
    unlockableQuests,
    achievementQuests
  };
}
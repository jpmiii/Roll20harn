



on("ready", function() {
	if (!state.MainGameNS) {
		state.MainGameNS = { index: 0, dis: 0 };
	}
	expectedSerial = 1;
	if (config.serial != expectedSerial) {
		sendChat("API", `Unexpected config serial number. Expected ${expectedSerial} but got ${config.serial}`);
	}
	log(getHarnTimeStr(state.MainGameNS.GameTime));
	log("trace: " + trace);
	house_remove(config.remove_items, prices, "inventory");
	house_remove(config.remove_armor_coverage, armor_coverage, "armor coverage");
	house_add(config.add_skills, skilllist, "skill");
	house_add(config.add_items, prices, "inventory");
	house_add(config.add_armor_coverage, armor_coverage, "skill");
	house_add(config.add_armor_prot, armor_prot, "skill");
	house_add(config.add_occupational_skills, occupational_skills, "occupation skill");
	house_add(config.add_occupation_time, occupation_time, "occupation time");
	initializeTables(0);
	started = true;
});






on("chat:message", function(msg) {
	if (trace) { log(`>chat:message(${msg.content})`); }
	if (msg.type == "api") {
		var args = msg.content.split(" ");
		if (dispatch_table.hasOwnProperty(args[0])) {
			var commandMap = dispatch_table[args[0]];
			try {
				// First, test the syntax regular expression if it has one
				if (commandMap.hasOwnProperty("re_syntax")) {
					log(`comparing syntax to ${commandMap.re_syntax}`)
					if (!commandMap.re_syntax.test(msg.content)) {
						var errorMessage = `&{template:default} {{name=Syntax error}} {{Received=${msg.content}}}`;
						if (commandMap.hasOwnProperty("hr_syntax")) {
							errorMessage += `{{Expected=${commandMap.hr_syntax}}}`;
						}
						sendChat("API", errorMessage);
						return;
					}
				}
				// syntax check passed or doesn't exist. Execute the action if it exists.
				if (commandMap.hasOwnProperty("action")) {
					commandMap.action(args, msg)
				} else {
					sendChat("API Error", `No action defined for ${args[0]}`)
				}
			} catch (err) {
				// Something went wrong. Log it, alert in chat and prevent the sandbox from bailing.
				log(err.stack);
				sendChat("API Error", err.message);
			}
		} else {
			log(`No such command ${msg.content}`);
			sendChat("API Error", `&{template:default} {{name=Unknown command}} {{Received=${msg.content}}}`)

		}

	} else {
		chatParser(msg);
	}


	if (trace) { log("<chat:message") }
});







on("change:attribute:current", function(obj, prev) {

	if ((obj.get('name') == "INITIATIVE_ML") || (obj.get('name') == "UNIVERSAL_PENALTY") || (obj.get('name') == "ENCUMBRANCE") || (obj.get('name') == "RIDER")) {

		charid = obj.get("_characterid");

		var rideratt = findObjs({
			name: 'RIDER',
			_type: "attribute",
			_characterid: charid,
		})[0];
		if (rideratt) {
			var rider = findObjs({
				name: rideratt.get('current'),
				_type: "character",
			})[0];
			if (rider) {
				mySet('STEED_INIT', rider.id, (parseInt(myGet('INITIATIVE_ML', charid, 0)) - (parseInt(myGet('UNIVERSAL_PENALTY', charid, 0)) * 5) - (parseInt(myGet('ENCUMBRANCE', charid, 0)) * 5)));

			}
		}
	} else if (obj.get('name').includes("WEAPON_NAME") && weapon_list_on) {
		setWeaponsList(obj.get("_characterid"));
	} else if (obj.get('name').includes("SKILL_NAME") && config.skill_list_on) {
		setSkillList(obj.get("_characterid"));
	} else if (obj.get('name') == "sheetTab") {
		if (obj.get('current') == "skills" && config.skill_list_on) {
			setSkillList(obj.get("_characterid"));
		} else if (obj.get('current') == "combat" && config.weapon_list_on) {
			setWeaponsList(obj.get("_characterid"));
		}
	}
});

on("change:campaign:turnorder", function(obj, prev) {

	if (Campaign().get("turnorder") !== "") {
		if (prev["turnorder"] !== "") {
			var turnorder = JSON.parse(Campaign().get("turnorder"));
			var oldturnorder = JSON.parse(prev["turnorder"]);
			if (turnorder.length > 0) {
				if (turnorder[0]["id"] !== oldturnorder[0]["id"]) {
					toke = getObj("graphic", turnorder[0]["id"]);
					sendGMPing(toke.get('left'), toke.get('top'), toke.get('pageid'), "", true);
				}
			}
		}
	}

});

function house_remove(house_remove, canon, description) {
	house_remove.forEach((k) => {
		if (trace)
			log(`Removing ${description} ${k}`);
		delete canon[k];
	});
}

function house_add(house_add, canon, description) {
	Object.keys(house_add).forEach((k) => {
		canon[k] = house_add[k];
		if (trace)
			log(`Adding house rule ${description}: ${k}`);
	});
}


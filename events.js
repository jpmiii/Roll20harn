



on("ready", function() {
	if (!state.MainGameNS) {
		state.MainGameNS = { GameTime: 0 };
	}
	expectedSerial = 1;
	if (config.serial != expectedSerial) {
		sendChat("API", `Unexpected config serial number. Expected ${expectedSerial} but got ${config.serial}`);
	}
	
	log("trace: " + trace);
	//Object.assign(generate_tables(),tables)
	//
	
	//log(getHarnTimeStr(state.MainGameNS.GameTime));

	started = true;
	generate_tables();
	//if (trace) { log(`API table : ${JSON.stringify(tables,null,4)}`) }
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
	} else if (obj.get('name').includes("WEAPON_NAME") && config.weapon_list_on) {
		setWeaponsList(obj.get("_characterid"));
	} else if (obj.get('name').includes("SKILL_NAME") && config.skill_list_on) {
		settables.skilllist(obj.get("_characterid"));
	} else if (obj.get('name') == "sheetTab") {
		if (obj.get('current') == "skills" && config.skill_list_on) {
			setSkilllist(obj.get("_characterid"));
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
function generate_tables(pid=0) {
	


	var scdata = findObjs({
		name: "API_tables",
		_type: "handout",
	})[0];
	if (scdata) {
		scdata.get("notes", function(scda) {
			tables = JSON.parse(scda.substring(5, scda.indexOf('</pre>')));
		    if (trace) { log(`API table loaded`) }
		});

	} else {
	    var handout = createObj("handout", {
            name: "API_tables",
            inplayerjournals: "all",
            archived: false
	    });
	var ostr = "{\n";
	for (k in {'default_macros':'','default_abilities':'','skilllist':'','autoskills':'','autoskillsnames':'','attack_melee':'','attack_missile':'','coverage2loc':'','hit_location_table':'','hit_loc_penalty':'','armor_coverage':'','armor_prot':'','weapons_table':'','missile_range':''}) { 
		//log(k);
		ostr += `\"${k}\": ${JSON.stringify(tables[k],null,2)},\n\n`
	}
	ostr += `\"months\": ${JSON.stringify(tables['months'],null,2)}\n}`
		
	    handout.set('notes', `<pre>${ostr}</pre>`);
	    handout.set('gmnotes', 'GM notes.');
		//initializeTables(pid);
		if (trace) { log(`API table added`) }
	}
var scdata = findObjs({
		name: "API_occupation",
		_type: "handout",
	})[0];
	if (scdata) {
		scdata.get("notes", function(scda) {
			var t_in = JSON.parse(scda.substring(5, scda.indexOf('</pre>')));
			tables.occupational_skills = t_in.occupational_skills;
			tables.occupation_time = t_in.occupation_time;
			//initializeTables(pid);
		    if (trace) { log(`API table loaded`) }
		});

	} else {
	    var handout = createObj("handout", {
            name: "API_occupation",
            inplayerjournals: "all",
            archived: false
	    });
		var ostr = `\"occupational_skills\": ${JSON.stringify(tables['occupational_skills'],null,2)},\n\n`;

		ostr += `\"occupation_time\": ${JSON.stringify(tables['occupation_time'],null,2)}\n`
		
	    handout.set('notes', `<pre>{\n${ostr}\n}</pre>`);
	    handout.set('gmnotes', 'GM notes.');
		//initializeTables(pid);
		if (trace) { log(`API table added`) }
	}
	var scdata = findObjs({
		name: "API_prices",
		_type: "handout",
	})[0];
	if (scdata) {
		scdata.get("notes", function(scda) {
			tables.prices = JSON.parse(scda.substring(5, scda.indexOf('</pre>')));
			initializeTables(pid);
		    if (trace) { log(`API table loaded`) }
		});

	} else {
	    var handout = createObj("handout", {
            name: "API_prices",
            inplayerjournals: "all",
            archived: false
	    });

		
	    handout.set('notes', `<pre>${JSON.stringify(tables.prices)}</pre>`);
	    handout.set('gmnotes', 'GM notes.');
		initializeTables(pid);
		if (trace) { log(`API table added`) }
	}
}

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


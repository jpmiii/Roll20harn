
/**
 * Command dispatcher
 */
// commandname -> object with
//                  "action" a function taking two args, args and msg, which implements the command.
//                  "re_syntax" regular expression the command has to match
//                  "hr_syntax" a more human understandable version of the command syntax

// Regular expression tester: https://regex101.com/
// Regular expression cheatsheet:
// Character id: [-_a-zA-Z0-9]{20}
// Number: [-+]?[0-9]+
// one of the following: (high|mid|low|arms|legs|torso|head|neck|skull|abdomen|face|thorax|shoulder|hip|thigh|knee|calf|foot|upper_arm|elbow|forearm|hand|groin)

var target_locations="(high|mid|low"+(config.additional_target_locations?"|arms|legs|torso|head|neck|skull|abdomen|face|thorax|shoulder|hip|thigh|knee|calf|foot|upper_arm|elbow|forearm|hand|groin":"")+")"

var dispatch_table = {
    "!calcsb": {
        "action": (args, msg) => { handle_calcsb(args, msg); },
        "re_syntax": /^!calcsb [-_a-zA-Z0-9]{20}$/,
        "hr_syntax": "!calcsb character_id<br/>Calculate the skill bonus for the selected character."
    },
    "!cheat": {
        "action": (args, msg) => { handle_cheat(args, msg); },
        "re_syntax": /^!cheat [-+]?[0-9]+$/,
        "hr_syntax": "!cheat number<br/>The next d100 roll will be the provided number."
    },
    "!mapsend": {
        "action": (args, msg) => { handle_mapsend(args, msg); },
        "re_syntax": /^!mapsend [^,]+,[^,]+$/,
        "hr_syntax": "!mapsend player_name,page_name <br/>Sends the named player to the named map."
    },
    "!itemlist": {
        "action": (args, msg) => { handle_itemlist(args, msg); },
        "re_syntax": /^!itemlist$/,
        "hr_syntax": "!itemlist<br/>Prepares the item lists for use by other macros."
    },
    "!occupation": {
        "action": (args, msg) => { handle_occupation(args, msg); },
        "re_syntax": /^!occupation [-_a-zA-Z0-9]{20}$/,
        "hr_syntax": "!occupation character_id<br/>Adds the occupation skills to the character."
    },
    "!table": {
        "action": (args, msg) => { handle_table(args, msg); },
        "re_syntax": /^!table .+$/,
        "hr_syntax": "!table [[inline roll]] [[inline roll]] character id<br/>Rolls a value on a specially formatted handout."
    },
    "!rollatts": {
        "action": (args, msg) => { handle_rollatts(args, msg); },
        "re_syntax": /^!rollatts [-_a-zA-Z0-9]{20}$/,
        "hr_syntax": "!rollatts character_id<br/>Rolls a new character for you"
    },
    "!newturn": {
        "action": (args, msg) => { handle_newturn(args, msg); },
        "re_syntax": /^!newturn$/,
        "hr_syntax": "!newturn<br/>Starts a new round and re-computes initiative"
    },
    "!tokendis": {
        "action": (args, msg) => { handle_tokendis(args, msg); },
        "re_syntax": /^!tokendis [-_a-zA-Z0-9]{20} [-_a-zA-Z0-9]{20}$/,
        "hr_syntax": "!tokendis character_id1 character_id2<br/>Computes the distance between two characters"
    },
    "!sheetattack": {
        "action": (args, msg) => { handle_sheetattack(args, msg); },
        "re_syntax": new RegExp(`^(!sheetattack|!attack) [-_a-zA-Z0-9]{20} ${target_locations} (H|B|E|P|F) (melee|missile) [-+]?[0-9]+ [-_a-zA-Z0-9]{20} .+$`),
        "hr_syntax": `![sheet]attack attacker_id ${target_locations} (H|B|E|P|F) (missile|melee) modifier defender_id weapon`
    },
    "!attack": {
        "action": (args, msg) => { handle_attack(args, msg); },
        "re_syntax": new RegExp(`^(!sheetattack|!attack) [-_a-zA-Z0-9]{20} ${target_locations} (H|B|E|P|F) (melee|missile) [-+]?[0-9]+ [-_a-zA-Z0-9]{20} .+$`),
        "hr_syntax": `![sheet]attack attacker_id ${target_locations} (H|B|E|P|F) (missile|melee) modifier defender_id weapon`
    },
    "!defend": {
        "action": (args, msg) => { handle_defend(args, msg); },
        "re_syntax": /^!defend (ignore|dodge|block|counterstrike) (#zero|[-+]?[0-9]+) WeaponName:.*$/,
        "hr_syntax": "!defend (block mod WeaponName: weapon_name|dodge mod|ignore|counterstrike mod WeaponName: weapon_name)<br/>defends against an attack"
    },
    "!invin": {
        "action": (args, msg) => { handle_invin(args, msg); },
        "re_syntax": /^!invin [-_a-zA-Z0-9]{20}$/,
        "hr_syntax": "!invin character_id<br/>Inputs character inventory in HârnMaster Character Utility text format from character note."

    },
    "!xin": {
        "action": (args, msg) => { handle_xin(args, msg); },
        "re_syntax": /^!xin( [-_a-zA-Z0-9]{20})?$/,
        "hr_syntax": "!xin [character_id]<br/>Imports a character in HârnMaster Character Utility text format from the character note."

    },
    "!ca": {
        "action": (args, msg) => { handle_ca(args, msg); },
        "re_syntax": /^!ca( [-_a-zA-Z0-9]{20})?$/,
        "hr_syntax": "!ca [character_id]<br/>Calculates armor values at hit locations."
    },
    "!addItem": {
        "action": (args, msg) => { handle_addItem(args, msg); },
        "re_syntax": /^!addItem [-_a-zA-Z0-9]{20} .*$/,
        "hr_syntax": "!addItem character_id Item name"
    },
    "!clearmove": {
        "action": (args, msg) => { handle_clearmove(args, msg); },
        "re_syntax": /^!clearmove.*$/,
        "hr_syntax": "Does something"
    },
    "!tokemove": {
        "action": (args, msg) => { handle_tokemove(args, msg); },
        "re_syntax": /^!tokemove.*$/,
        "hr_syntax": "Shows token move distance"
    },
    "!out": {
        "action": (args, msg) => { handle_out(args, msg); },
        "re_syntax": /^!out.*$/,
        "hr_syntax": "!out token_id<br/> outputs character data to log"
    },
    "!attack_melee_table": {
        "action": (args, msg) => { handle_tables.attack_melee_table(args, msg); },
        "re_syntax": /^!attack_melee_table (block|counterstrike|dodge|ignore) [1-4] [1-4]$/,
        "hr_syntax": "!attack_meleee_table (block|counterstrike|dodge|ignore) [1-4] [1-4]<br/>Outputs the attack melee table "
    },
    "!loc": {
        "action": (args, msg) => { handle_loc(args, msg); },
        "re_syntax": /^!loc [0-9]+ [0-9]+$/,
        "hr_syntax": "!loc result aim_index<br/>Gets the hit location for a die roll and aim"
    },
    "!time": {
        "action": (args, msg) => { handle_time(args, msg); },
        "re_syntax": /^!time$/,
        "hr_syntax": "!time<br/>Outputs the current time"
    },
    "!settime": {
        "action": (args, msg) => { handle_settime(args, msg); },
        "re_syntax": /^!settime [0-9]{3,}( [0-9]{1,2}( [0-9]{1,2}( [0-9]{1,2}( [0-9]{1,2}( [0-9]{1,2})?)?)?)?)?$/,
        "hr_syntax": "!settime YYY [MM [DD [HH [MM [SS]]]]]"
    },
    "!addtime": {
        "action": (args, msg) => { handle_addtime(args, msg); },
        "re_syntax": /^!addtime [+-]?[0-9]+$/,
        "hr_syntax": "!addtime seconds<br/>Adds seconds to the time"
    },
    "!rand": {
        "action": (args, msg) => { handle_rand(args, msg); },
        "re_syntax": /^!rand.*$/,
        "hr_syntax": "!rand selected characters<br/>Randomly choses one of all selected tokens."
    },
    "!gmrand": {
        "action": (args, msg) => { handle_gmrand(args, msg); },
        "re_syntax": /^!gmrand.*$/,
        "hr_syntax": "!gmrand selected characters<br/>Randomly choses one of all selected tokens."

    },
    "!help": {
        "action": (args, msg) => { handle_help(args, msg); },
        "re_syntax": /^!help.*$/,
        "hr_syntax": "!help command<br/>Show help strings."
    },
    "!improveskill": {
        "action": (args, msg) => { handle_improveskill(args, msg); },
        "re_syntax": /^!improveskill [-_a-zA-Z0-9]{20} .*$/,
        "hr_syntax": "!improveskill character_id skill name<br/>Performs a skill improvement roll for the given character and skill."
    },
    "!pickskill": {
	    "action": (args, msg) => { handle_pickskill(args, msg); },
        "re_syntax": /^!pickskill [-_a-zA-Z0-9]{20}.*$/,
        "hr_syntax": "!pickskill character_id prompt title<br/>Prompts the user to pick a valid skill to improve"
    }
}

/**
 * Process an attack message
 */
function handle_attack(atk, msg) {
	if (trace) { log(`handle_attack(${atk},${msg.content})`) }

	if (atk[0] == "!sheetattack") {
		var tokelist = findObjs({
			represents: atk[1],
			_pageid: getSelectedPage(msg),
			_type: "graphic",
		});
		if (tokelist == null || tokelist.length < 1) {
			sendChat(msg.who, "Move the player banner to this page.");
			return;
		}
		atk[1] = tokelist[0].id;

	}
	var atoke = getObj("graphic", atk[1]);
	var charid = atoke.get("represents")
	var toke = getObj("graphic", atk[6]);
	if (!toke.get("represents")) { sendChat(msg.who, "No defender"); return; }
	var defcharid = toke.get("represents");


	if (atoke && toke) {
		var res = `Distance: ${tokendistance(atoke, toke)[0]}<br/>Attacker Move: ${tokemove(atoke)}<br/>Defender Move: ${tokemove(toke)}`;
	}
	// Use regular expression to get the string which starts after the 7th space delimited word
	weapNameArray = msg.content.match(/^([^ ]+ ){7}(.*)$/);
	var wepname = weapNameArray[weapNameArray.length - 1];
	log(`selected weapon: ${wepname}`);

	if (wepname == "") {
		log(msg.content);
		return;
	}
	aroll = randomInteger(100);
	var ctype = parseInt(myGet('CType', charid, 0))

	log("Roll: " + aroll);

	if (ctype !== 0) {
		for (i = 0; i < (ctype * -1); i++) {
			var broll = randomInteger(300);
			log("cheat: " + aroll + " " + broll);
			if (broll < aroll) {
				aroll = broll;
			}
		}
		if (ctype > 0) {
			aroll = 101 - aroll;
		}
		log("Cheat Roll: " + aroll);

	}

	if (state.MainGameNS["cheat"] > 0) {
		if (state.MainGameNS["cheat"] > 100) {
			aroll = 100 - state.MainGameNS["cheat"]
		} else {
			aroll = state.MainGameNS["cheat"]
			state.MainGameNS["cheat"] = 0;
		}

	}


	state.MainGameNS["aroll"] = aroll;
	state.MainGameNS["wepname"] = wepname;
	state.MainGameNS["attacker"] = atk;


	var wep = getWep(defcharid);

	var atkstr = `&{template:${config.attack_template}} \
		{{rolldesc=${atoke.get('name')} ${atk[4]} attacks ${toke.get('name')} with a ${wepname}}} \
		{{info=${res}}} \
		{{def=${buttonMaker("!defend dodge ?{Mod|0} WeaponName:Dodge", "Dodge", null, null, 1.2)}${buttonMaker("!defend ignore #zero WeaponName:", "Ignore", null, null, 1.2)}`;
	for (var i = 0; i < wep.length; i++) {
		atkstr += buttonMaker("!defend ?{response|block|counterstrike} ?{Mod|0} WeaponName:" + myGet(wep[i].get('name'), defcharid, "").replace(')', '&#41;'), myGet(wep[i].get('name'), defcharid, ""), null, null, 1.2)
	}
	atkstr += "}}"

	sendChat(msg.who, atkstr);

}


/**
 * Process an defend message
 */


function handle_defend(def, msg) {

	var atk = state.MainGameNS.attacker;
	var wepname = state.MainGameNS.wepname
	var atoke = getObj("graphic", atk[1]);

	var toke = getObj("graphic", atk[6]);
	if (!toke.get("represents")) { sendChat(msg.who, "No defender"); return; }
	if (!toke.get("represents").startsWith("-M")) { sendChat(msg.who, "No defender -M"); return; }
	var charid = atoke.get("represents")
	var defcharid = toke.get("represents")
	var defchar = getObj("character", defcharid);
	var allowed = defchar.get("controlledby");
	if (!playerIsGM(msg.playerid)) {
		if (allowed.indexOf(msg.playerid) == -1 && allowed.indexOf("all") == -1) {
			sendChat("API", msg.who + " is not in control")
			return;
		}
	}
	///////////////////////////////////////////////////////////////////////

	var aojn = findWeapon(charid, wepname)[0].get('name');
	if (!aojn) {
		sendChat(msg.who, "Weapon " + wepname + " not found");
		return;
	}

	var aeml = getMeleeEML(atoke, aojn.slice(0, -4), charid, atk[5], atk[2]);
	var app = 0;
	var appstr = "";

	if (atk[4] == "missile") {
		var missi;

		({ missi, app, appstr } = missileAttack(tokendistance(atoke, toke), wepname, tokemove(atoke), charid));
	}

	var atkml = aeml.total + app;
	if (!atkml) {
		sendChat("API", "attack ml problem");
		return;
	}

	appstr = `${aeml.targstr} ${appstr}`;


	if (atkml > config.emlmax) { atkml = config.emlmax; };
	if (atkml < config.emlmin) { atkml = config.emlmin; };
	var { asuc, ais } = determineSuccess(atkml, state.MainGameNS.aroll);
	///////////////////////////////////////////////////////////////////////

	var deml = { 'total': 0, 'targstr': '' };

	if (def[1] == "dodge") {
		var deml = getDodgeEML(toke, defcharid, parseInt(def[2]),
			((atk[4] == "missile") && (wepname.indexOf("Bow") !== -1)));
	}

	if ((def[1] == "block") || (def[1] == "counterstrike")) {
		var defwepname = msg.content.slice((msg.content.indexOf("WeaponName:") + 11));

		if (defwepname.length > 3) {

			var defwep = findWeapon(defcharid, defwepname);
			var ojn = defwep[0].get('name');

			if (def[1] == "counterstrike") {
				var deml = getMeleeEML(toke, ojn.slice(0, -4), defcharid, def[2], 'mid');
			} else {
				var deml = getMeleeEML(toke, ojn.slice(0, -4), defcharid, def[2], 'mid', true);
			}
		}
	}

	droll = randomInteger(100);

	var ctype = parseInt(myGet('DCType', defcharid, 0))

	log("Def roll: " + droll);
	if (ctype !== 0) {
		for (i = 0; i < (ctype * -1); i++) {
			var broll = randomInteger(300);
			log("cheat: " + aroll + " " + broll);
			if (broll < droll) {
				droll = broll
			}
		}
		if (ctype > 0) {
			droll = 101 - droll;
		}
		log("Cheat Def roll: " + droll);
	}

	if (state.MainGameNS["cheat"] > 0) {
		if (state.MainGameNS["cheat"] > 100) {
			droll = 100 - state.MainGameNS["cheat"]
		} else {
			droll = state.MainGameNS["cheat"]
			state.MainGameNS["cheat"] = 0;
		}
	}

	if (deml.total > config.emlmax) { deml.total = config.emlmax; };
	if (deml.total < config.emlmin) { deml.total = config.emlmin; };

	log("DefML: " + deml.total)

	var { dsuc, dis } = determineDefSuccess(deml.total, droll);

	if (def[1] == "ignore") {
		dis = 0;
	}

	if (atk[4] == "missile") {
		var r = tables.attack_missile[def[1]][ais][dis];
	} else {
		var r = tables.attack_melee[def[1]][ais][dis];
	}

	var ares = "";
	var dres = "";

	if ((r.indexOf("A*") == 0) || (r.indexOf("B*") == 0)
		|| (r.indexOf("M*") == 0)) {
		ares = doHit(parseInt(r.slice(2)), aojn.slice(0, -4),
			charid, defcharid, atk[3], missi, atk[2], atoke, toke);
	}

	if ((r.indexOf("D*") == 0) || (r.indexOf("B*") == 0)) {
		dres = doHit(parseInt(r.slice(2)), ojn.slice(0, -4),
			defcharid, charid, 'H', null, 'mid', toke, atoke);
	}

	if (def[1] == "dodge") {
		var rolldesc = `${toke.get('name')} attempts dodge`
	} else if (def[1] == "ignore") {
		var rolldesc = `${toke.get('name')} ignores`
		dis = 5;
	} else {
		var rolldesc = `${toke.get('name')} ${def[1]}s with a ${defwepname}`
	}

	//log crits

	if (asuc == "CS") {
		charLog(charid, ": Attack CS " + wepname, config.realtime, config.gametime)
	} else if (asuc == "CF") {
		charLog(charid, ": Attack CF " + wepname, config.realtime, config.gametime)
	}
	if (dsuc == "CS") {
		charLog(defcharid, ": Defend CS " + defwepname, config.realtime, config.gametime)
	} else if (dsuc == "CF") {
		charLog(defcharid, ": Defend CF " + defwepname, config.realtime, config.gametime)
	}

	sendChat(msg.who, defendTemplate(config.defend_template,
		rolldesc,
		labelMaker(`Roll d100: ${state.MainGameNS.aroll}`, null, null, 1.3),
		labelMaker(`Target: ${atkml}`, appstr, null, 1.3),
		ais,
		labelMaker(`Roll d100: ${droll}`, null, null, 1.3),
		labelMaker(`Target: ${deml.total}`, deml.targstr, null, 1.3),
		dis, ares, dres, r));
}





//
//
//
// CODE 
//
//


var started = false;

const getGMPlayers = (pageid) => findObjs({ type: 'player' })
	.filter((p) => playerIsGM(p.id))
	.filter((p) => undefined === pageid || p.get('lastpage') === pageid)
	.map(p => p.id)
	;

const sendGMPing = (left, top, pageid, playerid = null, moveAll = false) => {
	let players = getGMPlayers(pageid);
	if (players.length) {
		sendPing(left, top, pageid, playerid, moveAll, players);
	}
};

function initRoll() {
	if (config.randomize_init_roll) {
		return randomInteger(6) + randomInteger(6) + randomInteger(6);
	} else {
		return 0; // canon
	}

}

function buttonMaker(command, text, tip, style, size) {
	let tipExtra = (tip ? `class="showtip tipsy" title="${tip}"` : '');
	return `<a ${tipExtra} style="color:black;background-color:transparent;border: 1px solid #555555;border-radius:1em;display:inline-block;height:1em;line-height:1em;min-width:1em;padding:1px;margin:0;margin-left:.2em;text-align:center;font-size:${size}em;${style || ''}" href="${command}">${text}</a>`;
}

function labelMaker(text, tip, style, size = 1) {
	let tipExtra = (tip ? `class="showtip tipsy" title="${tip}"` : '');
	return `<a ${tipExtra} style="color:black;background-color:transparent;border: 1px solid #000000;display:inline-block;height:1em;line-height:1em;min-width:1em;padding:2px;margin:0;margin-left:.2em;text-align:center;font-size:${size}em;${style || ''}">${text}</a>`;
}



function getMeleeEML(toke, repeating_weapon_name, charid, mod = 0, loc = "mid", block = false) {
	var x = 0;
	var tot = parseInt(myGet(`${repeating_weapon_name}ML`, charid, 0));
	var targstr = `<div style='width:180px;'>Mastery Level: ${tot}<br>`;
	if (block) {
		x = parseInt(myGet(`${repeating_weapon_name}DEF`, charid, 0));
		if (x !== 0) {
			tot += x;
			targstr = `${targstr}Defence Mod: ${x}<br>`;
		}
	} else {
		x = parseInt(myGet(`${repeating_weapon_name}ATK`, charid, 0));
		if (x !== 0) {
			tot += x;
			targstr = `${targstr}Attack Mod: ${x}<br>`;
		}
	}
	x = parseInt(myGet(`${repeating_weapon_name}HM`, charid, 0));
	if (x !== 0) {
		tot += x;
		targstr = `${targstr}H Mod: ${x}<br>`;
	}
	if (toke.get('bar3_value')) {
		x = (parseInt(toke.get('bar3_value'))) * -5;
		if (x !== 0) {
			tot += x;
			targstr = `${targstr}Universal: ${x}<br>`;
		}
	} else {
		x = (parseInt(myGet('UNIVERSAL_PENALTY', charid, 0))) * -5;
		if (x !== 0) {
			tot += x;
			targstr = `${targstr}Universal: ${x}<br>`;
		}
	}
	x = parseInt(myGet('ENCUMBRANCE', charid, 0)) * -5;
	if (x !== 0) {
		tot += x;
		targstr = `${targstr}Encumbrance: ${x}<br>`;
	}
	x = -1 * tables.hit_loc_penalty[loc]["penalty"];
	if (x !== 0) {
		tot += x;
		targstr = `${targstr}Location ${loc}: ${x}<br>`;
	}
	x = parseInt(mod);
	if (x !== 0) {
		tot += x;
		targstr = `${targstr}Situational Mod: ${x}<br>`;
	}
	var out = {}
	out['total'] = tot;
	out['targstr'] = `${targstr}</div>`;


	return out;
}



function getDodgeEML(toke, charid, mod = 0, bow = false) {
	var x = 0;
	var tot = parseInt(myGet(`DODGE_ML`, charid, 0));
	var targstr = `<div style='width:180px;'>Mastery Level: ${tot}<br>`;
	if (bow) {
		x = Math.round(tot / -2);
		tot += x;
		targstr = `${targstr}Bow Mod: ${x}<br>`;
	}
	if (toke.get('bar3_value')) {
		x = (parseInt(toke.get('bar3_value'))) * -5;
		if (x !== 0) {
			tot += x;
			targstr = `${targstr}Universal: ${x}<br>`;
		}
	} else {
		x = (parseInt(myGet('UNIVERSAL_PENALTY', charid, 0))) * -5;
		if (x !== 0) {
			tot += x;
			targstr = `${targstr}Universal: ${x}<br>`;
		}
	}
	x = parseInt(myGet('ENCUMBRANCE', charid, 0)) * -5;
	if (x !== 0) {
		tot += x;
		targstr = `${targstr}Encumbrance: ${x}<br>`;
	}
	x = parseInt(mod);
	if (x !== 0) {
		tot += x;
		targstr = `${targstr}Situational Mod: ${x}<br>`;
	}
	var out = {}
	out['total'] = tot;
	out['targstr'] = `${targstr}</div>`;


	return out;
}


function computeAttackML(ojn, charid, app, mod) {

	return parseInt(myGet(ojn.slice(0, -4) + "ML", charid, 0))
		+ parseInt(myGet(ojn.slice(0, -4) + "ATK", charid, 0))
		+ parseInt(myGet(ojn.slice(0, -4) + "HM", charid, 0))
		+ parseInt(mod) - (app);
}

function getSelectedPage(msg) {
	if (msg.selected) {
		var obj = getObj("graphic", msg.selected[0]['_id']);
		return obj.get("_pageid")
	} else {
		return getPlayerPage(msg.playerid)
	}
}

function getImpact(base, repeating_weapon_name, charid, aspect = "H", missi = null) {

	var out = {}
	var wepimpact = getWeaponImpact(repeating_weapon_name, charid, aspect, missi);
	out['impactstr'] = "";
	out['total'] = 0;

	var sides = 6;
	var bm = 0;

	var imd = "";
	var attribute = findObjs({
		type: 'attribute',
		characterid: charid,
		name: repeating_weapon_name + "NOTE"
	})[0]

	if (attribute) {
		imd = attribute.get('current');

	}

	if (imd.length > 0) {
		var t = imd.split(":!")

		if (t.length > 1) {
			var impactmod = t[1].split(":");
			if (impactmod.length == 1) {
				wepimpact.impact += parseInt(impactmod[0]);
				log("Impact mod: " + impactmod[0]);
			}
			if (impactmod.length == 3) {
				sides = parseInt(impactmod[1]);
				bm = parseInt(impactmod[2]);
				if (parseInt(impactmod[0]) > 0) {

					for (i = 0; i < parseInt(impactmod[0]); i++) {
						var ir = randomInteger(sides) + bm;
						out.total += ir;
						if (out.impactstr.length > 2) {
							out.impactstr += " + " + ir;
						} else {
							let bmExtra = ((bm !== 0) ? `+${bm}` : '');
							out.impactstr += `${base}+${impactmod[0]}(d${sides}${bmExtra}): ${ir}`;
						}
					}
				}
			}
		}
	}
	for (i = 0; i < base; i++) {
		var ir = randomInteger(sides) + bm;
		out.total += ir
		if (out.impactstr.length > 2) {
			out.impactstr += " + " + ir;

		} else {
			let bmExtra = ((bm !== 0) ? `+${bm}` : '');
			out.impactstr += `${base}(d${sides}${bmExtra}): ${ir}`;

		}
	}


	out.total += wepimpact.impact;
	out.impactstr += " + " + "<br>Weapon Impact: " + wepimpact.impact;
	out.aspect = wepimpact.aspect;
	return out;

}

function getWeaponImpact(repeating_weapon_name, charid, aspect = "H", missi = null) {
	var out = {};


	if (aspect == "H") {

		var baspect = myGet(`${repeating_weapon_name}B`, charid, 0)
		var easpect = myGet(`${repeating_weapon_name}E`, charid, 0)
		var paspect = myGet(`${repeating_weapon_name}P`, charid, 0)
		out['impact'] = 0;
		if (baspect !== "-") {
			out['impact'] = parseInt(baspect);
			out['aspect'] = "B";
		}
		if (easpect !== "-") {
			if (parseInt(easpect) >= out['impact']) {
				out['impact'] = parseInt(easpect);
				out['aspect'] = "E";
			}
		}
		if (paspect !== "-") {
			if (parseInt(paspect) >= out['impact']) {
				out['impact'] = parseInt(paspect);
				out['aspect'] = "P";
			}
		}
	} else {
		out['impact'] = parseInt(myGet(`${repeating_weapon_name}${aspect}`, charid, 0));
		out['aspect'] = aspect;
	}

	if (missi) {
		if (myGet(`${repeating_weapon_name}NAME`, charid, "") in tables.missile_range) {
			out.impact = missi[1];
		} else {
			out.impact = Math.round(out.impact * parseFloat(missi[1]))
		}
	}
	return out;

}

function getPlayerPage(player_id) {
	var psp = Campaign().get("playerspecificpages");
	if (psp) {
		if (player_id in psp) {
			return psp[player_id];
		} else {
			return Campaign().get("playerpageid");
		}
	} else {
		return Campaign().get("playerpageid");
	}
}


function determineSuccess(ml, roll) {
	if (roll <= ml) {
		if (roll % 5 == 0) {
			return { asuc: "CS", ais: 3 };
		} else {
			return { asuc: "MS", ais: 2 };
		}
	} else {
		if (roll % 5 !== 0) {
			return { asuc: "MF", ais: 1 };
		} else {
			return { asuc: "CF", ais: 0 };
		}
	}
}
function determineDefSuccess(ml, roll) {
	if (roll <= ml) {
		if (roll % 5 == 0) {
			return { dsuc: "CS", dis: 3 };
		} else {
			return { dsuc: "MS", dis: 2 };
		}
	} else {
		if (roll % 5 !== 0) {
			return { dsuc: "MF", dis: 1 };
		} else {
			return { dsuc: "CF", dis: 0 };
		}
	}
}


function findWeapon(charid, weaponname) {
	return filterObjs(function(obj) {
		obn = obj.get('name');
		if (obn) {
			if ((obn.indexOf("WEAPON_NAME")) !== -1
				&& (obj.get("_characterid") == charid)
				&& (obj.get("current") == weaponname)) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	});
}

function missileAttack(dist, wepname, atkmov, charid) {
	var missi = getrange(wepname, dist[0]);

	var app = -1 * missi[0];
	var appstr = `Missile Range: ${app}<br>`;

	if (atkmov < 5) {
		app = app + Math.round(parseInt(myGet('ENCUMBRANCE', charid, 0)) * 2.5);
		appstr = `${appstr}No Movement: ${Math.round(parseInt(myGet('ENCUMBRANCE', charid, 0)) * 2.5)}<br>`;
	}
	if (atkmov > 5) {
		app = app - 10;
		appstr = `${appstr}Movement: -10<br>`;
	}
	if (myGet('IS_MOUNTED', charid, 0) == 'on') {
		app = app - 10;
		appstr = `${appstr}Mounted: -10<br>`;
	}
	return { missi, app, appstr };
}


function charLog(character_id, text, rtime = false, gtime = false) {
	var logout = myGet("TEXTAREA_LOG", character_id, "");
	if (rtime) {
		var d = new Date();
		var n = d.toLocaleString();
		logout += n + ":  ";
	}
	if (gtime) { logout += getHarnTimeStr(state.MainGameNS.GameTime) + ": "; }
	mySet("TEXTAREA_LOG", character_id, logout + text + "\n")

}

function handle_pickskill(args, msg) {
	sendChat("Skill Improvement Roll", msg.content.slice(msg.content.indexOf(args[1]) + 21) + "<br>[Pick Skill](!improveskill " + args[1]
		+ " %{" + msg.content.slice(msg.content.indexOf(args[1]) + 21) + "|helper-tables.skilllist})")
}


function handle_improveskill(args, msg) {
	char = getObj("character", args[1]);
	skill_att_name = findSkill(char, args[2]);
	var d = new Date();
	var n = d.toLocaleString();
	var ml = parseInt(myGet(skill_att_name.slice(0, -4) + "ML", char.id, 0));

	roll = randomInteger(100) + parseInt(myGet(skill_att_name.slice(0, -4) + "SB", char.id, 0));
	if (roll >= ml) {
		mySet(skill_att_name.slice(0, -4) + "ML", char.id, (ml + 1));
		sendChat("Skill Improvement " + myGet("NAME", char.id, ""), "<br>"
			+ "<br>" + " roll " + roll + ": SUCCESS<br>" + args[2] + " ML increases to " + (ml + 1));
		charLog(char.id, ": Skill Improvement Roll: " + args[2] + " "
			+ roll + ": SUCCESS: ML = " + (ml + 1), config.realtime, config.gametime);
	} else {
		sendChat("Skill Improvement " + myGet("NAME", char.id, ""), "<br>" + args[2]
			+ "<br>" + " roll " + roll + ": FAIL<br> " + args[2] + " ML stays at " + ml);
		charLog(char.id, ": Skill Improvement Roll: " + args[2] + " "
			+ roll + ": FAIL: ML = " + ml, config.realtime, config.gametime);
	}
}


function rollshock(charid, token, unipenalty) {
	var shockstr = "";
	var shockroll = 0;
	for (i = 0; i < unipenalty; i++) {
		var ir = randomInteger(6);
		shockroll = shockroll + ir
		if (i > 0) {
			shockstr += " + " + ir;

		} else {
			shockstr += `${unipenalty}d6: ${ir}`;

		}
	}
	end = myGet("COMBAT_ENDURANCE", charid, 0);
	if (shockroll > end) {
	    sm = token.get("statusmarkers")
	    log(sm)
	    if (sm.length > 3) {
	        if (!sm.includes(config['shock_marker'])) {
	            sm =  sm + "," + config['shock_marker'];
	            token.set("statusmarkers", sm)
	        }
	    } else {
	        sm = config['shock_marker'];
	        token.set("statusmarkers", sm)
	    }
		//token.set("status_sleepy");
		return "<br/>Shock Roll: " + labelMaker(shockroll, shockstr) + "<br/><h4>FAIL</h4>";
	} else {
		return "<br/>Shock Roll: " + labelMaker(shockroll, shockstr) + "<br/>Pass";
	}

}

function handle_rollatts(args, msg) {
	var char = getObj("character", args[1]);
	var rolls = ["STR", "STA", "DEX", "AGL", "INT", "AUR", "WIL", "EYE",
		"HRG", "SML", "VOI", "CML", "FRAME"]
	_.each(rolls, function(attname) {
		var r = randomInteger(6) + randomInteger(6) + randomInteger(6);
		if (msg.content.indexOf("?") !== -1) {
			myGet(attname, char.id, r);
		} else {
			mySet(attname, char.id, r);
		}
	});

	_.each(tables.autoskills, function(skillname) {
		myGet(skillname, char.id, 1);

	});
}
function gethiteff(loc, effImp) {
	var lr = "None";
	if (effImp > 0) {
		var col = 4;
	}
	if (effImp > 4) {
		var col = 5;
	}
	if (effImp > 8) {
		var col = 6;
	}
	if (effImp > 12) {
		var col = 7;
	}
	if (effImp > 16) {
		var col = 8;
	}
	_.each(tables.hit_location_table, function(row) {
		if (row[3] == loc) {
			lr = row[col];
		}

	});

	return lr;
}

function gethitloc(roll, aim) {
	var lr;
	_.each(tables.hit_location_table, function(row) {
		if (row[aim] !== "-") {
			if (parseInt(row[aim].slice(0, 2)) <= roll) {
				lr = row[3];
				if (trace) { log(`location table ${row[aim]} hits ${row[3]}`) }
			}
		}

	});

	return lr;
}



function getCharByNameAtt(charname) {
	var attr = findObjs({
		current: charname,
		name: "NAME",
		_type: "attribute",
	})[0];
	if (attr) {
		return getObj("character", attr.get('_characterid'));
	} else {
		var tk = findObjs({
			name: charname,
			_type: "graphic",
		})[0];
		return getObj("character", tk.get('represents'));
	}
	
}


/**
 * Show help.
 * @param {Message} msg the message representing the command, with arguments separated by spaces
 */
function handle_help(args, msg) {
	if (trace) { log(`handle_help(${args},${msg.content})`) }
	if (args.length == 1) {
		var out = "<br/>";
		_.each(_.keys(dispatch_table), function(obj) {
			//out = `${out}${dispatch_table[obj]["hr_syntax"]}<br/>`;
			out += buttonMaker(`!help ${obj}`,obj,null,null,1) ;
		});
		sendChat("API Commands",out,null,{noarchive:true});
	}
	if (args.length == 2) {
		if (args[1] in dispatch_table) {
			var out = dispatch_table[args[1]]["hr_syntax"].replace(/\)/g, '&#41;').replace(/\]/g, '&#93;')
			sendChat(``,`  ${out}  `,null,{noarchive:true});
		} else {
			sendChat(args[1],"Not Found",null,{noarchive:true});
		}
	}
}


/**
 * Update the skill bonues of the active sheet.
 * @param {Message} msg the message representing the command, with arguments separated by spaces
 */
function handle_calcsb(args, msg) {
	if (trace) { log(`handle_calcsb(${args},${msg.content})`) }
	var char = getObj("character", args[1]);
	if (char) {
		calcSB(char, msg);
	}
}

/**
 * Allow the hand of god to tip the scales.
 * @param {Message} msg the message representing the command, with arguments separated by spaces
 */
function handle_cheat(args, msg) {
	if (trace) { log(`handle_cheat(${args},${msg.content})`) }
	if (playerIsGM(msg.playerid)) {
		state.MainGameNS["cheat"] = parseInt(msg.content.slice(6));
		log("cheat: " + msg.content.slice(6));
	}
}

/**
 * I do not know
 * @param {Message} msg the message representing the command, with arguments separated by spaces
 */
function handle_mapsend(args, msg) {
	if (trace) { log(`handle_mapsend(${args},${msg.content})`) }
	args = msg.content.substr(9).split(",");
	//TODO defensive programming
	var player = findObjs({
		type: 'player',
		_displayname: args[0]
	})[0];

	//TODO defensive programming
	var page = findObjs({
		type: 'page',
		name: args[1]
	})[0];

	var playerspecificpages = new Object();
	var pl = new Object();
	if (Campaign().get("playerspecificpages")) {
		playerspecificpages = Campaign().get("playerspecificpages");
		Campaign().set("playerspecificpages", false);
	}

	pl[player.id] = page.id;
	playerspecificpages = Object.assign(playerspecificpages, pl);
	log(playerspecificpages);
	Campaign().set("playerspecificpages", playerspecificpages);
}

/**
 * This command is obsolete now that we initialize item lists on startup.
 * @param {Message} msg the message representing the command, with arguments separated by spaces
 */
function handle_itemlist(args, msg) {
	if (trace) { log(`handle_itemlist(${args},${msg.content})`) }
	generate_tables(msg.playerid);
}

/**
 * Populates the character skills with occupation appropriate skills (and starting ML?)
 * @param {Message} msg the message representing the command, with arguments separated by spaces
 */
function handle_occupation(args, msg) {
	if (trace) { log(`handle_occupation(${args},${msg.content})`) }
	var char = getObj("character", args[1]);
	if (char) {
		log(msg.content.slice(33));
		var occ = myGet('OCCUPATION', char.id, "Farmer");
		if (occ in tables.occupational_skills) {
			_.each(tables.occupational_skills[occ], function(skl) {
				sk = skl.split("/");
				skn = findSkill(char, sk[0]).slice(0, -4);
				log(skn);
				mySet(skn + "ML", char.id, sk[1]);

			});
		}
	}
}
function handle_gmrand(args, msg) {
	if (trace) { log(`handle_gmrand(${args},${msg.content})`) }
	if (!msg.selected) { return; }
	//log(msg.selected);
	var objid = msg.selected[randomInteger(msg.selected.length) - 1];
	//log(objid['_id']);
	var obj = getObj("graphic", objid['_id']);
	sendGMPing(obj.get('left'), obj.get('top'), obj.get('pageid'), "", true);
	sendChat("Random Character", "/w gm " + obj.get('name'));
}

function handle_rand(args, msg) {
	if (trace) { log(`handle_rand(${args},${msg.content})`) }
	if (!msg.selected) { return; }
	//log(msg.selected);
	var objid = msg.selected[randomInteger(msg.selected.length) - 1];
	//log(objid['_id']);
	var obj = getObj("graphic", objid['_id']);
	sendPing(obj.get('left'), obj.get('top'), obj.get('pageid'), "", true);
	sendChat("Random Character", obj.get('name'));
	return { objid, obj };
}

function handle_addtime(args, msg) {
	if (trace) { log(`handle_addtime(${args},${msg.content})`) }
	state.MainGameNS.GameTime += parseInt(args[1]);
	sendChat("Timekeeper", getHarnTimeStr(state.MainGameNS.GameTime));
	//log(getHarnTimeStr(state.MainGameNS.GameTime));
}

function handle_settime(args, msg) {
	if (trace) { log(`handle_settime(${args},${msg.content})`) }
	setHarnTime(args);
	log(getHarnTimeStr(state.MainGameNS.GameTime));
}

function handle_time(args, msg) {
	if (trace) { log(`handle_time(${args},${msg.content})`) }
	log(getHarnTimeStr(state.MainGameNS.GameTime));
	initializeTables(0);
	if (trace) { log(`API table  : ${JSON.stringify(tables,null,4)}`) }
	sendChat("Timekeeper", getHarnTimeStr(state.MainGameNS.GameTime));
}

function handle_loc(args, msg) {
	if (trace) { log(`handle_loc(${args},${msg.content})`) }
	gethitloc(args[1], args[2]);
}

function handle_attack_melee_table(args, msg) {
	if (trace) { log(`handle_attack_melee_table(${args},${msg.content})`) }
	sendChat(msg.who, "Melee Attack Result<br/>" + tables.attack_melee[args[1]][args[2]][args[3]] + "<br/>");
}

function handle_out(args, msg) {
	if (trace) { log(`handle_out(${args},${msg.content})`) }
	var g = getObj(msg.selected[0]['_type'], msg.selected[0]['_id']);
	out(g.get("represents"));
}

/**
 * handle the tokemove command (no clue)
 * @param {Message} msg the message representing the command, with arguments separated by spaces
 */
function handle_tokemove(args, msg) {
	if (trace) { log(`handle_tokemove(${args},${msg.content})`) }
	if (args.length == 2) {
		var obj = getObj("graphic", args[1]);
		sendChat(msg.who, "Move = " + tokemove(obj));
	} else {
		log("Please select character");
	}
}

/**
 * handle the clearmove command (no clue)
 * @param {Message} msg the message representing the command, with arguments separated by spaces
 */
function handle_clearmove(args, msg) {
	if (trace) { log(`handle_clearmove(${args},${msg.content})`) }
	if (args.length == 2) {
		var obj = getObj("graphic", args[1]);
		obj.set('lastmove', obj.get('left') + ',' + obj.get('top'));
	} else {
		log("Please select character");
	}
}

/**
 * Adds item to inventory.
 * @param {Message} msg the message representing the command, with arguments separated by spaces
 */
function handle_addItem(args, msg) {
	if (trace) { log(`handle_addItem(${args},${msg.content})`) }
	if (args.length > 2) {
		log(msg.content.slice(30));
		addItem(args[1], msg.content.slice(30));
	} else {
		log("Please select character");
	}
}

/**
 * Calculate armor values (protection at locations).
 * @param {Message} msg the message representing the command, with arguments separated by spaces
 */
function handle_ca(args, msg) {
	if (trace) { log(`handle_ca(${args},${msg.content})`) }
	if (args.length > 1) {
		calcArmor(args[1]);
	}
	else if (msg.selected) {
		var g = getObj(msg.selected[0]['_type'], msg.selected[0]['_id']);

		if (g.get("represents")) {
			calcArmor(g.get("represents"));
		}
	} else {
		log("Please select character");
	}
}

/**
 * Import a character generated with HârnMaster Character Utility from https://www.lythia.com/game_aides/harnchar/
 * @param {Message} msg the message representing the command, with arguments separated by spaces
 */
function handle_xin(args, msg) {
	if (trace) { log(`handle_xin(${args},${msg.content})`) }
	if (args.length > 1) {
		log(args[1]);
		xin(args[1]);
	} else if (msg.selected) {
		var g = getObj(msg.selected[0]['_type'], msg.selected[0]['_id']);

		if (g.get("represents")) {
			xin(g.get("represents"));
		}

	} else {
		log("Please select character");
	}
}


/**
 * ?
 * @param {Message} msg the message representing the command, with arguments separated by spaces
 */
function handle_invin(args, msg) {
	if (trace) { log(`handle_invin(${args},${msg.content})`) }
	if (args.length > 1) {
		//log(args[1]);
		invin(args[1]);
	} else if (msg.selected) {
		var g = getObj(msg.selected[0]['_type'], msg.selected[0]['_id']);
		if (g.get("represents")) {
			invin(g.get("represents"));
		}
	} else {
		log("Please select character");
	}
}

/**
 * The command used for attacking without a selected token
 * @param {Message} msg the message representing the command, with arguments separated by spaces
 */
function handle_sheetattack(args, msg) {
	if (trace) { log(`handle_sheetattack(${args},${msg.content})`) }
	handle_attack(args, msg);
}

/**
 * Calculate distance between two tokens?.
 * @param {Message} msg the message representing the command, with arguments separated by spaces
 */
function handle_tokendis(args, msg) {
	if (trace) { log(`handle_tokendis(${args},${msg.content})`) }
	const startToken = getObj("graphic", args[1]);
	const endToken = getObj("graphic", args[2]);
	if (startToken != null && endToken != null) {
		dis = tokendistance(startToken, endToken);
		sendChat("Token Distance", dis[0] + " " + dis[1] + "<br/>");
	} else {
		sendChat("API", `unable to resolve ${args[1]} or ${args[2]}`);
	}
}

function initializeTables(playerid) {
	if (trace) { log(`>initializeTables(${playerid})`) }
	var gms = findObjs({ type: 'player' }).filter((p) => playerIsGM(p.id));
	var gmId;
	if (gms.length > 0) {
		gmId = gms[0].id;
	} else {
		log("error - no gm found")
		if (playerid != 0) {
			gmId = playerid
		} else {
			return;
		}
	}
	if (config.generate_item_list) {


		var out = "";
		var outarmor = "";
		var outweap = "";
		Object.keys(tables.prices).sort().forEach(function(k) {
			if (k in tables.weapons_table) {
				outweap += "|" + k;
			} else if (k.substr(0, k.lastIndexOf(",")) in tables.armor_coverage) {
				outarmor += "|" + k;
			} else {
				out += "|" + k;
			}
		});
		//log(out+"\n\n");
		out = out.replace(/,/g, "&#44;");
		out = "?{Item" + out + "}";
		var mac = findObjs({
			type: 'macro',
			playerid: gmId,
			name: 'helper-ItemList'
		})[0];
		if (mac) {
			mac.set('action', out);
		} else {
			createObj('macro', {
				name: 'helper-ItemList',
				visibleto: "all",
				action: out,
				playerid: gmId
			});
		}
		outweap = outweap.replace(/,/g, "&#44;");
		outweap = "?{Item" + outweap + "}";
		var mac = findObjs({
			type: 'macro',
			playerid: gmId,
			name: 'helper-WeaponList'
		})[0];
		if (mac) {
			log("registering #WeaponList");
			mac.set('action', outweap);
		} else {
			log("creating #WeaponList");
			createObj('macro', {
				name: 'helper-WeaponList',
				visibleto: "all",
				action: outweap,
				playerid: gmId
			});
		}
		outarmor = outarmor.replace(/,/g, "&#44;");
		outarmor = "?{Item" + outarmor + "}";
		var mac = findObjs({
			type: 'macro',
			playerid: gmId,
			name: 'helper-ArmorList'
		})[0];
		if (mac) {
			mac.set('action', outarmor);
		} else {
			createObj('macro', {
				name: 'helper-ArmorList',
				visibleto: "all",
				action: outarmor,
				playerid: gmId
			});
		}
	} else { if (trace) { log(`no item list`) } }
	_.each(_.keys(tables.default_macros), function(obj) {
		//if (trace) { log("macro: " + obj) }

		var out = tables.default_macros[obj];
		var mac = findObjs({
			type: 'macro',
			playerid: gmId,
			name: obj
		})[0];
		if (mac) {
			mac.set('action', out);
		} else {
			createObj('macro', {
				name: obj,
				visibleto: "all",
				action: out,
				playerid: gmId
			});
		}
	});

	var chars = findObjs({ _type: "character", });

	if (trace) log("Creating default character macros");
	chars.forEach(function(c) {
		//if (trace) log(`Character ${c.get("name")}`);
		setWeaponsList(c.id);
		setSkilllist(c.id);
		_.each(_.keys(tables.default_abilities), function(obj) {
			//if (trace) log(`Macro ${obj}`)
			var mac = findObjs({
				type: 'ability',
				_characterid: c.id,
				name: obj
			})[0];
			if (!mac) {
				//if (trace) log('registering');
				var out = tables.default_abilities[obj];
				createObj('ability', {
					name: obj,
					action: out,
					_characterid: c.id,
					istokenaction: true
				});
			}
		});
	});
	
	sendChat("Restart", getHarnTimeStr(state.MainGameNS.GameTime));

	if (trace) { log("<initializeTables()") }
	return;
}

function getWep(charid) {
	return filterObjs(function(obj) {
		obn = obj.get('name');
		if (obn) {
			if (obn.includes("WEAPON_NAME")
				&& (obj.get("_characterid") == charid)) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	});
}

function setWeaponsList(charid) {
	//if (trace) log("Macro helper-Weapons");
	var out2 = "";
	getWep(charid).forEach(function(w) {
		out2 += "|" + myGet(w.get('name'), charid, "");
	})
	out2 = out2.replace(/,/g, "&#44;");
	out2 = "?{Weapon" + out2 + "}";
	var mac = findObjs({
		type: 'ability',
		_characterid: charid,
		name: 'helper-Weapons'
	})[0];

	if (mac) {
		mac.set('action', out2);
	} else {
		createObj('ability', {
			name: 'helper-Weapons',
			action: out2,
			_characterid: charid
		});
	}



}

function setSkilllist(charid) {
	//if (trace) log("Macro helper-Skilllist");
	var out = "";
	var sl = skillList(charid);

	for (i = 0; i < sl.length; i++) {
		out += "|" + sl[i];
	}

	//log(out+"\n\n");
	out = out.replace(/,/g, "&#44;").replace(/\)/g, '&#41;');
	out = "?{Skills" + out + "}";
	var mac = findObjs({
		type: 'ability',
		_characterid: charid,
		name: 'helper-SkillList'
	})[0];
	if (mac) {
		mac.set('action', out);
	} else {
		createObj('ability', {
			name: 'helper-SkillList',
			action: out,
			_characterid: charid
		});
	}
}


function addinjury(loc, injstr, charid) {
	if ((injstr.indexOf("Fum") == 0) || (injstr.indexOf("Stu") == 0)) {
		var sev = injstr.slice(3, 4);
		var lvl = parseInt(injstr.slice(4, 5));
	} else {
		var sev = injstr.slice(0, 1);
		var lvl = parseInt(injstr.slice(1, 2))
	}
	var mid = makeid();

	mySet("repeating_injury_" + mid + "_INJURY_LOCATION", charid, loc);
	mySet("repeating_injury_" + mid + "_INJURY_SEVERITY", charid, sev);
	mySet("repeating_injury_" + mid + "_INJURY_LEVEL", charid, lvl);
	mySet("repeating_injury_" + mid + "_INJURY_HEALINGROLL", charid, "");
	mySet("repeating_injury_" + mid + "_INJURY_INFECTED", charid, 0);
	mySet("repeating_injury_" + mid + "_INJURY_INFECTED_FEEDBACK", charid, 0);

	return;
}



function getrange(weapname, dist) {
	if (!(weapname in tables.missile_range)) { weapname = "Melee"; }
	for (var i = 4; i >= 0; i--) {
		if ((tables.missile_range[weapname][i][0] * 5) > dist) {
			if (i == 0) {
				var penalty = config.missle_close_range_mod;
			} else {
				var penalty = (i - 1) * 20;
			}
			var impact = tables.missile_range[weapname][i][1];
		}
	}
	return [penalty, impact]
}



function handle_newturn(args, msg) {
	turnorder = [];

	var currentPageGraphics = findObjs({
		_pageid: getSelectedPage(msg),
		_type: "graphic",
	});

	_.each(currentPageGraphics, function(obj) {

		if (obj.get('represents').startsWith('-M') && (obj.get('layer') == 'objects') && !obj.get('status_skull')) {

			if (msg.selected) {
				for (i = 0; i < msg.selected.length; i++) {
					if (obj.id == msg.selected[i]["_id"]) {
						turnPush(obj);
					}
				}
			} else {
				turnPush(obj);
			}
		}
	});
	Campaign().set("turnorder", JSON.stringify(turnorder.sort((a, b) => (a.pr < b.pr) ? 1 : -1)));

	state.MainGameNS.GameTime += 10;
	sendChat("New Round", getHarnTimeStr(state.MainGameNS.GameTime));
}

function turnPush(obj) {
	if (obj.get('bar3_value')) {
		var pp = (parseInt(obj.get('bar3_value')) + parseInt(myGet('ENCUMBRANCE', obj.get("represents"), 0))) * 5;
	} else {
		var pp = (parseInt(myGet('UNIVERSAL_PENALTY', obj.get("represents"), 0)) + parseInt(myGet('ENCUMBRANCE', obj.get("represents"), 0))) * 5;
	}
	obj.set('lastmove', obj.get('left') + ',' + obj.get('top'))
    sm = obj.get("statusmarkers");
	if (sm.includes(config['shock_marker'])) {
		var initml = 0;
	} else {
		if (myGet("IS_MOUNTED", obj.get("represents"), 0) == "on") {
			var initml = Math.round(((parseInt(myGet("RIDING_ML", obj.get("represents"), 0)) + parseInt(myGet("STEED_INIT", obj.get("represents"), 0))) / 2) - pp + initRoll());
		} else {
			var initml = parseInt(myGet("INITIATIVE_ML", obj.get("represents"), 0)) - pp + initRoll();
		}
    initml = Math.max(initml, config.emlmin)
	}

	turnorder.push({
		id: obj.id,
		pr: initml,
		custom: ""
	});
}

function addWeapon(charid, weapon_name) {
	if (trace) { log("addWeapon(" + charid + ", " + weapon_name + ")") }
	if (weapon_name in tables.weapons_table) {

		var mid = makeid();
		mySet("repeating_weapon_" + mid + "_WEAPON_NAME", charid, weapon_name);
		if (weapon_name in tables.prices) { mySet("repeating_weapon_" + mid + "_WEAPON_WGT", charid, tables.prices[weapon_name]["weight"]); } else {
			mySet("repeating_weapon_" + mid + "_WEAPON_WGT", charid, 0);
		}
		mySet("repeating_weapon_" + mid + "_WEAPON_WQ", charid, tables.weapons_table[weapon_name][0]);
		mySet("repeating_weapon_" + mid + "_WEAPON_ATK", charid, tables.weapons_table[weapon_name][1]);
		mySet("repeating_weapon_" + mid + "_WEAPON_DEF", charid, tables.weapons_table[weapon_name][2]);
		mySet("repeating_weapon_" + mid + "_WEAPON_HM", charid, tables.weapons_table[weapon_name][3]);
		mySet("repeating_weapon_" + mid + "_WEAPON_B", charid, tables.weapons_table[weapon_name][4]);
		mySet("repeating_weapon_" + mid + "_WEAPON_E", charid, tables.weapons_table[weapon_name][5]);
		mySet("repeating_weapon_" + mid + "_WEAPON_P", charid, tables.weapons_table[weapon_name][6]);

		if (weapon_name.indexOf("Unarmed") == 0) {
			mySet("repeating_weapon_" + mid + "_WEAPON_ML", charid, myGet("UNARMED_ML", charid, 0));
		} else {
			var wepskill = filterObjs(function(obj) {
				obn = obj.get('name');
				if (obn) {
					if ((obn.indexOf("COMBATSKILL_NAME")) !== -1 && (obj.get("_characterid") == charid) && (weapon_name.indexOf(obj.get("current")) !== -1)) {
						return true;
					} else { return false; }
				} else { return false; }
			});

			if (wepskill[0]) {
				mySet("repeating_weapon_" + mid + "_WEAPON_ML", charid, myGet(wepskill[0].get('name').slice(0, -4) + "ML", charid, 0));
			}
		}
		mySet("repeating_weapon_" + mid + "_WEAPON_AML", charid, 0);
		mySet("repeating_weapon_" + mid + "_WEAPON_DML", charid, 0);
		mySet("repeating_weapon_" + mid + "_WEAPON_NOTE", charid, " ");
	}
	var mid = makeid();
	mySet("repeating_inventoryitems_" + mid + "_INVENTORY_NAME", charid, weapon_name);
	mySet("repeating_inventoryitems_" + mid + "_INVENTORY_TYPE", charid, "Weapon");
	mySet("repeating_inventoryitems_" + mid + "_INVENTORY_LOCATION", charid, "");
	mySet("repeating_inventoryitems_" + mid + "_INVENTORY_Q", charid, "0");
	mySet("repeating_inventoryitems_" + mid + "_INVENTORY_QUANTITY", charid, "1");
	mySet("repeating_inventoryitems_" + mid + "_INVENTORY_WORN", charid, "on");


	if (weapon_name in tables.prices) {
		mySet("repeating_inventoryitems_" + mid + "_INVENTORY_WGT", charid, tables.prices[weapon_name]["weight"]);
		mySet("repeating_inventoryitems_" + mid + "_INVENTORY_PRICE", charid, tables.prices[weapon_name]["price"]);
	} else {
		mySet("repeating_inventoryitems_" + mid + "_INVENTORY_WGT", charid, 0);
		mySet("repeating_inventoryitems_" + mid + "_INVENTORY_PRICE", charid, 0)
	}

}

function addItem(charid, item) {
	if (trace) { log("addItem(" + charid + ", " + item + ")") }
	if (item in tables.weapons_table) {
		addWeapon(charid, item);
	} else {
		var mid = makeid();
		mySet("repeating_inventoryitems_" + mid + "_INVENTORY_NAME", charid, item);
		if (item.substr(0, item.lastIndexOf(",")) in tables.armor_coverage) {
			mySet("repeating_inventoryitems_" + mid + "_INVENTORY_TYPE", charid, "Armor");
		} else {
			mySet("repeating_inventoryitems_" + mid + "_INVENTORY_TYPE", charid, "Item");
		}

		mySet("repeating_inventoryitems_" + mid + "_INVENTORY_NOTES", charid, "");
		mySet("repeating_inventoryitems_" + mid + "_INVENTORY_Q", charid, "0");
		mySet("repeating_inventoryitems_" + mid + "_INVENTORY_QUANTITY", charid, "1");
		mySet("repeating_inventoryitems_" + mid + "_INVENTORY_WORN", charid, "on");
		log(item)


		if (item in tables.prices) {
			mySet("repeating_inventoryitems_" + mid + "_INVENTORY_WGT", charid, tables.prices[item]["weight"]);
			mySet("repeating_inventoryitems_" + mid + "_INVENTORY_PRICE", charid, tables.prices[item]["price"]);
		} else {
			mySet("repeating_inventoryitems_" + mid + "_INVENTORY_WGT", charid, 0);
			mySet("repeating_inventoryitems_" + mid + "_INVENTORY_PRICE", charid, 0)
		}
	}
}

function addArmor(charid, item) {
	if (trace) { log("addIArmor(" + charid + ", " + item + ")") }
	var mid = makeid();
	mySet("repeating_inventoryitems_" + mid + "_INVENTORY_NAME", charid, item);
	mySet("repeating_inventoryitems_" + mid + "_INVENTORY_TYPE", charid, "Armor");
	mySet("repeating_inventoryitems_" + mid + "_INVENTORY_NOTES", charid, "");
	mySet("repeating_inventoryitems_" + mid + "_INVENTORY_Q", charid, "0");
	mySet("repeating_inventoryitems_" + mid + "_INVENTORY_QUANTITY", charid, "1");
	mySet("repeating_inventoryitems_" + mid + "_INVENTORY_WORN", charid, "on");


	if (item in tables.prices) {
		mySet("repeating_inventoryitems_" + mid + "_INVENTORY_WGT", charid, tables.prices[item]["weight"]);
		mySet("repeating_inventoryitems_" + mid + "_INVENTORY_PRICE", charid, tables.prices[item]["price"]);
	} else {
		mySet("repeating_inventoryitems_" + mid + "_INVENTORY_WGT", charid, 0);
		mySet("repeating_inventoryitems_" + mid + "_INVENTORY_PRICE", charid, 0)
	}
}

function calcArmor(charid) {

	var atts = filterObjs(function(obj) {
		obn = obj.get('name');
		if (obn) {
			if ((obn.indexOf("INVENTORY_NAME")) !== -1 && (obj.get("_characterid") == charid)) {
				return true;
			} else { return false; }
		} else { return false; }
	});



	var newa = tables.coverage2loc
	_.each(newa, function(ob1) {
		ob1["COV"] = "";
		ob1["AQ"] = 0;
		ob1["B"] = 0;
		ob1["E"] = 0;
		ob1["P"] = 0;
		ob1["F"] = 0;



	});
	_.each(atts, function(ob1) {


		var ojn = ob1.get('name');
		if (myGet(ojn.slice(0, -4) + "TYPE", charid, 0) == "Armor") {
			if (myGet(ojn.slice(0, -4) + "WORN", charid, 0) == "on") {
				ojv = ob1.get('current');
				if (ojv.slice(ojv.lastIndexOf(",") + 2) in tables.armor_prot) {

					var art = tables.armor_prot[ojv.slice(ojv.lastIndexOf(",") + 2)];

					if (ojv.slice(0, ojv.lastIndexOf(",")) in tables.armor_coverage) {
						var arl = tables.armor_coverage[ojv.slice(0, ojv.lastIndexOf(","))]["coverage"];
						for (var i = 0; i < arl.length; i++) {
							newa[arl[i]]["COV"] += " " + art[0];
							aq = parseInt(myGet(ojn.slice(0, -4) + "Q", charid, 0))
							newa[arl[i]]["AQ"] += aq;
							newa[arl[i]]["B"] += Math.max(parseInt(art[1]) + Math.min(aq, parseInt(art[1])), 1);
							newa[arl[i]]["E"] += Math.max(parseInt(art[2]) + Math.min(aq, parseInt(art[2])), 1);
							newa[arl[i]]["P"] += Math.max(parseInt(art[3]) + Math.min(aq, parseInt(art[3])), 1);
							newa[arl[i]]["F"] += Math.max(parseInt(art[4]) + Math.min(aq, parseInt(art[4])), 1);
						}
					}
				}
			}
		}
	});

	_.each(newa, function(ob1) {
		mySet(ob1["LOC"] + "_LAYERS", charid, ob1["COV"]);
		mySet(ob1["LOC"] + "_AQ", charid, ob1["AQ"]);
		mySet(ob1["LOC"] + "_B", charid, ob1["B"]);
		mySet(ob1["LOC"] + "_E", charid, ob1["E"]);
		mySet(ob1["LOC"] + "_P", charid, ob1["P"]);
		mySet(ob1["LOC"] + "_F", charid, ob1["F"]);

	});



}
function opad(num) {
	return ("0" + num).slice(-2);
}
function getHarnTimeStr(timef) {
	var year = Math.floor(timef / 31104000);
	var month = Math.floor((timef - (year * 31104000)) / 2592000) + 1;
	var mday = Math.floor((timef - (year * 31104000) - ((month - 1) * 2592000)) / 86400) + 1;
	var day = Math.floor((timef - (year * 31104000)) / 86400);
	var hour = Math.floor((timef - (year * 31104000) - (day * 86400)) / 3600);
	var minute = Math.floor((timef - (year * 31104000) - (day * 86400) - (hour * 3600)) / 60);
	var sec = Math.floor(timef - (year * 31104000) - (day * 86400) - (hour * 3600) - (minute * 60));
	return (year + 720).toString() + '-' + month.toString() + '(' + tables.months[(month - 1)] + ')-' + mday.toString() + ' ' + opad(hour.toString()) + ':' + opad(minute.toString()) + ':' + opad(sec.toString());

}
function setHarnTime(args) {
	var seconds = (parseFloat(args[1]) - 720) * 31104000;
	if (args[2]) {
		seconds = seconds + (parseFloat(args[2]) - 1) * 2592000;
	}
	if (args[3]) {
		seconds = seconds + (parseFloat(args[3]) - 1) * 86400;

	}
	if (args[4]) {
		seconds = seconds + parseFloat(args[4]) * 3600;

	}
	if (args[5]) {
		seconds = seconds + parseFloat(args[5]) * 60;

	}
	if (args[6]) {
		seconds = seconds + parseFloat(args[6]);

	}
	state.MainGameNS.GameTime = seconds;
	log(seconds);
}

function makeid() {
	var text = "-";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < 19; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}


function myGet(attname, tid, deft) {
	var attribute = findObjs({
		type: 'attribute',
		characterid: tid,
		name: attname
	})[0]
	if (!attribute) {
		attribute = createObj('attribute', {
			characterid: tid,
			name: attname,
			current: deft,
			max: ''
		});
	}

	return attribute.get('current');

}

function mySet(attname, tid, deft) {
	var attribute = findObjs({
		type: 'attribute',
		characterid: tid,
		name: attname
	})[0]
	if (!attribute) {
		attribute = createObj('attribute', {
			characterid: tid,
			name: attname,
			current: deft,
			max: ''
		});
	}
	attribute.set('current', deft);
}

function myGetmax(attname, tid, deft) {
	var attribute = findObjs({
		type: 'attribute',
		characterid: tid,
		name: attname
	})[0]
	if (!attribute) {
		attribute = createObj('attribute', {
			characterid: tid,
			name: attname,
			current: '',
			max: deft
		});
	}
	return attribute.get('max');
}

function mySetmax(attname, tid, deft) {
	var attribute = findObjs({
		type: 'attribute',
		characterid: tid,
		name: attname
	})[0]
	if (!attribute) {
		attribute = createObj('attribute', {
			characterid: tid,
			name: attname,
			current: '',
			max: deft
		});
	}
	attribute.set('max', deft);
}

function getIndex() {
	state.MainGameNS.index++
	return state.MainGameNS.index;
}
function tokemove(toke) {
	var curPage = getObj("page", toke.get("_pageid"));
	var curScale = curPage.get("scale_number"); // scale for 1 unit, eg. 1 unit = 5ft
	var lastmove = toke.get("lastmove");
	var moves = lastmove.split(",");

	var dis = 0;
	for (i = 2; i < moves.length - 1; i = i + 2) {
		dis = dis + pixel2dis(parseFloat(moves[i - 2]), parseFloat(moves[i - 1]), parseFloat(moves[i]), parseFloat(moves[i + 1]));
	}

	dis = dis + pixel2dis(parseFloat(moves[moves.length - 2]), parseFloat(moves[moves.length - 1]), parseFloat(toke.get("left")), parseFloat(toke.get("top")));
	dis = dis * curScale;
	dis = Math.round(dis * 10) / 10;
	return dis;
}
function pixel2dis(left1, top1, left2, top2) {
	var lDist = Math.abs(left1 - left2) / 70;
	var tDist = Math.abs(top1 - top2) / 70;
	var dist = 0;
	dist = Math.sqrt(lDist * lDist + tDist * tDist);
	return dist;
}
function tokendistance(token1, token2) {

	var curPage = getObj("page", token1.get("_pageid"));
	var curScale = curPage.get("scale_number"); // scale for 1 unit, eg. 1 unit = 5ft
	var curUnit = curPage.get("scale_units"); // ft, m, km, mi etc.
	var gridSize = 70;
	var lDist = Math.abs(token1.get("left") - token2.get("left")) / gridSize;
	var tDist = Math.abs(token1.get("top") - token2.get("top")) / gridSize;
	var dist = Math.sqrt(lDist * lDist + tDist * tDist);
	var distSQ = dist;

	dist = dist * curScale;
	dist = Math.round(dist * 10) / 10;
	return [dist, curUnit];
}


function skillList(charid) {

	var slist = [];

	slist.push.apply(slist, tables.autoskillsnames);

	var atts = findObjs({
		_characterid: charid,
		_type: "attribute",
	});

	_.each(atts, function(ob1) {

		ojn = ob1.get('name')
		ojv = ob1.get('current')

		if ((ojv) && (ojn.indexOf("SKILL_NAME") !== -1)) {
			_.each(_.keys(tables.skilllist), function(obj) {
				if (ojv.indexOf(obj) !== -1) {
					slist.push(ojv);
				}
			});
		}
	});
	return slist;
}




function findSkill(char, skillname) {

	var nameout = "False"
	if (skillname.toUpperCase() in tables.autoskills) {
		nameout = skillname.toUpperCase() + "_NAME"
	} else {
		var atts = findObjs({
			_characterid: char.id,
			_type: "attribute",
		});

		_.each(atts, function(ob1) {


			ojn = ob1.get('name')
			ojv = ob1.get('current')

			if (ojn.indexOf("SKILL_NAME") !== -1) {
				_.each(_.keys(tables.skilllist), function(obj) {
					if ((ojv.indexOf(obj) !== -1) && (skillname.indexOf(obj) !== -1)) {
						nameout = ojn;
					}
				});
			}
		});
	}
	if (nameout == "False") {

		_.each(_.keys(tables.skilllist), function(obj) {
			if (skillname.indexOf(obj) !== -1) {
				var mid = makeid();

				if (tables.skilllist[obj]["type"] == "PHYSICAL") {
					mySet("repeating_physicalskill_" + mid + "_PHYSICALSKILL_NAME", char.id, obj);
					mySet("repeating_physicalskill_" + mid + "_PHYSICALSKILL_SB", char.id, 0);
					mySet("repeating_physicalskill_" + mid + "_PHYSICALSKILL_ML", char.id, 0);
					nameout = "repeating_physicalskill_" + mid + "_PHYSICALSKILL_NAME";
				} else if (tables.skilllist[obj]["type"] == "LORE") {
					mySet("repeating_loreskill_" + mid + "_LORESKILL_NAME", char.id, obj);
					mySet("repeating_loreskill_" + mid + "_LORESKILL_SB", char.id, 0);
					mySet("repeating_loreskill_" + mid + "_LORESKILL_ML", char.id, 0);
					nameout = "repeating_loreskill_" + mid + "_LORESKILL_NAME";
				} else if (tables.skilllist[obj]["type"] == "MAGIC") {
					mySet("repeating_magicskill_" + mid + "_MAGICSKILL_NAME", char.id, obj);
					mySet("repeating_magicskill_" + mid + "_MAGICSKILL_SB", char.id, 0);
					mySet("repeating_magicskill_" + mid + "_MAGICSKILL_ML", char.id, 0);
					nameout = "repeating_magicskill_" + mid + "_MAGICSKILL_NAME";
				} else if (tables.skilllist[obj]["type"] == "COMBAT") {
					mySet("repeating_combatskill_" + mid + "_COMBATSKILL_NAME", char.id, obj);
					mySet("repeating_combatskill_" + mid + "_COMBATSKILL_SB", char.id, 0);
					mySet("repeating_combatskill_" + mid + "_COMBATSKILL_ML", char.id, 0);
					nameout = "repeating_combatskill_" + mid + "_COMBATSKILL_NAME";
				} else if (tables.skilllist[obj]["type"] == "COMMUNICATION") {
					mySet("repeating_communicationskill_" + mid + "_COMMUNICATIONSKILL_NAME", char.id, obj);
					mySet("repeating_communicationskill_" + mid + "_COMMUNICATIONSKILL_SB", char.id, 0);
					mySet("repeating_communicationskill_" + mid + "_COMMUNICATIONSKILL_ML", char.id, 0);
					nameout = "repeating_communicationskill_" + mid + "_COMMUNICATIONSKILL_NAME";
				} else if (tables.skilllist[obj]["type"] == "RITUAL") {
					mySet("repeating_ritualskill_" + mid + "_RITUALSKILL_NAME", char.id, obj);
					mySet("repeating_ritualskill_" + mid + "_RITUALSKILL_SB", char.id, 0);
					mySet("repeating_ritualskill_" + mid + "_RITUALSKILL_ML", char.id, 0);
					nameout = "repeating_ritualskill_" + mid + "_RITUALSKILL_NAME";
				}
			}
		});

	}

	return nameout;
}


function calcSB(char, msg) {


	var rolls = ["STR", "STA", "DEX", "AGL", "INT", "AUR", "WIL", "EYE", "HRG", "SML", "VOI", "CML", "FRAME"]
	_.each(rolls, function(attname) {
		var r = randomInteger(6) + randomInteger(6) + randomInteger(6);
		myGet(attname, char.id, r);
	});

	_.each(_.keys(tables.autoskills), function(skillname) {

		myGet(skillname + "_SB", char.id, 1);
	});



	var atts = findObjs({
		_characterid: char.id,
		_type: "attribute",
	});
	var sss = myGet('SUNSIGN', char.id, "Ulandus").split('-');

	_.each(atts, function(ob1) {


		ojn = ob1.get('name')
		ojv = ob1.get('current')

		if (ojn.indexOf("SKILL_NAME") !== -1) {

			_.each(_.keys(tables["skilllist"]), function(obj) {
				if (ojv.indexOf(obj) !== -1) {
					var sb = Math.round(((Number(myGet(tables.skilllist[obj]["sba"][0], char.id)) + Number(myGet(tables.skilllist[obj]["sba"][1], char.id)) + Number(myGet(tables.skilllist[obj]["sba"][2], char.id))) / 3));
					var sb1 = 0;
					var sb2 = 0;
					if (sss.length == 2) {

						if (sss[0].slice(0, 3) in tables.skilllist[obj]["ssm"]) {
							sb1 = Number(tables.skilllist[obj]["ssm"][sss[0].slice(0, 3)])
						}
						if (sss[1].slice(0, 3) in tables.skilllist[obj]["ssm"]) {
							sb2 = Number(tables.skilllist[obj]["ssm"][sss[1].slice(0, 3)])
						}
						if (sb1 > sb2) {
							sb += sb1;
						} else {
							sb += sb2;
						}

					} else {
						if (sss[0].slice(0, 3) in tables.skilllist[obj]["ssm"]) {
							sb = sb + Number(tables.skilllist[obj]["ssm"][sss[0].slice(0, 3)])
						}
					}

					log(obj + " - " + Math.round(sb))
					if (msg.content.indexOf("?") !== -1) {
						myGet(ojn.slice(0, -4) + "SB", char.id, sb);
					}
					else {
						mySet(ojn.slice(0, -4) + "SB", char.id, sb);
					}
					var ml = parseInt(myGet(ojn.slice(0, -4) + "ML", char.id, 0));

					if ((!ml) || (ml == 0)) {
						if (tables.skilllist[obj]["oml"]) {
							mySet(ojn.slice(0, -4) + "ML", char.id, (sb * parseInt(tables.skilllist[obj]["oml"])))
						}
					} else if ((parseInt(ml) > 0) && (parseInt(ml) < sb)) {
						if (tables.skilllist[obj]["oml"]) {
							mySet(ojn.slice(0, -4) + "ML", char.id, (sb * parseInt(ml)))
						}
					}
				}
			});
		}
		if (ojn.indexOf("_SB") !== -1) {

			_.each(_.keys(tables.skilllist), function(obj) {
				if (ojn.indexOf(obj) !== -1) {
					var sb = Math.round(((Number(myGet(tables.skilllist[obj]["sba"][0], char.id)) + Number(myGet(tables.skilllist[obj]["sba"][1], char.id)) + Number(myGet(tables.skilllist[obj]["sba"][2], char.id))) / 3));
					var sb1 = 0;
					var sb2 = 0;

					if (sss.length == 2) {
						if (sss[0].slice(0, 3) in tables.skilllist[obj]["ssm"]) {
							sb1 = Number(tables.skilllist[obj]["ssm"][sss[0].slice(0, 3)])
						}
						if (sss[1].slice(0, 3) in tables.skilllist[obj]["ssm"]) {
							sb2 = Number(tables.skilllist[obj]["ssm"][sss[1].slice(0, 3)])
						}
						if (sb1 > sb2) {
							sb += sb1
						} else {
							sb += sb2
						}
					} else {
						if (sss[0].slice(0, 3) in tables.skilllist[obj]["ssm"]) {
							sb = sb + Number(tables.skilllist[obj]["ssm"][sss[0].slice(0, 3)])
						}
					}
					if (msg.content.indexOf("?") !== -1) {
						myGet(ojn, char.id, sb);
					}
					else {
						mySet(ojn, char.id, sb);
					}
					var ml = parseInt(myGet(ojn.slice(0, -2) + "ML", char.id, 0));

					if ((!ml) || (ml == 0)) {
						if (tables.skilllist[obj]["oml"]) {
							mySet(ojn.slice(0, -2) + "ML", char.id, (sb * parseInt(tables.skilllist[obj]["oml"])))
						}
					} else if ((parseInt(ml) > 0) && (parseInt(ml) < sb)) {
						if (tables.skilllist[obj]["oml"]) {
							mySet(ojn.slice(0, -2) + "ML", char.id, (sb * parseInt(ml)))
						}
					}

				}

			});

		}

	});
	sendChat("API", "/w gm done calc SB");
}


function out(charid) {



	var atts = findObjs({
		_characterid: charid,
		_type: "attribute",

	});
	var has_spells=false;
	var has_rituals=false;
	var has_psi=false;
	log("=================================")
	var logout = myGet("NAME", charid, 0);
	logout += "\n    Strength    " + myGet("STR", charid, 0);
	logout += "    Agility   " + myGet("AGL", charid, 0);
	logout += "    Smell    " + myGet("SML", charid, 0);
	logout += "    Will    " + myGet("WIL", charid, 0);
	logout += "    Comeliness    " + myGet("CML", charid, 0);

	logout += "\n    Stamina    " + myGet("STA", charid, 0);
	logout += "    Eyesight    " + myGet("EYE", charid, 0);
	logout += "    Voice    " + myGet("VOI", charid, 0);
	logout += "    Aura    " + myGet("AUR", charid, 0);
	logout += "    Endurance    " + myGet("END", charid, 0);

	logout += "\n    Dexterity    " + myGet("DEX", charid, 0);
	logout += "    Hearing    " + myGet("HRG", charid, 0);
	logout += "    Intelligence    " + myGet("INT", charid, 0);
	logout += "    Morality    " + myGet("MORAL", charid, 0);
	logout += "    Move    10" ;
	logout += "\nSpecies:     	" + myGet("SPECIES", charid, 0);

	logout += "\nSex:         	" + myGet("GENDER", charid, 0);
	logout += "\nAge:         	" + myGet("AGE", charid, 0);
	logout += "\nBirth Month: 	" + myGet("BIRTHDATE", charid, 0).split()[0];
	logout += "\nBirth Day:   	" + myGet("BIRTHDATE", charid, 0).split()[1];
	logout += "\nBirth Year:  	" + myGet("BIRTHDATE", charid, 0).split()[2];
	logout += "\nSunSign:     	" + myGet("SUNSIGN", charid, 0);

	logout += "\nCulture:     	" + myGet("CULTURE", charid, 0);
	logout += "\nSocial Class:	" + myGet("SOCIAL_CLASS", charid, 0);
	logout += "\nSibling Rank:	" + myGet("SIBLING_RANK", charid, 0);
	logout += "\nSiblings:    	";
	logout += "\nParentage:   	" + myGet("PARENT", charid, 0);
	logout += "\nOffspring:   	";
	logout += "\nEstrangement:	" + myGet("ESTRANGEMENT", charid, 0);
	logout += "\nClanhead:    	" + myGet("CLANHEAD", charid, 0);


	logout += "\nHeight:      	" + myGet("HEIGHT", charid, 0);
	logout += "\nFrame:       	" + myGet("FRAME", charid, 0);
	logout += "\nWeight:      	" + myGet("WEIGHT", charid, 0);
	logout += "\nSize:        	";
	logout += "\nComeliness:  	" + myGet("CML", charid, 0);
	logout += "\nComplexion:  	" + myGet("COMPLEXION", charid, 0);
	logout += "\nHair Color:  	" + myGet("HAIR_COLORS", charid, 0);
	logout += "\nEye Color:   	" + myGet("EYE_COLOR", charid, 0);
	logout += "\nVoice:       	" + myGet("VOI", charid, 0);
	logout += "\n\nMedical:     	" + myGet("PHYSICAL", charid, 0);
	logout += "\n\nPsyche:      	" + myGet("MENTAL", charid, 0);
	logout += "\nDiety:       	" + myGet("DIETY", charid, 0);
	logout += "\nPiety:       	" + myGet("PIETY", charid, 0);

	logout += "\n\nOccupation:  	" + myGet("OCCUPATION", charid, 0);
	logout += "\n	Physical Skills:";
	logout += "\n		                      CLIMBING / " + myGet("CLIMBING_ML", charid, 0) + " (SB:" + myGet("CLIMBING_SB", charid, 0) + ")	 OML :0";
	logout += "\n		                      CONDITION / " + myGet("CONDITION_ML", charid, 0) + " (SB:" + myGet("CONDITION_SB", charid, 0) + ")	 OML :0";
	logout += "\n		                      JUMPING / " + myGet("JUMPING_ML", charid, 0) + " (SB:" + myGet("JUMPING_SB", charid, 0) + ")	 OML :0";
	logout += "\n		                      STEALTH / " + myGet("STEALTH_ML", charid, 0) + " (SB:" + myGet("STEALTH_SB", charid, 0) + ")	 OML :0";
	logout += "\n		                      THROWING / " + myGet("THROWING_ML", charid, 0) + " (SB:" + myGet("THROWING_SB", charid, 0) + ")	 OML :0";

	_.each(atts, function (ob1) {
		ojn = ob1.get('name')
		ojv = ob1.get('current')
		if (ojn.indexOf("PHYSICALSKILL_NAME") !== -1) {

			logout += "\n		                      "+ ojv +" / " + myGet(ojn.slice(0,-4)+"ML", charid, 0) + " (SB:" + myGet(ojn.slice(0,-4)+"SB", charid, 0) + ")	 OML :0";
		}
	});

	logout += "\n	Communications Skills:";
	logout += "\n		                      AWARENESS / " + myGet("AWARENESS_ML", charid, 0) + " (SB:" + myGet("AWARENESS_SB", charid, 0) + ")	 OML :0";
	logout += "\n		                      INTRIGUE / " + myGet("INTRIGUE_ML", charid, 0) + " (SB:" + myGet("INTRIGUE_SB", charid, 0) + ")	 OML :0";
	logout += "\n		                      ORATORY / " + myGet("ORATORY_ML", charid, 0) + " (SB:" + myGet("ORATORY_SB", charid, 0) + ")	 OML :0";
	logout += "\n		                      RHETORIC / " + myGet("RHETORIC_ML", charid, 0) + " (SB:" + myGet("RHETORIC_SB", charid, 0) + ")	 OML :0";
	logout += "\n		                      SINGING / " + myGet("SINGING_ML", charid, 0) + " (SB:" + myGet("SINGING_SB", charid, 0) + ")	 OML :0";
	_.each(atts, function (ob1) {
		ojn = ob1.get('name')
		ojv = ob1.get('current')
		if (ojn.indexOf("COMMUNICATIONSKILL_NAME") !== -1) {

			logout += "\n		                      "+ ojv +" / " + myGet(ojn.slice(0,-4)+"ML", charid, 0) + " (SB:" + myGet(ojn.slice(0,-4)+"SB", charid, 0) + ")	 OML :0";
		}
	});
	
	logout += "\n	Combat Skills:";
	logout += "\n		                      INITIATIVE / " + myGet("INITIATIVE_ML", charid, 0) + " (SB:" + myGet("INITIATIVE_SB", charid, 0) + ")	 OML :0";
	logout += "\n		                      UNARMED / " + myGet("UNARMED_ML", charid, 0) + " (SB:" + myGet("UNARMED_SB", charid, 0) + ")	 OML :0";
	
	_.each(atts, function (ob1) {
		ojn = ob1.get('name')
		ojv = ob1.get('current')
		if (ojn.indexOf("COMBATSKILL_NAME") !== -1) {

			logout += "\n		                      "+ ojv +" / " + myGet(ojn.slice(0,-4)+"ML", charid, 0) + " (SB:" + myGet(ojn.slice(0,-4)+"SB", charid, 0) + ")	 OML :0";
		}
	});

	logout += "\n	Crafts & Lore Skills:";
	_.each(atts, function (ob1) {
		ojn = ob1.get('name')
		ojv = ob1.get('current')
		if (ojn.indexOf("LORESKILL_NAME") !== -1) {

			logout += "\n		                      "+ ojv +" / " + myGet(ojn.slice(0,-4)+"ML", charid, 0) + " (SB:" + myGet(ojn.slice(0,-4)+"SB", charid, 0) + ")	 OML :0";
		}
		if (ojn.indexOf("MAGICSKILL_NAME") !== -1) {has_spells=true};
		if (ojn.indexOf("RITUALSKILL_NAME") !== -1) {has_rituals=true};
		if (ojn.indexOf("TALENT_NAME") !== -1) {has_psi=true};
	});


	logout += "\n	Convocaton Skills:";
	if (has_spells) {
		_.each(atts, function (ob1) {
			ojn = ob1.get('name')
			ojv = ob1.get('current')
			if (ojn.indexOf("MAGICSKILL_NAME") !== -1) {

				logout += "\n		                      "+ ojv +" / " + myGet(ojn.slice(0,-4)+"ML", charid, 0) + " (SB:" + myGet(ojn.slice(0,-4)+"SB", charid, 0) + ")	 OML :0";
			}
		});
	} else {
		logout += "\n		                          --none--";
	}

	logout += "\n	Psionics Skills:";
	if (has_psi) {
		_.each(atts, function (ob1) {
			ojn = ob1.get('name')
			ojv = ob1.get('current')
			if (ojn.indexOf("TALENT_NAME") !== -1) {

				logout += "\n		                      "+ ojv +" / " + myGet(ojn.slice(0,-4)+"EML", charid, 0) + " (SB:0)	 OML :0";
			}
		});
	} else {
		logout += "\n		                          --none--";
	}

	logout += "\n	Ritual Skills:";
	if (has_rituals) {
		_.each(atts, function (ob1) {
			ojn = ob1.get('name')
			ojv = ob1.get('current')
			if (ojn.indexOf("RITUALSKILL_NAME") !== -1) {

				logout += "\n		                      "+ ojv +" / " + myGet(ojn.slice(0,-4)+"ML", charid, 0) + " (SB:" + myGet(ojn.slice(0,-4)+"SB", charid, 0) + ")	 OML :0";
			}
		});
	} else {
		logout += "\n		                          --none--";
	}
	if (has_spells) {
	logout += "\n    Spells:";
	
		_.each(atts, function (ob1) {
			ojn = ob1.get('name')
			ojv = ob1.get('current')
			if (ojn.indexOf("SPELL_NAME") !== -1) {

				logout += "\n		                      "+ ojv +"/" + myGet(ojn.slice(0,-4)+"LEVEL", charid, 0);
			}
		});
	} 

	if (has_rituals) {
	logout += "\n	Invocations:";
	
		_.each(atts, function (ob1) {
			ojn = ob1.get('name')
			ojv = ob1.get('current')
			if (ojn.indexOf("RITUAL_NAME") !== -1) {

				logout += "\n		                      "+ ojv +"/" + myGet(ojn.slice(0,-4)+"LEVEL", charid, 0);
			}
		});
	} 
	logout += "\n\nMoney:	      			0d\nEquipment:"


	_.each(atts, function (ob1) {
		ojn = ob1.get('name')
		ojv = ob1.get('current')
		if (ojn.indexOf("INVENTORY_NAME") !== -1) {
			logout += "\n   	             	" + ojv
		}

	});
	mySet("TEXTAREA_LOG", charid, logout)
}
function invin(charid) {
	
	var atts = findObjs({
		_characterid: charid,
		_type: "attribute",
		name: "TEXTAREA_NOTE"
	});

	if (atts[0]) {
		log("=================================")
		ojv = atts[0].get('current');
		if (ojv.length > 3) {
			ojv = ojv.replace(/\t/g, "")
			for (i = 0; i < 5; i++) {
				ojv = ojv.replace(/  /g, " ")
			}

			ojv = ojv.replace(/\n /g, "\n");
			lns = ojv.split("\n");

			for(xi=0;xi<lns.length;xi++) {
				if (lns[xi].length > 2) { addItem(charid, lns[xi]); }
			}
		}
	}
}
function xin(charid) {
	var char = getObj("character", charid);
	var atts = findObjs({
		_characterid: charid,
		_type: "attribute",
		name: "TEXTAREA_NOTE"
	});

	if (atts[0]) {
		log("=================================")
		ojv = atts[0].get('current');
		//log(atts[0]);
		if (ojv.length > 100) {
			ojv = ojv.replace(/\t/g, "")
			for (i = 0; i < 10; i++) {
				ojv = ojv.replace(/  /g, " ")
			}

			ojv = ojv.replace(/\n /g, "\n");
			ojv = ojv.replace(/\nOffspring:/g, "");
			ojv = ojv.replace(/\nOrphan:/g, "");
			lns = ojv.split("\n");



			var tv = lns[1].split(" ");
			if (tv[0] !== "Strength") {
				log("no");
			} else {
				mySet("NAME", charid, lns[0]);
				mySet("STR", charid, parseInt(tv[1]));
				mySet("AGL", charid, parseInt(tv[3]));
				mySet("SML", charid, parseInt(tv[5]));
				mySet("WIL", charid, parseInt(tv[7]));
				mySet("CML", charid, parseInt(tv[9]));
				var tv = lns[2].split(" ");
				mySet("STA", charid, parseInt(tv[1]));
				mySet("EYE", charid, parseInt(tv[3]));
				mySet("VOI", charid, parseInt(tv[5]));
				mySet("AUR", charid, parseInt(tv[7]));
				mySet("END", charid, parseInt(tv[9]));
				var tv = lns[3].split(" ");
				mySet("DEX", charid, parseInt(tv[1]));
				mySet("HRG", charid, parseInt(tv[3]));
				mySet("INT", charid, parseInt(tv[5]));
				mySet("MORAL", charid, parseInt(tv[7]));
				mySet("SPECIES", charid, lns[4].slice(9));

				mySet("GENDER", charid, lns[5].slice(5));
				mySet("BIRTHDATE", charid, (lns[7].slice(12) + " " + lns[8].slice(11) + ", " + lns[9].slice(12)));
				mySet("SUNSIGN", charid, lns[10].slice(10, -1));
				mySet("AGE", charid, lns[6].slice(5));
				mySet("PIETY", charid, lns[28].slice(7));
				mySet("HEIGHT", charid, lns[18].slice(8));
				mySet("FRAME", charid, lns[19].slice(7));
				mySet("WEIGHT", charid, lns[20].slice(8));
				mySet("COMPLEXION", charid, lns[23].slice(12));
				mySet("HAIR_COLORS", charid, lns[24].slice(12));
				mySet("EYE_COLOR", charid, lns[25].slice(11));
				mySet("CULTURE", charid, lns[11].slice(9));
				mySet("SOCIAL_CLASS", charid, lns[12].slice(13));
				mySet("SIBLING_RANK", charid, lns[13].slice(13));
				mySet("PARENT", charid, lns[15].slice(11));
				mySet("ESTRANGEMENT", charid, lns[16].slice(13));
				mySet("CLANHEAD", charid, lns[17].slice(10));





				var xi = 26;
				while (lns[xi].indexOf("Physical Skills:") == -1) {
					if (lns[xi].indexOf("Occupation:") !== -1) {
						char.set("name", lns[xi].slice(12) + getIndex())
						mySet("OCCUPATION", charid, lns[xi].slice(12));
					}
					if (lns[xi].indexOf("Medical:") !== -1) {
						mySet("PHYSICAL", charid, lns[xi].slice(9));
					}
					if (lns[xi].indexOf("Psyche:") !== -1) {
						mySet("MENTAL", charid, lns[xi].slice(8));
					}
					if (lns[xi].indexOf("Diety:") !== -1) {
						mySet("DIETY", charid, lns[xi].slice(7));
						var diety = lns[xi].slice(7);
					}
					if (lns[xi].indexOf("Piety:") !== -1) {
						mySet("PIETY", charid, lns[xi].slice(7));
					}

					xi++;
				}
				xi++;

				while (lns[xi] !== "Communications Skills:") {
					tv = lns[xi].replace(/ /g, "").split("/");
					if (tv.length > 1) {
						if (tv[0] in tables.autoskills) {
							tv2 = tv[1].split("(SB:");
							tv3 = tv2[1].split(")OML:");
							mySet(tv[0] + "_SB", charid, tv3[0])
							mySet(tv[0] + "_ML", charid, tv2[0])


						} else {
							var tv2 = tv[1].split("(SB:");
							var tv3 = tv2[1].split(")OML:");
							var mid = makeid();
							mySet("repeating_physicalskill_" + mid + "_PHYSICALSKILL_NAME", charid, tv[0]);
							mySet("repeating_physicalskill_" + mid + "_PHYSICALSKILL_SB", charid, tv3[0]);
							mySet("repeating_physicalskill_" + mid + "_PHYSICALSKILL_ML", charid, tv2[0]);
						}
					}
					xi++
				}


				xi++;
				while (lns[xi] !== "Combat Skills:") {
					var stv = lns[xi].replace(/ /g, "")
					var tv = stv.split("/");
					if (tv.length > 1) {
						if (tv[0] in tables.autoskills) {
							var tv2 = tv[1].split("(SB:");
							var tv3 = tv2[1].split(")OML:");
							mySet(tv[0] + "_SB", charid, tv3[0])
							mySet(tv[0] + "_ML", charid, tv2[0])

						} else {
							var tv2 = tv[1].split("(SB:");
							var tv3 = tv2[1].split(")OML:");
							var mid = makeid();
							mySet("repeating_communicationskill_" + mid + "_COMMUNICATIONSKILL_NAME", charid, tv[0]);
							mySet("repeating_communicationskill_" + mid + "_COMMUNICATIONSKILL_SB", charid, tv3[0]);
							mySet("repeating_communicationskill_" + mid + "_COMMUNICATIONSKILL_ML", charid, tv2[0]);
						}
					}
					xi++
				}

				xi++;
				while (lns[xi] !== "Crafts & Lore Skills:") {
					tv = lns[xi].replace(/ /g, "").split("/");
					if (tv.length > 1) {
						if (tv[0] in tables.autoskills) {
							tv2 = tv[1].split("(SB:");
							tv3 = tv2[1].split(")OML:");
							mySet(tv[0] + "_SB", charid, tv3[0])
							mySet(tv[0] + "_ML", charid, tv2[0])


						} else {
							var tv2 = tv[1].split("(SB:");
							var tv3 = tv2[1].split(")OML:");
							var mid = makeid();
							mySet("repeating_combatskill_" + mid + "_COMBATSKILL_NAME", charid, tv[0]);
							mySet("repeating_combatskill_" + mid + "_COMBATSKILL_SB", charid, tv3[0]);
							mySet("repeating_combatskill_" + mid + "_COMBATSKILL_ML", charid, tv2[0]);
						}
					}
					xi++
				}


				xi++;


				while (lns[xi] !== "Convocaton Skills:") {
					tv = lns[xi].replace(/ /g, "").split("/");

					if (tv.length > 1) {
						var tv2 = tv[1].split("(SB:");
						var tv3 = tv2[1].split(")OML:");
						var mid = makeid();
						mySet("repeating_loreskill_" + mid + "_LORESKILL_NAME", charid, tv[0]);
						mySet("repeating_loreskill_" + mid + "_LORESKILL_SB", charid, tv3[0]);
						mySet("repeating_loreskill_" + mid + "_LORESKILL_ML", charid, tv2[0]);
					}
					xi++
				}

				xi++;

				while (lns[xi] !== "Psionics Skills:") {
					tv = lns[xi].replace(/ /g, "").split("/");

					if (tv.length > 1) {
						var tv2 = tv[1].split("(SB:");
						var tv3 = tv2[1].split(")OML:");
						var mid = makeid();
						mySet("repeating_magicskill_" + mid + "_MAGICSKILL_NAME", charid, tv[0]);
						mySet("repeating_magicskill_" + mid + "_MAGICSKILL_SB", charid, tv3[0]);
						mySet("repeating_magicskill_" + mid + "_MAGICSKILL_ML", charid, tv2[0]);
					}
					xi++
				}

				xi++;


				while (lns[xi] !== "Ritual Skills:") {
					tv = lns[xi].replace(/ /g, "").split("/");
					if (tv.length > 1) {
						var tv2 = tv[1].split("(SB:");
						var tv3 = tv2[1].split(")OML:");
						var mid = makeid();
						mySet("repeating_psionics_" + mid + "_TALENT_NAME", charid, tv[0]);
						mySet("repeating_psionics_" + mid + "_TALENT_FATIGUE", charid, "0");
						mySet("repeating_psionics_" + mid + "_TALENT_TIME", charid, "0");
						mySet("repeating_psionics_" + mid + "_TALENT_EML", charid, tv2[0]);
						mySet("repeating_psionics_" + mid + "_TALENT_NOTE", charid, lns[xi]);

					}


					xi++
				}

				xi++;

				while ((lns[xi].slice(0, 6) !== "Money:") && (lns[xi].slice(0, 7) !== "Spells:") && (lns[xi].slice(0, 12) !== "Invocations:")) {
					tv = lns[xi].replace(/ /g, "").split("/");

					if (tv.length > 1) {
						var tv2 = tv[1].split("(SB:");
						var tv3 = tv2[1].split(")OML:");
						var mid = makeid();
						mySet("repeating_ritualskill_" + mid + "_RITUALSKILL_NAME", charid, tv[0]);
						mySet("repeating_ritualskill_" + mid + "_RITUALSKILL_SB", charid, tv3[0]);
						mySet("repeating_ritualskill_" + mid + "_RITUALSKILL_ML", charid, tv2[0]);
					}


					xi++
				}
				if (lns[xi].slice(0, 12) == "Invocations:") {
					lns[xi] = lns[xi].slice(12);
					while (lns[xi].slice(0, 6) !== "Money:") {
						tv = lns[xi].split("/");
						if (tv.length > 1) {

							var mid = makeid();
							mySet("repeating_rituals_" + mid + "_RITUAL_NAME", charid, tv[0]);
							mySet("repeating_rituals_" + mid + "_RITUAL_RELIGION", charid, diety);
							mySet("repeating_rituals_" + mid + "_RITUAL_LEVEL", charid, tv[1]);
							mySet("repeating_rituals_" + mid + "_RITUAL_ML", charid, 0);
							mySet("repeating_rituals_" + mid + "_RITUAL_EML", charid, 0);
							mySet("repeating_rituals_" + mid + "_RITUAL_NOTE", charid, lns[xi]);

						}


						xi++
					}

				}
				if (lns[xi].slice(0, 7) == "Spells:") {
					lns[xi] = lns[xi].slice(7);
					while (lns[xi].slice(0, 6) !== "Money:") {
						tv = lns[xi].split("/");
						if (tv.length > 1) {

							var mid = makeid();
							mySet("repeating_spells_" + mid + "_SPELL_NAME", charid, tv[0]);
							mySet("repeating_spells_" + mid + "_SPELL_CONVOCATION", charid, "");
							mySet("repeating_spells_" + mid + "_SPELL_LEVEL", charid, tv[1]);
							mySet("repeating_spells_" + mid + "_SPELL_ML", charid, 0);
							mySet("repeating_spells_" + mid + "_SPELL_EML", charid, 0);
							mySet("repeating_spells_" + mid + "_SPELL_NOTE", charid, "");


						}


						xi++
					}

				}
				if (lns[xi].slice(0, 6) == "Money:") {
					var mid = makeid();
					mySet("repeating_inventoryitems_" + mid + "_INVENTORY_NAME", charid, lns[xi]);
					mySet("repeating_inventoryitems_" + mid + "_INVENTORY_WGT", charid, parseFloat(lns[xi].split(":")[1].slice(0, -1)) / 240);
				}
				xi++;
				if (lns[xi].slice(0, 15) == "Clothing/Armor:") {
					lns[xi] = lns[xi].slice(16);
					while ((lns[xi].slice(0, 8) !== "Weapons:") && (lns[xi].slice(0, 6) !== "Notes:")) {
						addItem(charid, lns[xi]);
						xi++;


					}

				}

				if (lns[xi].slice(0, 8) == "Weapons:") {
					lns[xi] = lns[xi].slice(9);
					while ((lns[xi].slice(0, 10) !== "Equipment:") && (lns[xi].slice(0, 6) !== "Notes:")) {
						addWeapon(charid, lns[xi]);
						xi++;
					}


				}

				if (lns[xi].slice(0, 10) == "Equipment:") {
					lns[xi] = lns[xi].slice(11);
					while (lns[xi].slice(0, 6) !== "Notes:") {
						addItem(charid, lns[xi]);

						xi++;


					}
				}
			}
		}
	}
}




function replaceArg(acom, msg) {
	var args = msg.content.split(" ");
	for (var i = 0; i < acom.length; i++) {
		if (acom[i].indexOf('args') == 0) {
			acom[i] = args[parseInt(acom[i].substr(4))];

		}
		if (acom[i].indexOf('inline') == 0) {
			acom[i] = msg.inlinerolls[parseInt(acom[i].substr(6))].results.total;
		}

	}
	return acom;

}


function handle_table(args, msg) {
	var scdata = findObjs({
		name: args[1],
		_type: "handout",
	})[0];
	scdata.get("notes", function(scda) {

		var tt1 = scda.substring(22, scda.indexOf('</td></tr></tbody></table>'));
		var tt2 = tt1.split('</td></tr><tr><td>');
		var tt3 = [];
		for (var i = 0; i < tt2.length; i++) {
			tt3[i] = tt2[i].split('</td><td>')
		}
		log("p")
		var r1 = msg.inlinerolls[0].results.total;
		var r2 = msg.inlinerolls[1].results.total;
		var i1 = tt3.length - 1;
		var i2 = tt3[0].length - 1;
		for (var i = 2; i < tt3.length; i++) {
			if (r1 <= parseInt(tt3[i][0])) {
				i1 = i;
				break;
			}
		}
		for (var i = 1; i < tt3[0].length; i++) {
			if (r2 <= parseInt(tt3[0][i])) {
				i2 = i;
				break;
			}
		}
		var description = tt3[i1][i2].split(';');
		var out = '&{template:default} {{name=' + args[1] + '}} {{Rolls=' + r1.toString() + ' ' + r2.toString() + '}} {{' + tt3[1][i2] + '= ' + description[0] + '}}';
		sendChat(msg.who, out);
		if (args[4] && description[1]) {
			log(args[4]);
			for (var i = 1; i < description.length; i++) {
				commandLine = replaceArg(description[i].split(' '), msg);
				if (commandLine[0] == 'add') {
					if (Number(commandLine[2])) {
						var newVal = Number(myGet(commandLine[1], args[4], 0)) + Number(commandLine[2]);
					} else {
						var newVal = myGet(commandLine[1], args[4], 0) + " " + commandLine[2];
					}
					mySet(commandLine[1], args[4], newVal);
				}
				if (commandLine[0] == 'addmax') {
					var newVal = Number(myGetmax(commandLine[1], args[4], 0)) + Number(commandLine[2]);
					mySetmax(commandLine[1], args[4], newVal);
				}
				if (commandLine[0] == 'set') {
					mySet(commandLine[1], args[4], commandLine[2]);
					log(commandLine[1]);
				}
				if (commandLine[0] == 'setmax') {
					mySet(commandLine[1], args[4], commandLine[2]);
				}
				if (commandLine[0] == 'say') {
					var out = commandLine[1];
					for (var j = 2; j < commandLine.length; j++) {
						out = out + ' ' + commandLine[j];
					}

					sendChat(args[1], out);
				}
			}
		}
	});
}


function chatParser(msg) {

	// check for and log crits
	if (msg.content.startsWith(" {{character_name=")) {
		var char = getCharByNameAtt(msg.content.slice((msg.content.indexOf("character_name") + 15), msg.content.indexOf("}} ")));
		if (char) {
			var d = new Date();
			var n = d.toLocaleString();
			if (msg.content.includes("rolldesc=rolls ")) {
				if (msg.inlinerolls[3].results.total % 5 == 0) {
	
					if (msg.inlinerolls[1].results.total >= msg.inlinerolls[3].results.total) {
						charLog(char.id, ": CS "
							+ msg.content.slice(msg.content.indexOf("rolldesc=rolls ") + 15,
								msg.content.indexOf("}} ", msg.content.indexOf("rolldesc=rolls "))), config.realtime, config.gametime)
					} else {
						charLog(char.id, ": CF "
							+ msg.content.slice(msg.content.indexOf("rolldesc=rolls ") + 15,
								msg.content.indexOf("}} ", msg.content.indexOf("rolldesc=rolls "))), config.realtime, config.gametime)
					}
				}
			} else if (msg.content.includes("rolldesc=performs ")) {
				if (msg.inlinerolls[7].results.total % 5 == 0) {
	
					if (msg.inlinerolls[4].results.total >= msg.inlinerolls[7].results.total) {
						charLog(char.id, ": CS "
							+ msg.content.slice(msg.content.indexOf("rolldesc=performs ") + 18,
								msg.content.indexOf("}} ", msg.content.indexOf("rolldesc=performs "))), config.realtime, config.gametime)
					} else {
						charLog(char.id, ": CF "
							+ msg.content.slice(msg.content.indexOf("rolldesc=performs ") + 18,
								msg.content.indexOf("}} ", msg.content.indexOf("rolldesc=performs "))), config.realtime, config.gametime)
					}
				}
			} else if (msg.content.includes("rolldesc=casts ")) {
				if (msg.inlinerolls[7].results.total % 5 == 0) {
	
					if (msg.inlinerolls[4].results.total >= msg.inlinerolls[7].results.total) {
						charLog(char.id, ": CS "
							+ msg.content.slice(msg.content.indexOf("rolldesc=casts ") + 15,
								msg.content.indexOf("}} ", msg.content.indexOf("rolldesc=casts "))), config.realtime, config.gametime)
					} else {
						charLog(char.id, ": CF "
							+ msg.content.slice(msg.content.indexOf("rolldesc=casts ") + 15,
								msg.content.indexOf("}} ", msg.content.indexOf("rolldesc=casts "))), config.realtime, config.gametime)
					}
				}
			}
		}
	}
}

function doHit(base, atkrepwep, acharid, dcharid, aspect, missi, loc, atktoke, deftoke) {


	var atk_impact = getImpact(base, atkrepwep, acharid, aspect, missi);


	var hitloc = gethitloc(randomInteger(100), tables.hit_loc_penalty[loc]["index"]);

	var avatloc = myGet(hitloc + "_" + atk_impact.aspect, dcharid, 0);

	var out = "<br/>" + atktoke.get('name') + " damages " + deftoke.get('name') + "<br>Impact: "
		+ labelMaker(atk_impact.total, atk_impact.impactstr) + "<br/>Location: "
		+ hitloc + "<br/>AV at Loc: " + avatloc
		+ "<br/>Effective Impact: " + Math.max(atk_impact.total - avatloc,0);
	if (atk_impact.total - avatloc > 0) {
		var eff = gethiteff(hitloc, atk_impact.total - avatloc);
		out += "<br/>" + deftoke.get('name') + " Injury: " + eff + " " + atk_impact.aspect
		var unipenalty = parseInt(eff.match(/\d/));

		if (deftoke.get('bar3_link')) {
			var unipenalty = unipenalty + parseInt(myGet('UNIVERSAL_PENALTY', dcharid, 0));
			deftoke.set('bar3_value', unipenalty);
			addinjury(atk_impact.aspect + " " + hitloc, eff, dcharid)
		} else if (deftoke.get('bar3_value')) {
			var unipenalty = unipenalty + parseInt(deftoke.get('bar3_value'));
			deftoke.set('bar3_value', unipenalty);
		} else {
			var unipenalty = unipenalty + parseInt(myGet('UNIVERSAL_PENALTY', dcharid, 0));
			deftoke.set('bar3_value', unipenalty);
		}

		out += rollshock(dcharid, deftoke, unipenalty)

	}
	return out;

}


function defendTemplate(template, rolldesc, rollresult, rolltarget, rollsuccess, drollresult, drolltarget, drollsuccess, aresult, dresult, result) {

	var out = `&{template:${template}} \
{{rolldesc=${rolldesc}}} \
{{rollresult=${rollresult}}} \
{{rolltarget=${rolltarget}}} \
{{rollsuccess=[[${rollsuccess}]]}} \
{{aresult=${aresult}}} \
{{dresult=${dresult}}} \
{{result=${result}}}`;
	if (drollsuccess < 4) {
		out += `{{drollresult=${drollresult}}} \
{{drolltarget=${drolltarget}}} \
{{drollsuccess=[[${drollsuccess}]]}} `;
	}
	return out;
}









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


	atkml = max(min(atkml, state.Harn.config.house_rule_elmmax), state.Harn.config.house_rule_elmmin);
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

	deml.total = max(min(deml.total, state.Harn.config.house_rule_elmmax), state.Harn.config.house_rule_elmmin);

	log("DefML: " + deml.total)

	var { dsuc, dis } = determineDefSuccess(deml.total, droll);

	if (def[1] == "ignore") {
		dis = 0;
	}

	if (atk[4] == "missile") {
		var r = attack_missile[def[1]][ais][dis];
	} else {
		var r = attack_melee[def[1]][ais][dis];
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
		charLog(charid, ": Attack CS " + wepname, state.Harn.config.realtime, state.Harn.config.gametime)
	} else if (asuc == "CF") {
		charLog(charid, ": Attack CF " + wepname, state.Harn.config.realtime, state.Harn.config.gametime)
	}
	if (dsuc == "CS") {
		charLog(defcharid, ": Defend CS " + defwepname, state.Harn.config.realtime, state.Harn.config.gametime)
	} else if (dsuc == "CF") {
		charLog(defcharid, ": Defend CF " + defwepname, state.Harn.config.realtime, state.Harn.config.gametime)
	}

	sendChat(msg.who, defendTemplate(state.Harn.config.defend_template,
		rolldesc,
		labelMaker(`Roll d100: ${state.MainGameNS.aroll}`, null, null, 1.3),
		labelMaker(`Target: ${atkml}`, appstr, null, 1.3),
		ais,
		labelMaker(`Roll d100: ${droll}`, null, null, 1.3),
		labelMaker(`Target: ${deml.total}`, deml.targstr, null, 1.3),
		dis, ares, dres, r));
}




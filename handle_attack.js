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

	var atkstr = `&{template:${attack_template}} \
		{{rolldesc=${atoke.get('name')} ${atk[4]} attacks ${toke.get('name')} with a ${wepname}}} \
		{{info=${res}}} \
		{{def=${buttonMaker("!defend dodge ?{Mod|0} WeaponName:Dodge", "Dodge", null, null, 1.2)}${buttonMaker("!defend ignore #zero WeaponName:", "Ignore", null, null, 1.2)}`;
	for (var i = 0; i < wep.length; i++) {
		atkstr += buttonMaker("!defend ?{response|block|counterstrike} ?{Mod|0} WeaponName:" + myGet(wep[i].get('name'), defcharid, "").replace(')', '&#41;'), myGet(wep[i].get('name'), defcharid, ""), null, null, 1.2)
	}
	atkstr += "}}"

	sendChat(msg.who, atkstr);

}



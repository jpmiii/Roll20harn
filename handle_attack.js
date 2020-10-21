/**
 * Process an attack message
 */
function handle_attack(atk, msg) {
	if (trace) {log(`handle_attack(${atk},${msg.content})`)}

    if(atk[0] == "!sheetattack")  {
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
	if (!toke.get("represents")) {sendChat(msg.who, "No defender"); return;}
	var defcharid = toke.get("represents");
	var defchar = getObj("character", defcharid);
	var dist = 0;
	var res = "";
	var atkmov = 0;
	var defmov = 0;

	if (atoke && toke) {
	    atkmov = tokemove(atoke);
	    defmov = tokemove(toke);
		dist = tokendistance(atoke, toke);
		res = res + "Distance: " + dist[0] + "<br/>Attacker Move: " + atkmov + "<br/>Defender Move: " + defmov ;
	}
	// Use regular expression to get the string which starts after the 7th space delimited word
	weapNameArray = msg.content.match(/^([^ ]+ ){7}(.*)$/);
	wepname=weapNameArray[weapNameArray.length-1];
	log(`selected weapon: ${wepname}`);
	// wepname = msg.content
	// 		.slice((msg.content.indexOf(atk[6]) + atk[6].length + 1))

	if (wepname == "") {
		log(msg.content);
		return;
	}

	var atkstr = "";
	var appstr = "";


	if (atoke.get('bar3_value')) {
		var app = (parseInt(atoke.get('bar3_value')) + parseInt(myGet(
				'ENCUMBRANCE', charid, 0))) * 5;
		appstr = appstr + " -" + (parseInt(atoke.get('bar3_value'))*5) + "[UP] -" + (parseInt(myGet('ENCUMBRANCE', charid, 0))*5) + "[EP]";
	} else {
		var app = (parseInt(myGet('UNIVERSAL_PENALTY', charid, 0)) + parseInt(myGet(
				'ENCUMBRANCE', charid, 0))) * 5;
		appstr = appstr + " -" + (parseInt(myGet('UNIVERSAL_PENALTY', charid, 0))*5) + "[UP] -" + (parseInt(myGet('ENCUMBRANCE', charid, 0))*5) + "[EP]";
	}



	app += hit_loc_penalty[atk[2]]["penalty"]
	appstr += " -"+hit_loc_penalty[atk[2]]['penalty']+"[Loc]";


	if (atk[4] == "missile") {
		var missi;
		({ missi, app, appstr } = missileAttack(dist, app, appstr, atkmov, charid));
	}

	var wep = findWeapon(charid, wepname);

	if (!wep[0]) {
	    sendChat(msg.who, "Weapon " + wepname + " not found");
	    return;
	}


	var ojn = wep[0].get('name');


	var atkml = computeAttackML(ojn, charid, app, atk[5]);
	if (!atkml) {
		sendChat("API","attack ml problem");
		return;
	}
	var aeml = getMeleeEML(atoke, ojn, charid, atk[5], atk[2]);
	_.each(_.keys(aeml), function(k) {
		log(k+"=="+aeml[k]);
	});
	
	
    if (atkml >95) {atkml=95;}
	aroll = randomInteger(100);
	var ctype = parseInt(myGet('CType', charid, 0))

	log("Roll: " + aroll);
	log("AtkML:" + atkml);


	if (ctype !== 0) {
	    for (i=0;i<(ctype*-1);i++) {
	        var broll = randomInteger(300);
	        log("cheat: " + aroll + " " +broll);
	        if (broll < aroll) {
	            aroll=broll;
	        }
	    }
	    if (ctype > 0) {
	    	aroll = 101 - aroll;
	    }
	    log("Cheat Roll: " + aroll);

	}

	if (state.MainGameNS["cheat"] > 0) {
	    if (state.MainGameNS["cheat"] >100) {
	        aroll = 100 - state.MainGameNS["cheat"]
	    } else {
	        aroll = state.MainGameNS["cheat"]
	        state.MainGameNS["cheat"] = 0;
	    }

	}

	var { asuc, ais } = determineSuccess(atkml);
	state.MainGameNS["aroll"] = aroll
	state.MainGameNS["asuc"] = asuc
	state.MainGameNS["ais"] = ais
	state.MainGameNS["wepname"] = wepname
	state.MainGameNS["attacker"] = atk
	state.MainGameNS["missi"] = missi



	var wep = getWep(defcharid);

	atkstr = "&{template:" + attack_template + "} {{rolldesc=" + atoke.get('name')+" "+atk[4]+" attacks "+ toke.get('name')
			+ " with a "
			+ wepname
			+ "}} {{info="
			+ res
			+ "}} {{def=[Dodge](!defend dodge ?{Mod|0} WeaponName:Dodge)[Ignore](!defend ignore ?{Mod|0} WeaponName:)";
	for (var i=0;i<wep.length;i++) {
	    atkstr += "["
			+ myGet(wep[i].get('name'),defcharid,"")
			+ "](!defend ?{response|block|counterstrike} ?{Mod|0} WeaponName:"
			+ myGet(wep[i].get('name'),defcharid,"").replace(')','&#41;') +")";
	}
	atkstr = atkstr + "}}"


	state.MainGameNS["appstr"] = myGet(ojn.slice(0, -4) + "ML", charid, 0) +  "[ML] +" + myGet(ojn.slice(0, -4) + "ATK", charid, 0) + "[Atk] +" + myGet(ojn.slice(0, -4) 	+ "HM", charid, 0) + "[HM]" + appstr + " +" + atk[5] + "[Sit]";


	sendChat(msg.who, atkstr);

}



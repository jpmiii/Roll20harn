


function handle_defend(def, msg) {

	var atk = state.MainGameNS.attacker;
	var wepname = state.MainGameNS.wepname
	var atoke = getObj("graphic", atk[1]);

	var toke = getObj("graphic", atk[6]);
	if (!toke.get("represents")) {sendChat(msg.who, "No defender"); return;}
	if (!toke.get("represents").startsWith("-M")) {sendChat(msg.who, "No defender -M"); return;}
	var charid = atoke.get("represents")
	var defcharid = toke.get("represents")
	var defchar = getObj("character", defcharid);
	var allowed = defchar.get("controlledby");
    if(!playerIsGM(msg.playerid)) {
        if (allowed.indexOf(msg.playerid) == -1 &&  allowed.indexOf("all") == -1){
            sendChat("API", msg.who + " is not in control")
            return;
        }
    }
///////////////////////////////////////////////////////////////////////

	var wep = findWeapon(charid, wepname);

	if (!wep[0]) {
	    sendChat(msg.who, "Weapon " + wepname + " not found");
	    return;
	}
	

	var aojn = wep[0].get('name');

	var aeml = getMeleeEML(atoke, aojn.slice(0, -4), charid, atk[5], atk[2]);
	var app = 0;
	var appstr = "";

	if (atk[4] == "missile") {
		var missi;

		({ missi, app, appstr } = missileAttack(tokendistance(atoke, toke), wepname, tokemove(atoke), charid));
	}

	var atkml = aeml.total + app;
	if (!atkml) {
		sendChat("API","attack ml problem");
		return;
	}

	appstr = `${aeml.targstr} ${appstr}`;
	
	
    if (atkml >95) {atkml=95;}
	var { asuc, ais } = determineSuccess(atkml,state.MainGameNS.aroll);
///////////////////////////////////////////////////////////////////////



	if (def[1] == "dodge") {

		var deml = getDodgeEML(toke, defcharid, parseInt(def[2]), ((atk[4] == "missile") && (wepname.indexOf("Bow") !== -1)));

	}

	if ((def[1] == "block") || (def[1] == "counterstrike")) {
		var defwepname = msg.content.slice((msg.content.indexOf("WeaponName:") + 11));

		if (defwepname.length > 3) {

			var defwep = findWeapon(defcharid,defwepname);
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
	    for (i=0;i<(ctype*-1);i++) {
	        var broll = randomInteger(300);
	        log("cheat: " + aroll + " " +broll);
	        if (broll < droll) {
	            droll=broll
	        }
	    }
	    if (ctype > 0) {
	        droll = 101 - droll;
	    }
	    log("Cheat Def roll: " + droll);

	}

	

	

	if (state.MainGameNS["cheat"] > 0) {
	    if (state.MainGameNS["cheat"] >100) {
	        droll = 100 - state.MainGameNS["cheat"]
	    } else {
	        droll = state.MainGameNS["cheat"]
	        state.MainGameNS["cheat"] = 0;
	    }

	}

	if (deml.total >95) {deml.total=95;}
	log("deml.total: "+deml.total)
	
	var { dsuc, dis } = determineDefSuccess(deml.total, droll);

	if (def[1] == "ignore") {
		dis = 0;
	}

	if (atk[4] == "missile") {

		var r = attack_missile[def[1]][ais][dis];

	} else {
		var r = attack_melee[def[1]][ais][dis];
	}


	var res =  r;
	var ares = "";
	var dres = "";

	if ((r.indexOf("A*") == 0) || (r.indexOf("B*") == 0)
			|| (r.indexOf("M*") == 0)) {

		var atk_impact = getImpact(parseInt(r.slice(2)),aojn.slice(0, -4),charid,atk[3],missi);


		var hitloc = gethitloc(randomInteger(100), hit_loc_penalty[atk[2]]["index"]);

		var avatloc = myGet(hitloc + "_" + atk_impact.aspect, defcharid,0);

		ares= ares+ "<br/>Attacker "+atoke.get('name')+" Impact: " + labelMaker(atk_impact.total,atk_impact.impactstr) + "<br/>Location: "
				+ hitloc + "<br/>AV at Loc: " + avatloc
				+ "<br/>Effective Impact: " + (atk_impact.total - avatloc);
		if (atk_impact.total - avatloc > 0) {
			var eff = gethiteff(hitloc, atk_impact.total - avatloc);
			ares= ares+ "<br/>Defender Injury: " + eff + " " + atk_impact.aspect
			var unipenalty =  parseInt(eff.match(/\d/));
			if (toke.get('bar3_link')) {

				var unipenalty = unipenalty + parseInt(myGet('UNIVERSAL_PENALTY', defcharid, 0));
				toke.set('bar3_value', unipenalty);
				addinjury(atk_impact.aspect+" "+hitloc, eff, defcharid)
			} else if (toke.get('bar3_value')){
				var unipenalty = unipenalty + parseInt(toke.get('bar3_value'));
				toke.set('bar3_value', unipenalty);
			} else {
				var unipenalty = unipenalty + parseInt(myGet('UNIVERSAL_PENALTY', defcharid, 0));
				toke.set('bar3_value', unipenalty);
			}

			ares= ares+ rollshock(defcharid, toke, unipenalty)

		}

	}

	if ((r.indexOf("D*") == 0) || (r.indexOf("B*") == 0)) {


		var def_impact = getImpact(parseInt(r.slice(2)),ojn.slice(0, -4),defcharid);
		var hitloc = gethitloc(randomInteger(100), 1);

		var avatloc = myGet(hitloc + "_" + def_impact.aspect, charid,0);

		dres= dres+ "<br/>Counterstriker "+toke.get('name')+" Impact: " + labelMaker(def_impact.total,def_impact.impactstr) + "<br/>Location: "
				+ hitloc + "<br/>AV at Loc: " + avatloc
				+ "<br/>Effective Impact: " + (def_impact.total - avatloc);
		if (def_impact.total - avatloc > 0) {
			var eff = gethiteff(hitloc, def_impact.total - avatloc);
			dres= dres+ "<br/>Attacker Injury: " + eff + " " + def_impact.aspect
			var unipenalty =  parseInt(eff.match(/\d/));
			if (atoke.get('bar3_link')) {

				var unipenalty = unipenalty + parseInt(myGet('UNIVERSAL_PENALTY', charid, 0));
				atoke.set('bar3_value', unipenalty);
				addinjury(def_impact.aspect+" "+hitloc, eff, charid)
			} else if (atoke.get('bar3_value')){
				var unipenalty = unipenalty + parseInt(atoke.get('bar3_value'));
				atoke.set('bar3_value', unipenalty);
			} else {
				var unipenalty = unipenalty + parseInt(myGet('UNIVERSAL_PENALTY', charid, 0));
				atoke.set('bar3_value', unipenalty);
			}
			dres= dres+ rollshock(charid, atoke, unipenalty)
		}
	}

	if (def[1] == "dodge") {

		var defstr = "&{template:" + defend_template + "} {{rolldesc=" + toke.get('name') + " attempts dodge}} {{rollresult="
		        +  labelMaker(`Roll d100: ${state.MainGameNS.aroll}`,null,null,1.3) + "}} {{rolltarget=" + labelMaker(`Target: ${atkml}`,appstr,null,1.3) + "}} {{rollsuccess=[["	+ ais + "]]}} {{drollresult=" +  labelMaker(`Roll d100: ${droll}`,null,null,1.3) + "}} {{drolltarget="
		        + labelMaker(`Target: ${deml.total}`,deml.targstr,null,1.3)+ "}}{{drollsuccess=[["	+ dis + "]]}}{{aresult=" + ares + "}}{{dresult=" + dres + "}} {{result=" + res + "}}";
	} else if (def[1] == "ignore") {


		var defstr = "&{template:" + defend_template + "} {{rolldesc=" + toke.get('name') + " ignores}} {{rollresult="
		        +  labelMaker(`Roll d100: ${state.MainGameNS.aroll}`,null,null,1.3) + "}} {{rolltarget=" + labelMaker(`Target: ${atkml}`,appstr,null,1.3) + "}} {{rollsuccess=[["	+ ais + "]]}} {{aresult=" + ares + "}}{{dresult=" + dres + "}} {{result=" + res + "}}";
	} else {

		var defstr = "&{template:" + defend_template + "} {{rolldesc=" + toke.get('name') + " " + def[1] + "s with a " + defwepname + "}} {{rollresult="
		        +  labelMaker(`Roll d100: ${state.MainGameNS.aroll}`,null,null,1.3) + "}} {{rolltarget=" + labelMaker(`Target: ${atkml}`,appstr,null,1.3) + "}} {{rollsuccess=[["	+ ais + "]]}} {{drollresult=" +  labelMaker(`Roll d100: ${droll}`,null,null,1.3) + "}} {{drolltarget="
		        + labelMaker(`Target: ${deml.total}`,deml.targstr,null,1.3) + "}}{{drollsuccess=[["+ dis + "]]}} {{aresult=" + ares + "}}{{dresult=" + dres + "}} {{result=" + res + "}}";

	}
	//log crits
	

	if (asuc == "CS") {

		charLog(charid, ": Attack CS " + wepname,realtime,gametime)
	} else if (asuc == "CF") {

		charLog(charid, ": Attack CF " + wepname,realtime,gametime)
	} 
	if (dsuc == "CS") {

		charLog(charid, ": Defend CS " + defwepname,realtime,gametime)
	} else if (dsuc == "CF") {

		charLog(charid, ": Defend CF " + defwepname,realtime,gametime)
	} 

	sendChat(msg.who, defstr);

}




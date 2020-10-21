


function handle_defend(def, msg) {

	var atk = state.MainGameNS.attacker;
	var wepname = state.MainGameNS.wepname;
	var atoke = getObj("graphic", atk[1]);

	var toke = getObj("graphic", atk[6]);
	if (!toke.get("represents")) {sendChat(msg.who, "No defender"); return;}
	if (!toke.get("represents").startsWith("-M")) {sendChat(msg.who, "No defender -M"); return;}
	var charid = atoke.get("represents")
	var defcharid = toke.get("represents")
	var defchar = getObj("character", defcharid);
	var aspect = 0;
	var allowed = defchar.get("controlledby");
    if(!playerIsGM(msg.playerid)) {
        if (allowed.indexOf(msg.playerid) == -1 &&  allowed.indexOf("all") == -1){
            senChat("API", msg.who + " is not in control")
            return;
        }
    }


	var wep = filterObjs(function(obj) {
		obn = obj.get('name');
		if (obn) {
			if ((obn.indexOf("WEAPON_NAME")) !== -1
					&& (obj.get("_characterid") == charid)
					&& (obj.get("current") == wepname)) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	});
	if (!wep) {
		senChat("API", msg.who + " No weapon")
		return;
	}

	var aojn = wep[0].get('name');

	if (atk[3] == "H") {

		var baspect = myGet(aojn.slice(0, -4) + "B", charid, 0)
		var easpect = myGet(aojn.slice(0, -4) + "E", charid, 0)
		var paspect = myGet(aojn.slice(0, -4) + "P", charid, 0)

		if (baspect !== "-") {
			aspect = parseInt(baspect);
			var aspstr = "B";
		}
		if (easpect !== "-") {
			if (parseInt(easpect) >= aspect) {
				aspect = parseInt(easpect);
				var aspstr = "E";
			}
		}
		if (paspect !== "-") {
			if (parseInt(paspect) >= aspect) {
				aspect = parseInt(paspect);
				var aspstr = "P";
			}
		}
	} else {
		var aspect = parseInt(myGet(aojn.slice(0, -4) + atk[3], charid, 0));
		var aspstr = atk[3];
	}
	if (atk[4] == "missile") {
	    if (wepname in missile_range) {
	        aspect = state.MainGameNS.missi[1];
	    } else {
	        aspect = Math.round(aspect * parseFloat(state.MainGameNS.missi[1]))
	    }
	}

	if (toke.get('bar3_value')) {

		var pp = (parseInt(toke.get('bar3_value')) + parseInt(myGet(
				'ENCUMBRANCE', defcharid, 0))) * 5;

	} else {
		var pp = (parseInt(myGet('UNIVERSAL_PENALTY', defcharid, 0)) + parseInt(myGet(
				'ENCUMBRANCE', defcharid, 0))) * 5;
	}

	if (def[1] == "dodge") {
	    var defml = 0;
	    if ((atk[4] == "missile") && (wepname.indexOf("Bow") !== -1)) {
		    defml = Math.round(parseInt(myGet("DODGE_ML", defcharid, 0))/2) + parseInt(def[2])- (pp);
	    } else {
	        defml = parseInt(myGet("DODGE_ML", defcharid, 0)) + parseInt(def[2])- (pp);
	    };

		var defstr = "";// "+" +  parseInt(myGet("DODGE_ML", defcharid, 0)) + "+" + parseInt(def[2])+ "-" + (pp);
		var defwepname = "Dodge";

	}

	if ((def[1] == "block") || (def[1] == "counterstrike")) {
		var defwepname = msg.content.slice((msg.content.indexOf("WeaponName:") + 11));

		if (defwepname.length > 3) {

			var defwep = filterObjs(function(obj) {
				obn = obj.get('name');
				if (obn) {
					if ((obn.indexOf("WEAPON_NAME")) !== -1
							&& (obj.get("_characterid") == defcharid)
							&& (obj.get("current") == defwepname)) {
						return true;
					} else {
						return false;
					}
				} else {
					return false;
				}
			});

			var ojn = defwep[0].get('name');

			if (def[1] == "counterstrike") {
			    var defml = parseInt(myGet(ojn.slice(0, -4) + "ML", defcharid, 0)) - pp + parseInt(myGet(ojn.slice(0, -4) + "ATK", defcharid, 0)) + parseInt(myGet(ojn.slice(0, -4) + "HM", defcharid, 0)) + parseInt(def[2]);

			} else {
			    var defml = parseInt(myGet(ojn.slice(0, -4) + "ML", defcharid, 0)) - pp + parseInt(myGet(ojn.slice(0, -4) + "DEF", defcharid, 0)) + parseInt(myGet(ojn.slice(0, -4) + "HM", defcharid, 0)) + parseInt(def[2]);

			}

		} else {
			def[1] = "ignore";
			var defstr = ""
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

	
	log("defml: "+defml)
	

	if (state.MainGameNS["cheat"] > 0) {
	    if (state.MainGameNS["cheat"] >100) {
	        droll = 100 - state.MainGameNS["cheat"]
	    } else {
	        droll = state.MainGameNS["cheat"]
	        state.MainGameNS["cheat"] = 0;
	    }

	}

	if (defml >95) {defml=95;}

	if ((droll <= defml) && (droll % 5 == 0)) {
		var dsuc = "CS";
		var dis = 3;
	}
	if ((droll <= defml) && (droll % 5 !== 0)) {
		var dsuc = "MS";
		var dis = 2;
	}
	if ((droll > defml) && (droll % 5 !== 0)) {
		var dsuc = "MF";
		var dis = 1;
	}
	if ((droll > defml) && (droll % 5 == 0)) {
		var dsuc = "CF";
		var dis = 0;
	}

	if (def[1] == "ignore") {
		dis = 0;
	}

	if (atk[4] == "missile") {

		var r = attack_missile[def[1]][state.MainGameNS.ais][dis];

	} else {
		var r = attack_melee[def[1]][state.MainGameNS.ais][dis];
	}


	var res =  r;
	var ares = "";
	var dres = "";

	if ((r.indexOf("A*") == 0) || (r.indexOf("B*") == 0)
			|| (r.indexOf("M*") == 0)) {


		var impactroll = "";
		var tot = 0;

		var sides = 6;
		var bm = 0;

		var imd = "";//myGet(ojn.slice(0, -4) + "NOTE", charid, "")
		var attribute = findObjs({
    		type: 'attribute',
    		characterid: charid,
    		name: aojn.slice(0, -4) + "NOTE"
	    })[0]

	    if (attribute) {
	        imd = attribute.get('current');

	    }
	    log("imd: " + imd);

		if (imd.length>0) {
    		var impactmod = imd.split(":")

    		if (impactmod.length==2) {
    		    aspect = aspect + parseInt(impactmod[1]);
    		    log("Impact mod: "+impactmod[1]);
    		}
    		if (impactmod.length==3) {
    		    log("Impact mod: "+impactmod[1] + " : " + impactmod[2]);
    		    if(impactmod[1] == "d") {

    		        for (i = 0; i < parseInt(impactmod[2]); i++) {
            			var ir = randomInteger(6);
            			tot = tot + ir;
            			if (impactroll.length > 2) {
            				impactroll = impactroll + " + " + ir;

            			} else {
            				impactroll = impactroll + "[[" + ir;

            			}
    		        }
    		    } else {
    		    sides =  parseInt(impactmod[1]);
    		    bm =  parseInt(impactmod[2]);
    		    }
    		}
		}

		for (i = 0; i < parseInt(r.slice(2)); i++) {
			var ir = randomInteger(sides) + bm;
			tot = tot + ir
			if (impactroll.length > 2) {
				impactroll = impactroll + " + " + ir;

			} else {
				impactroll = impactroll + "[[" + ir;

			}
		}


		tot = tot + aspect;
		impactroll = impactroll + " + " + aspect + " ]]";


		var hitloc = gethitloc(randomInteger(100), hit_loc_penalty[atk[2]]["index"]);

		var avatloc = myGet(hitloc + "_" + aspstr, defcharid,0);

		ares= ares+ "<br/>Attacker "+atoke.get('name')+" Impact: " + impactroll + "<br/>Location: "
				+ hitloc + "<br/>AV at Loc: " + avatloc
				+ "<br/>Effective Impact: " + (tot - avatloc);
		if (tot - avatloc > 0) {
			var eff = gethiteff(hitloc, tot - avatloc);
			ares= ares+ "<br/>Defender Injury: " + eff + " " + aspstr
			var unipenalty =  parseInt(eff.match(/\d/));
			if (toke.get('bar3_link')) {

				var unipenalty = unipenalty + parseInt(myGet('UNIVERSAL_PENALTY', defcharid, 0));
				toke.set('bar3_value', unipenalty);
				addinjury(aspstr+" "+hitloc, eff, defcharid)
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

		var baspect = myGet(ojn.slice(0, -4) + "B", defcharid, 0)
		var easpect = myGet(ojn.slice(0, -4) + "E", defcharid, 0)
		var paspect = myGet(ojn.slice(0, -4) + "P", defcharid, 0)
		var defaspstr = "";
		if (baspect !== "-") {
			aspect = parseInt(baspect);
			var defaspstr = "B";
		}
		if (easpect !== "-") {
			if (parseInt(easpect) >= aspect) {
				aspect = parseInt(easpect);
				var defaspstr = "E";
			}
		}
		if (paspect !== "-") {
			if (parseInt(paspect) >= aspect) {
				aspect = parseInt(paspect);
				var defaspstr = "P";
			}
		}


		var impactroll = "";
		var tot = 0;

		var sides = 6;
		var bm = 0;
		var imd = "";//myGet(ojn.slice(0, -4) + "NOTE", charid, "")
		var attribute = findObjs({
    		type: 'attribute',
    		characterid: defcharid,
    		name: aojn.slice(0, -4) + "NOTE"
	    })[0]

	    if (attribute) {
	        imd = attribute.get('current');

	    }
		if (imd.length>0) {
    		var impactmod = imd.split(":")
    		if (impactmod.length==2) {
    		    aspect = aspect + parseInt(impactmod[1]);
    		    log("Impact mod: "+impactmod[1]);
    		}
    		if (impactmod.length==3) {
    		    log("Impact mod: "+impactmod[1] + " : " + impactmod[2]);
    		    if(impactmod[1] == "d") {

    		        for (i = 0; i < parseInt(impactmod[2]); i++) {
            			var ir = randomInteger(6);
            			tot = tot + ir;
            			if (impactroll.length > 2) {
            				impactroll = impactroll + " + " + ir;

            			} else {
            				impactroll = impactroll + "[[" + ir;

            			}
    		        }
    		    } else {
    		    sides =  parseInt(impactmod[1]);
    		    bm =  parseInt(impactmod[2]);
    		    }
    		}
		}

		for (i = 0; i < parseInt(r.slice(2)); i++) {
			var ir = randomInteger(sides) + bm;
			tot = tot + ir
			if (impactroll.length > 2) {
				impactroll = impactroll + " + " + ir;

			} else {
				impactroll = impactroll + "[[" + ir;

			}
		}

		tot = tot + aspect;
		impactroll = impactroll + " + " + aspect + " ]]";

		var hitloc = gethitloc(randomInteger(100), 1);

		var avatloc = myGet(hitloc + "_" + defaspstr, charid,0);

		dres= dres+ "<br/>Counterstriker "+toke.get('name')+" Impact: " + impactroll + "<br/>Location: "
				+ hitloc + "<br/>AV at Loc: " + avatloc
				+ "<br/>Effective Impact: " + (tot - avatloc);
		if (tot - avatloc > 0) {
			var eff = gethiteff(hitloc, tot - avatloc);
			dres= dres+ "<br/>Attacker Injury: " + eff + " " + defaspstr
			var unipenalty =  parseInt(eff.match(/\d/));
			if (atoke.get('bar3_link')) {

				var unipenalty = unipenalty + parseInt(myGet('UNIVERSAL_PENALTY', charid, 0));
				atoke.set('bar3_value', unipenalty);
				addinjury(defaspstr+" "+hitloc, eff, charid)
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

	    if ((atk[4] == "missile") && (wepname.indexOf("Bow") !== -1)) {
            var drolltarg = parseInt(parseInt(myGet("DODGE_ML", defcharid, 0))/2) + "[1/2ML] -" + (pp) + "[PP] +" +parseInt(def[2]) + "[Sit]";
        } else {
            var drolltarg = parseInt(myGet("DODGE_ML", defcharid, 0)) + "[ML] -" + (pp) + "[PP] +" +parseInt(def[2]) + "[Sit]";
        }

		var defstr = "&{template:" + defend_template + "} {{rolldesc=" + toke.get('name') + " attempts dodge}} {{rollresult=[["
		        +  state.MainGameNS.aroll + "]]}} {{rolltarget=[[" + state.MainGameNS.appstr + "]]}} {{rollsuccess=[["	+ state.MainGameNS.ais + "]]}} {{drollresult=[[" +  droll + "]]}} {{drolltarget=[["
		        + drolltarg+ "]]}}{{drollsuccess=[["	+ dis + "]]}}{{aresult=" + ares + "}}{{dresult=" + dres + "}} {{result=" + res + "}}";
	} else if (def[1] == "ignore") {


		var defstr = "&{template:" + defend_template + "} {{rolldesc=" + toke.get('name') + " ignores}} {{rollresult=[["
		        +  state.MainGameNS.aroll + "]]}} {{rolltarget=[[" + state.MainGameNS.appstr + "]]}} {{rollsuccess=[["	+ state.MainGameNS.ais + "]]}} {{aresult=" + ares + "}}{{dresult=" + dres + "}} {{result=" + res + "}}";
	} else {
		var notestr =   + state.MainGameNS.atkstrout + "<br><h4>"
				+ toke.get('name') + " " + def[1] + "s with a "
				+ defwepname + "</h4><br/>Penalty: " + pp
				+ "<br/>Other mods: "+ def[2] + "<br>Mastery Level: "	+ (parseInt(myGet(ojn.slice(0, -4) + "ML", defcharid, 0)) + parseInt(myGet(ojn.slice(0, -4) + "DEF", defcharid, 0)))
				+ "<h4>Result:</h4>" + res

		if (def[1] =="counterstrike") {
		    var drolltarg = myGet(ojn.slice(0, -4) + "ML", defcharid, 0) + "[ML] +" + myGet(ojn.slice(0, -4) + "ATK", defcharid, 0) + "[Atk] +" + myGet(ojn.slice(0, -4) + "HM", defcharid, 0) + "[HM] -" +  pp + "[PP] +" + def[2] + "[Sit]";

		} else {
		    var drolltarg = myGet(ojn.slice(0, -4) + "ML", defcharid, 0) + "[ML] +" + myGet(ojn.slice(0, -4) + "DEF", defcharid, 0) + "[Def] +" + myGet(ojn.slice(0, -4) + "HM", defcharid, 0) + "[HM] -" +  pp + "[PP] +" + def[2] + "[Sit]";

		}

		var defstr = "&{template:" + defend_template + "} {{rolldesc=" + toke.get('name') + " " + def[1] + "s with a " + defwepname + "}} {{rollresult=[["
		        +  state.MainGameNS.aroll + "]]}} {{rolltarget=[[" + state.MainGameNS.appstr + "]]}} {{rollsuccess=[["	+ state.MainGameNS.ais + "]]}} {{drollresult=[[" +  droll + "]]}} {{drolltarget=[["
		        + drolltarg+ "]]}}{{drollsuccess=[["+ dis + "]]}} {{aresult=" + ares + "}}{{dresult=" + dres + "}} {{result=" + res + "}}";

	}
	//log crits
	

	if (state.MainGameNS.asuc == "CS") {

		charLog(charid, ": Attack CS " + wepname,realtime,gametime)
	} else if (state.MainGameNS.asuc == "CF") {

		charLog(charid, ": Attack CF " + wepname,realtime,gametime)
	} 
	if (dsuc == "CS") {

		charLog(charid, ": Defend CS " + defwepname,realtime,gametime)
	} else if (dsuc == "CF") {

		charLog(charid, ": Defend CF " + defwepname,realtime,gametime)
	} 

	sendChat(msg.who, defstr);

}




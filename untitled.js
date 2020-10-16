log("loading javascript");

var started = false;

on("ready", function() {
    if( ! state.MainGameNS ) {
        state.MainGameNS = { index: 0, dis: 0 };
    }
    log(getHarnTimeStr(state.MainGameNS.GameTime));
	log("loaded. trace: "+ trace);
	initializeTables(0);
	started = true;
});


on("change:attribute:current", function(obj, prev) {
    
    if((obj.get('name') == "INITIATIVE_ML") || (obj.get('name') == "UNIVERSAL_PENALTY") || (obj.get('name') == "ENCUMBRANCE") || (obj.get('name') == "RIDER")){

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
            	mySet('STEED_INIT',rider.id,(parseInt(myGet('INITIATIVE_ML', charid, 0)) - (parseInt(myGet('UNIVERSAL_PENALTY', charid, 0)) * 5)- (parseInt(myGet('ENCUMBRANCE', charid, 0)) * 5)));

        	}
        }
    } else if (obj.get('name').includes("WEAPON_NAME")) {
        var char = findObjs({                              
        		id: obj.get("_characterid"),                              
        		_type: "character",                          
        })[0];
        setWeaponsList(char);
    } else if (obj.get('name').includes("SKILL_NAME")) {
        var char = findObjs({                              
        		id: obj.get("_characterid"),                              
        		_type: "character",                          
        })[0];
        setSkillList(char);
    }
});

/*

// THIS STUFF WON'T WORK

on("add:attribute", function(obj) {
    if (started) {
        if (obj.get('name').includes("WEAPON_NAME")) {
            log(obj);
            var char = findObjs({                              
            		id: obj.get("_characterid"),                              
            		_type: "character",                          
            })[0];
            setWeaponsList(char);
        } else if (obj.get('name').includes("SKILL_NAME")) {
            var char = findObjs({                              
            		id: obj.get("_characterid"),                              
            		_type: "character",                          
            })[0];
            setSkillList(char);
        }
    }
});



on("destroy:attribute", function(obj) {

    if (obj.get('name').includes("WEAPON_NAME")) {
        log("destroy");
        log(obj)
        var char = findObjs({                              
        		id: obj.get("_characterid"),                              
        		_type: "character",                          
        })[0];
        setWeaponsList(char);
    } else if (obj.get('name').includes("SKILL_NAME")) {
        var char = findObjs({                              
        		id: obj.get("_characterid"),                              
        		_type: "character",                          
        })[0];
        setSkillList(char);
    }

});

*/
on("change:campaign:turnorder", function(obj, prev) {    
    if(Campaign().get("turnorder") !== "") {
        if(prev["turnorder"] !== "") {
            var turnorder = JSON.parse(Campaign().get("turnorder"));
            var oldturnorder = JSON.parse(prev["turnorder"]);
            if (turnorder.length > 0) {
                if (turnorder[0]["id"] !== oldturnorder[0]["id"]) {
                    toke = getObj("graphic",turnorder[0]["id"]);
                    sendGMPing(toke.get('left'), toke.get('top'), toke.get('pageid'), "", true);
                }
            }
        }
    }

});



const getGMPlayers = (pageid) => findObjs({type:'player'})
    .filter((p)=>playerIsGM(p.id))
    .filter((p)=>undefined === pageid || p.get('lastpage') === pageid)
    .map(p=>p.id)
    ;

const sendGMPing = (left, top, pageid, playerid=null, moveAll=false) => {
    let players = getGMPlayers(pageid);
    if(players.length){
        sendPing(left,top,pageid,playerid,moveAll,players);
    }
};

/**
 * 
 */


function initRoll() {
	if (randomize_init_roll) {
		return randomInteger(6) + randomInteger(6) + randomInteger(6);
	} else {
		return 0; // canon
	}

}
/**
 * Process an attack message
 */
function handle_attack(atk, msg) {
	if (trace) {log(`handle_attack(${atk},${msg.content})`)}
	var re_syntax = /^(!sheetattack|!attack) [-a-zA-Z0-9]+ (mid|low|high) (H|B|E|P|F) (melee|missile) [-a-zA-Z0-9]+ .+$/
	var hr_syntax="!sheetattack attacker_id (high|low|mid) (H|B|E|P) (missile|melee) modifier defender_id weapon"
	if (!re_syntax.test(msg.content)) {
	    sendChat(msg.who, "Invalid syntax<br/>"+hr_syntax);
		return;
	}

    if(atk[0] == "!sheetattack")  {
        var tokelist = findObjs({                              
		  represents: atk[1],
		  _pageid: Campaign().get("playerpageid"),
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
		res = res + "Distance: " + dist[0] + "<br/>Attacker Move: " + atkmov + "<br/>Defender Move: " + defmov + "<br/>";
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


	app = app + hit_loc_penalty[atk[2]]["penalty"]
	appstr = appstr + " -" + hit_loc_penalty[atk[2]]["penalty"] +"[Loc]";
	
	
	if (atk[4] == "missile") {
		var missi;
		({ missi, app, appstr } = missileAttack(dist, app, appstr, atkmov, charid));
	}

	var wep = findWeapon(charid);
	
	if (!wep[0]) {
	    sendChat(msg.who, "Weapon " + wepname + " not found");
	    return;
	}


	var ojn = wep[0].get('name');

	var atkml = computeAttackML(ojn, charid, app, atk);

    if (atkml >97) {atkml=97;}
	aroll = randomInteger(100);
	var ctype = parseInt(myGet('CType', charid, 0))

	log("Roll: " + aroll);
	log("AtkML:" + atkml);
	if (!atkml) {
		sendChat("API","attack ml problem");
		return;
	}
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
	state.MainGameNS["attacker"] = msg
	state.MainGameNS["missi"] = missi



	var wep = getWep(defchar);

	atkstr = "&{template:harnroll} {{rolldesc=" + atoke.get('name')+" "+atk[4]+" attacks "+ toke.get('name')
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

	state.MainGameNS["atkstrout"] =   "<br/>Penalty: "
			+ app
			+ "<br/>Other Mods: "
			+ atk[5]
			+ "<br/>Mastery Level: "
			+ myGet(ojn.slice(0, -4) + "ML", charid, 0)
			+ "<br/>Attack Mod: "
			+ myGet(ojn.slice(0, -4) + "ATK", charid, 0)




	sendChat(msg.who, atkstr);

}

function determineSuccess(atkml) {
	if (aroll <= atkml) {
		if (aroll % 5 == 0) {
			return { asuc:"CS", ais:3 };
		} else {
			return { asuc:"MS", ais:2 };
		}
	} else {
		if (aroll % 5 !== 0) {
			return { asuc:"MF", ais:1 };
		} else {
			return { asuc:"CF", ais:0 };
		}
	}
}

function computeAttackML(ojn, charid, app, atk) {
	return parseInt(myGet(ojn.slice(0, -4) + "ML", charid, 0))
		+ parseInt(myGet(ojn.slice(0, -4) + "ATK", charid, 0))
		+ parseInt(myGet(ojn.slice(0, -4) + "HM", charid, 0))
		+ parseInt(atk[5]) - (app);
}

function findWeapon(charid) {
	return filterObjs(function (obj) {
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
}

function missileAttack(dist, app, appstr, atkmov, charid) {
	var missi = getrange(wepname, dist[0]);
	app = app + missi[0];
	if (missi[0] < 0) {
		appstr = appstr + " +" + missi[0] * -1 + "[Rng]";
	} else {
		appstr = appstr + " -" + missi[0] + "[Rng]";;
	}
	if (atkmov < 5) {
		app = app - Math.round(parseInt(myGet('ENCUMBRANCE', charid, 0)) * 2.5);
		appstr = appstr + " +" + Math.round(parseInt(myGet('ENCUMBRANCE', charid, 0)) * 2.5) + "[NM]";
	}
	if (atkmov > 5) {
		app = app + 10;
		appstr = appstr + " -10[Mov]";
	}
	if (myGet('IS_MOUNTED', charid, 0) == 'on') {
		app = app + 10;
		appstr = appstr + " -10[Mnt]";
	}
	return { missi, app, appstr };
}

function handle_defend(args, msg) {

	var def = msg.content.split(" ");
	var atk = state.MainGameNS.attacker.content.split(" ");
    if(atk[0] == "!sheetattack")  {
        var tokelist = findObjs({                              
		  represents: atk[1],
		  _pageid: Campaign().get("playerpageid"),
          _type: "graphic",
        });
        atk[1] = tokelist[0].id;
    }
	var wepname = state.MainGameNS.wepname;
	var atoke = getObj("graphic", atk[1]);

	var toke = getObj("graphic", atk[6]);
	if (!toke.get("represents")) {sendChat(msg.who, "No defender"); return;}
	if (!toke.get("represents").startsWith("-M")) {sendChat(msg.who, "No defender sheet"); return;}

	var charid = atoke.get("represents")
	var defcharid = toke.get("represents")
	var defchar = getObj("character", defcharid);
	var aspect = 0;
	var allowed = defchar.get("controlledby");
    if(!playerIsGM(msg.playerid)) {
        if (allowed.indexOf(msg.playerid) == -1 &&  allowed.indexOf("all") == -1){
            log(msg.who + " denied");
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


	var res = r + "<br/>";

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

		res = res + "<br/>Attacker "+atoke.get('name')+" Impact: " + impactroll + "<br/>Location: "
				+ hitloc + "<br/>AV at Loc: " + avatloc
				+ "<br/>Effective Impact: " + (tot - avatloc);
		if (tot - avatloc > 0) {
			var eff = gethiteff(hitloc, tot - avatloc);
			res = res + "<br/>Defender Injury: " + eff + " " + aspstr
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

			res = res + rollshock(defcharid, toke, unipenalty)

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

		res = res + "<br/>Counterstriker "+toke.get('name')+" Impact: " + impactroll + "<br/>Location: "
				+ hitloc + "<br/>AV at Loc: " + avatloc
				+ "<br/>Effective Impact: " + (tot - avatloc);
		if (tot - avatloc > 0) {
			var eff = gethiteff(hitloc, tot - avatloc);
			res = res + "<br/>Attacker Injury: " + eff + " " + defaspstr
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
			res = res + rollshock(charid, atoke, unipenalty)
		}
	}

	if (def[1] == "dodge") {

	    if ((atk[4] == "missile") && (wepname.indexOf("Bow") !== -1)) {
            var drolltarg = parseInt(parseInt(myGet("DODGE_ML", defcharid, 0))/2) + "[1/2ML] -" + (pp) + "[PP] +" +parseInt(def[2]) + "[Sit]";
        } else {
            var drolltarg = parseInt(myGet("DODGE_ML", defcharid, 0)) + "[ML] -" + (pp) + "[PP] +" +parseInt(def[2]) + "[Sit]";
        }

		var defstr = "&{template:harnroll} {{rolldesc=" + toke.get('name') + " attempts dodge}} {{rollresult=[[" 
		        +  state.MainGameNS.aroll + "]]}} {{rolltarget=[[" + state.MainGameNS.appstr + "]]}} {{rollsuccess=[["	+ state.MainGameNS.ais + "]]}} {{drollresult=[[" +  droll + "]]}} {{drolltarget=[["
		        + drolltarg+ "]]}}{{drollsuccess=[["	+ dis + "]]}} {{result=" + res + "}}";
	} else if (def[1] == "ignore") {


		var defstr = "&{template:harnroll} {{rolldesc=" + toke.get('name') + " ignores}} {{rollresult=[[" 
		        +  state.MainGameNS.aroll + "]]}} {{rolltarget=[[" + state.MainGameNS.appstr + "]]}} {{rollsuccess=[["	+ state.MainGameNS.ais + "]]}} {{result=" + res + "}}";
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

		var defstr = "&{template:harnroll} {{rolldesc=" + toke.get('name') + " " + def[1] + "s with a " + defwepname + "}} {{rollresult=[[" 
		        +  state.MainGameNS.aroll + "]]}} {{rolltarget=[[" + state.MainGameNS.appstr + "]]}} {{rollsuccess=[["	+ state.MainGameNS.ais + "]]}} {{drollresult=[[" +  droll + "]]}} {{drolltarget=[["
		        + drolltarg+ "]]}}{{drollsuccess=[["+ dis + "]]}} {{result=" + res + "}}";

	}
	//log crits
	if (state.MainGameNS.asuc == "CS") {
		logout = myGet("TEXTAREA_LOG",charid,"");
		mySet("TEXTAREA_LOG",charid, logout + getHarnTimeStr(state.MainGameNS.GameTime) + ": Attack CS " + wepname + "\n")
	} else if (state.MainGameNS.asuc == "CF") {
		logout = myGet("TEXTAREA_LOG",charid,"");
		mySet("TEXTAREA_LOG",charid, logout + getHarnTimeStr(state.MainGameNS.GameTime) + ": Attack CF " + wepname + "\n")
	} else if (dsuc == "CS") {
		logout = myGet("TEXTAREA_LOG",defcharid,"");
		mySet("TEXTAREA_LOG",defcharid, logout + getHarnTimeStr(state.MainGameNS.GameTime) + ": Defend CS " + defwepname + "\n")
	} else if (dsuc == "CF") {
		logout = myGet("TEXTAREA_LOG",defcharid,"");
		mySet("TEXTAREA_LOG",defcharid, logout + getHarnTimeStr(state.MainGameNS.GameTime) + ": Defend CF " + defwepname + "\n")
	} 

	sendChat(msg.who, defstr);

}
function handle_pickskill(args, msg) {
	sendChat("Skill Improvement Roll",  msg.content.slice(msg.content.indexOf(args[1])+21) + "<br>[Pick Skill](!improveskill " + args[1] 
		+ " %{" + msg.content.slice(msg.content.indexOf(args[1])+21) + "|SkillList})")
}


function handle_improveskill(args, msg) {
	char = getObj("character", args[1]);
	skill_att_name = findSkill(char, args[2]);
	var d = new Date();
	var n = d.toLocaleString();
	var ml = parseInt(myGet(skill_att_name.slice(0,-4)+"ML",char.id,0));
	var logout = myGet("TEXTAREA_LOG",char.id,"");
	roll = randomInteger(100) + parseInt(myGet(skill_att_name.slice(0,-4)+"SB",char.id,0));
	if (roll >= ml) {
		mySet(skill_att_name.slice(0,-4)+"ML",char.id,(ml+1));
		sendChat("Skill Improvement " + myGet("NAME",char.id,""), "<br>" + args[2]
			+ "<br>" + " roll " +roll +": SUCCESS<br>ML = " + (ml+1));
		mySet("TEXTAREA_LOG",char.id,logout + n + ":  " + getHarnTimeStr(state.MainGameNS.GameTime) 
			+ ": Skill Improvement Roll: " + args[2] + " " + roll +": SUCCESS: ML = " + (ml+1) + "\n");
	} else {
		sendChat("Skill Improvement " + myGet("NAME",char.id,""), "<br>" + args[2]
			+ "<br>" + " roll " +roll +": FAIL<br>ML = " + ml);
		mySet("TEXTAREA_LOG",char.id,logout + n + ":  " + getHarnTimeStr(state.MainGameNS.GameTime) 
			+ ": Skill Improvement Roll: " + args[2] + " " + roll +": FAIL: ML = " + ml + "\n");
	}
}


function rollshock(charid, token, unipenalty) {
	var shockstr = "";
	var shockroll = 0;
	for (i = 0; i < unipenalty; i++) {
		var ir = randomInteger(6);
		shockroll = shockroll + ir
		if (i > 0) {
			shockstr = shockstr + " + " + ir;

		} else {
			shockstr = shockstr + "[[" + ir;

		}
	}
	end = myGet("COMBAT_ENDURANCE", charid,0);
	if (shockroll > end) {
		token.set("status_sleepy");
		return "<br/>Shock Roll: " + shockstr + "]]<br/><h4>FAIL</h4><br/>";
	} else {
		return "<br/>Shock Roll: " + shockstr + "]]<br/>Pass<br/>";
	}

}

function handle_rollatts(args, char) {

	var rolls = [ "STR", "STA", "DEX", "AGL", "INT", "AUR", "WIL", "EYE",
			"HRG", "SML", "VOI", "CML", "FRAME" ]
	_.each(rolls, function(attname) {
		var r = randomInteger(6) + randomInteger(6) + randomInteger(6);
		if (msg.content.indexOf("?") !== -1) {
			myGet(attname, char.id, r);
		} else {
			mySet(attname, char.id, r);
		}
	});
	var autoskills = [ "CLIMBING_SB", "CONDITION_SB", "DODGE_SB", "JUMPING_SB",
			"STEALTH_SB", "THROWING_SB", "AWARENESS_SB", "INTRIGUE_SB",
			"ORATORY_SB", "RHETORIC_SB", "SINGING_SB", "INITIATIVE_SB",
			"UNARMED_SB" ]
	_.each(autoskills, function(skillname) {
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
	_.each(hit_location_table, function(row) {
		if (row[3] == loc) {
			lr = row[col];
		}

	});

	return lr;
}

function gethitloc(roll, aim) {
	var lr;
	_.each(hit_location_table, function(row) {
		if (row[aim] !== "-") {
			if (parseInt(row[aim].slice(0, 2)) <= roll) {
				lr = row[3];
			}
		}

	});

	return lr;
}


on("chat:message", function(msg) {
 if(msg.type == "api") {
	if (trace) {log(`>chat:message(${msg.content})`);}
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
//<<<<<<< HEAD
 } else {

	// check for and log crits
	if (msg.content.startsWith(" {{character_name=")) {
		var d = new Date();
		var n = d.toLocaleString();
		if (msg.content.includes("rolldesc=rolls ")) {
			if (msg.inlinerolls[3].results.total % 5 == 0) {
				var char = getCharByNameAtt(msg.content.slice((msg.content.indexOf("character_name")+15),msg.content.indexOf("}} ")));
				var logout = myGet("TEXTAREA_LOG",char.id,"");
				if (msg.inlinerolls[1].results.total >= msg.inlinerolls[3].results.total) {
					mySet("TEXTAREA_LOG",char.id, logout + n + ":  " + getHarnTimeStr(state.MainGameNS.GameTime) + ": CS " 
						+ msg.content.slice(msg.content.indexOf("rolldesc=rolls ")+15,
						msg.content.indexOf("}} ", msg.content.indexOf("rolldesc=rolls "))) + "\n")
				} else {
					mySet("TEXTAREA_LOG",char.id, logout + n + ":  " + getHarnTimeStr(state.MainGameNS.GameTime) + ": CF " 
						+ msg.content.slice(msg.content.indexOf("rolldesc=rolls ")+15,
						msg.content.indexOf("}} ", msg.content.indexOf("rolldesc=rolls "))) + "\n")
				}
			}
		} else 	if (msg.content.includes("rolldesc=performs ")) {
			if (msg.inlinerolls[7].results.total % 5 == 0) {
				var char = getCharByNameAtt(msg.content.slice((msg.content.indexOf("character_name")+15),msg.content.indexOf("}} ")));
				var logout = myGet("TEXTAREA_LOG",char.id,"");
				if (msg.inlinerolls[4].results.total >= msg.inlinerolls[7].results.total) {
					mySet("TEXTAREA_LOG",char.id, logout + n + ":  " + getHarnTimeStr(state.MainGameNS.GameTime) + ": CS " 
						+ msg.content.slice(msg.content.indexOf("rolldesc=performs ")+18,
						msg.content.indexOf("}} ", msg.content.indexOf("rolldesc=performs "))) + "\n")
				} else {
					mySet("TEXTAREA_LOG",char.id, logout + n + ":  " + getHarnTimeStr(state.MainGameNS.GameTime) + ": CF " 
						+ msg.content.slice(msg.content.indexOf("rolldesc=performs ")+18,
						msg.content.indexOf("}} ", msg.content.indexOf("rolldesc=performs "))) + "\n")
				}
			}
		} else 	if (msg.content.includes("rolldesc=casts ")) {
			log(msg.inlinerolls[4].results.total);
			log(msg.inlinerolls[7].results.total);
			if (msg.inlinerolls[7].results.total % 5 == 0) {
				var char = getCharByNameAtt(msg.content.slice((msg.content.indexOf("character_name")+15),msg.content.indexOf("}} ")));
				var logout = myGet("TEXTAREA_LOG",char.id,"");
				if (msg.inlinerolls[4].results.total >= msg.inlinerolls[7].results.total) {
					mySet("TEXTAREA_LOG",char.id, logout + n + ":  " + getHarnTimeStr(state.MainGameNS.GameTime) + ": CS " 
						+ msg.content.slice(msg.content.indexOf("rolldesc=casts ")+15,
						msg.content.indexOf("}} ", msg.content.indexOf("rolldesc=casts "))) + "\n")
				} else {
					mySet("TEXTAREA_LOG",char.id, logout + n + ":  " + getHarnTimeStr(state.MainGameNS.GameTime) + ": CF " 
						+ msg.content.slice(msg.content.indexOf("rolldesc=casts ")+15,
						msg.content.indexOf("}} ", msg.content.indexOf("rolldesc=casts "))) + "\n")
				}
			}
		}
	}
//=======
	if (trace) {log("<chat:message")}
//>>>>>>> branch 'issue_12' of https://github.com/jpmiii/Roll20harn.git
 }
});
function getCharByNameAtt(charname) {
	var attr = findObjs({
        		current: charname,
				name: "NAME",
        		_type: "attribute",
        	})[0];
	return getObj("character",attr.get('_characterid'));
}
/**
 * Update the skill bonues of the active sheet.
 * @param {Message} msg the message representing the command, with arguments separated by spaces
 */
function handle_calcsb(args, msg) {
	if (trace) {log(`handle_calcsb(${args},${msg.content})`)}
	var char = getObj("character", args[1]);
	if (char) {
		calcSB(char, msg);
	}
}

/**
 * Build a skill list table - probable candicate for initializing on startup.
 * @param {Message} msg the message representing the command, with arguments separated by spaces
 */
function handle_skilllist(args, msg) {
	if (trace) {log(`handle_skilllist(${args},${msg.content})`)}
	var char = getObj("character", args[1]);
	if (char) {
		var out = "";
		var sl = skillList(char);

		for (i = 0; i < sl.length; i++) {
			out += "|" + sl[i];
		}

		//log(out+"\n\n");
		out = out.replace(/,/g, "&#44;");
		out = "?{Skills" + out + "}";
		var mac = findObjs({
			type: 'macro',
			_characterid: msg.playerid,
			name: 'SkillList'
		})[0];
		if (mac) {
			mac.set('action', out);
		} else {
			createObj('macro', {
				name: 'SkillList',
				action: out,
				playerid: msg.playerid
			});
		}
	}
	return { char, out, args };
}

/**
 * Allow the hand of god to tip the scales. 
 * @param {Message} msg the message representing the command, with arguments separated by spaces
 */
function handle_cheat(args, msg) {
	if (trace) {log(`handle_cheat(${args},${msg.content})`)}
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
	if (trace) {log(`handle_mapsend(${args},${msg.content})`)}
	args = msg.content.substr(9).split(",");
	var player = findObjs({
		type: 'player',
		_displayname: args[0]
	})[0];

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
	return args;
}

/**
 * This command is obsolete now that we initialize item lists on startup.
 * @param {Message} msg the message representing the command, with arguments separated by spaces
 */
function handle_itemlist(args, msg) {
	if (trace) {log(`handle_itemlist(${args},${msg.content})`)}
	initializeTables(msg.playerid);
}

/**
 * Populates the character skills with occupation appropriate skills (and starting ML?)
 * @param {Message} msg the message representing the command, with arguments separated by spaces
 */
function handle_occupation(args, msg) {
	if (trace) {log(`handle_occupation(${args},${msg.content})`)}
	var char = getObj("character", args[1]);
	if (char) {
		log(msg.content.slice(33));
		var occ = myGet('OCCUPATION', char.id, "Farmer");
		if (occ in occupational_skills) {
			_.each(occupational_skills[occ], function (skl) {
				sk = skl.split("/");
				skn = findSkill(char, sk[0]).slice(0, -4);
				log(skn);
				mySet(skn + "ML", char.id, sk[1]);

			});
		}
	}
}
function handle_gmrand(args, msg) {
	if (trace) {log(`handle_gmrand(${args},${msg.content})`)}
	if (!msg.selected) {return;}
	//log(msg.selected);
	var objid = msg.selected[randomInteger(msg.selected.length) - 1];
	//log(objid['_id']);
	var obj = getObj("graphic", objid['_id']);
	sendGMPing(obj.get('left'), obj.get('top'), obj.get('pageid'), "", true);
	sendChat("Random Character", "/w gm " + obj.get('name'));
}

function handle_rand(args, msg) {
	if (trace) {log(`handle_rand(${args},${msg.content})`)}
	if (!msg.selected) {return;}
	//log(msg.selected);
	var objid = msg.selected[randomInteger(msg.selected.length) - 1];
	//log(objid['_id']);
	var obj = getObj("graphic", objid['_id']);
	sendPing(obj.get('left'), obj.get('top'), obj.get('pageid'), "", true);
	sendChat("Random Character", obj.get('name'));
	return { objid, obj };
}

function handle_addtime(args, msg) {
	if (trace) {log(`handle_addtime(${args},${msg.content})`)}
	state.MainGameNS.GameTime += parseInt(args[1]);
	sendChat("Timekeeper", getHarnTimeStr(state.MainGameNS.GameTime));
	//log(getHarnTimeStr(state.MainGameNS.GameTime));
}

function handle_settime(args, msg) {
	if (trace) {log(`handle_settime(${args},${msg.content})`)}
	setHarnTime(args);
	log(getHarnTimeStr(state.MainGameNS.GameTime));
}

function handle_time(args, msg) {
	if (trace) {log(`handle_time(${args},${msg.content})`)}
	log(getHarnTimeStr(state.MainGameNS.GameTime));
	sendChat("Timekeeper", getHarnTimeStr(state.MainGameNS.GameTime));
}

function handle_loc(msg, args) {
	if (trace) {log(`handle_loc(${args},${msg.content})`)}
	gethitloc(args[1], args[2], args[3]);
}

function handle_attack_melee_table(args, msg) {
	if (trace) {log(`handle_attack_melee_table(${args},${msg.content})`)}
	sendChat(msg.who, "Melee Attack Result<br/>" + attack_melee[args[1]][args[2]][args[3]] + "<br/>");
}

function handle_out(args, msg) {
	if (trace) {log(`handle_out(${args},${msg.content})`)}
	var g = getObj(msg.selected[0]['_type'], msg.selected[0]['_id']);
	out(g.get("represents"));
}

/**
 * handle the tokemove command (no clue)
 * @param {Message} msg the message representing the command, with arguments separated by spaces
 */
function handle_tokemove(args, msg) {
	if (trace) {log(`handle_tokemove(${args},${msg.content})`)}
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
	if (trace) {log(`handle_clearmove(${args},${msg.content})`)}
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
	if (trace) {log(`handle_addItem(${args},${msg.content})`)}
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
	if (trace) {log(`handle_ca(${args},${msg.content})`)}
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
	if (trace) {log(`handle_xin(${args},${msg.content})`)}
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
 * This command appears obsolete.
 * @param {Message} msg the message representing the command, with arguments separated by spaces
 */
function handle_move(args, msg) {
	if (trace) {log(`handle_move(${args},${msg.content})`)}
	if (msg.selected) {
		var g = getObj(msg.selected[0]['_type'], msg.selected[0]['_id']);
		//log(tokemove(g))
	} else {
		log("Please select token");
	}
}

/**
 * ?
 * @param {Message} msg the message representing the command, with arguments separated by spaces
 */
function handle_invin(args, msg) {
	if (trace) {log(`handle_invin(${args},${msg.content})`)}
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
 * The main command used for attacking
 * @param {Message} msg the message representing the command, with arguments separated by spaces
 */
function handle_sheetattack(args, msg) {
	if (trace) {log(`handle_sheetattack(${args},${msg.content})`)}
	if (!/[^ ]{4+}/.test(msg.content)) {sendChat("API","Syntax error")}
	if (args.length > 4) {
		handle_attack(args, msg);
	}
}

/**
 * Calculate distance between two tokens?.
 * @param {Message} msg the message representing the command, with arguments separated by spaces
 */
function handle_tokendis(args, msg) {
	if (trace) {log(`handle_tokendis(${args},${msg.content})`)}
	dis = tokendistance(getObj("graphic", args[1]), getObj("graphic", args[2]));
	sendChat("Token Distance", dis[0] + " " + dis[1] + "<br/>");
}

function initializeTables(playerid) {
	if (trace) {log(`>initializeTables(${playerid})`)}
	var gms = findObjs({type:'player'}).filter((p)=>playerIsGM(p.id));
	var gmId;
	if (gms.length>0) {
		gmId = gms[0].id;
	} else {
		log("error - no gm found")
		if (playerId != 0) {
			gmId = playerid
		} else {
			return;
		}
	}
	
	var out = "";
	var outarmor = "";
	var outweap = "";
	Object.keys(prices).sort().forEach(function (k) {
		if (k in weapons_table) {
			outweap += "|" + k;
		} else if (k.substr(0, k.lastIndexOf(",")) in armor_coverage) {
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
		name: 'ItemList'
	})[0];
	if (mac) {
		mac.set('action', out);
	} else {
		createObj('macro', {
			name: 'ItemList',
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
		name: 'WeaponList'
	})[0];
	if (mac) {
		log("registering #WeaponList");
		mac.set('action', outweap);
	} else {
		log("creating #WeaponList");
		createObj('macro', {
			name: 'WeaponList',
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
		name: 'ArmorList'
	})[0];
	if (mac) {
		mac.set('action', outarmor);
	} else {
		createObj('macro', {
			name: 'ArmorList',
			visibleto: "all",
			action: outarmor,
			playerid: gmId
		});
	}

	var chars = findObjs({ _type: "character",});
	
	chars.forEach( function(c) {

	    setSkillList(c);
	    
	    setWeaponsList(c);
	});
	
	
	if (trace) {log("<initializeTables()")}
	return;
}

function getWep(char) {
    return filterObjs(function(obj) {
		obn = obj.get('name');
		if (obn) {
			if (obn.includes("WEAPON_NAME")
					&& (obj.get("_characterid") == char.id)) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	});
}

function setWeaponsList(char) {

	var out2 = "";
	getWep(char).forEach( function(w) {
	    out2 += "|" + myGet(w.get('name'),char.id,"");
	})
	out2 = out2.replace(/,/g, "&#44;");
	out2 = "?{Weapon" + out2 + "}";
	var mac = findObjs({
		type: 'ability',
		_characterid: char.id,
		name: 'Weapons'
	})[0];

	if (mac) {
		mac.set('action', out2);
	} else {
		createObj('ability', {
			name: 'Weapons',
			action: out2,
			_characterid: char.id
		});
	}
	
	

}

function setSkillList(char) {
	var out = "";
	var sl = skillList(char);

	for (i = 0; i < sl.length; i++) {
		out += "|" + sl[i];
	}

	//log(out+"\n\n");
	out = out.replace(/,/g, "&#44;").replace(/\)/g,'&#41;');
	out = "?{Skills" + out + "}";
	var mac = findObjs({
		type: 'ability',
		_characterid: char.id,
		name: 'SkillList'
	})[0];
	if (mac) {
		mac.set('action', out);
	} else {
		createObj('ability', {
			name: 'SkillList',
			action: out,
			_characterid: char.id
		});
	}
}


function addinjury(loc, injstr, charid) {
	if((injstr.indexOf("Fum") == 0) || (injstr.indexOf("Stu") == 0)) {
		var sev = injstr.slice(3,4);
		var lvl = parseInt(injstr.slice(4,5));
	} else {
		var sev = injstr.slice(0,1);
		var lvl = parseInt(injstr.slice(1,2))
	}
	var mid = makeid();
	
	mySet("repeating_injury_"+ mid +"_INJURY_LOCATION",charid,loc);
	mySet("repeating_injury_"+ mid +"_INJURY_SEVERITY",charid,sev);
	mySet("repeating_injury_"+ mid +"_INJURY_LEVEL",charid,lvl);
	mySet("repeating_injury_"+ mid +"_INJURY_HEALINGROLL",charid,"");
	mySet("repeating_injury_"+ mid +"_INJURY_INFECTED",charid,0);
	mySet("repeating_injury_"+ mid +"_INJURY_INFECTED_FEEDBACK",charid,0);
	
	return;	
}



function getrange(weapname, dist){
	if (!(weapname in missile_range)) { weapname = "Melee";}
	for (var i = 4; i >= 0; i--) {
		if((missile_range[weapname][i][0]*5)>dist) {
			if(i==0) {
				var penalty = missle_close_range_mod;
			} else {
				var penalty = (i-1)*20;
			}
			var impact = missile_range[weapname][i][1];
		}
	}
	return [penalty,impact]
}



function handle_newturn(args, msg) {
	turnorder = [];

	var currentPageGraphics = findObjs({                              
		_pageid: Campaign().get("playerpageid"),                              
		_type: "graphic",                          
	});

	_.each(currentPageGraphics, function(obj) {    

		if(obj.get('represents').startsWith('-M') && (obj.get('layer') == 'objects')  && !obj.get('status_skull')) {
		    
        	if (msg.selected) {
        	    for(i=0;i<msg.selected.length;i++) {
        	        if (obj.id == msg.selected[i]["_id"]) {
        	            turnPush(obj);
        	        }
        	    }
        	} else {
        	    turnPush(obj);
        	}
		}
	});
	Campaign().set("turnorder", JSON.stringify(turnorder));

	state.MainGameNS.GameTime += 10;
	sendChat("New Round", getHarnTimeStr(state.MainGameNS.GameTime));
}

function turnPush(obj) {
	if (obj.get('bar3_value')) {
		var pp = (parseInt(obj.get('bar3_value')) + parseInt(myGet('ENCUMBRANCE',obj.get("represents"),0)))*5;
	} else {
		var pp = (parseInt(myGet('UNIVERSAL_PENALTY',obj.get("represents"),0)) + parseInt(myGet('ENCUMBRANCE',obj.get("represents"),0)))*5;
	}            
	obj.set('lastmove',obj.get('left')+','+obj.get('top'))
	
	if (obj.get('status_sleepy')) {
	    var initml = 0;
	} else {
	    if (myGet("IS_MOUNTED",  obj.get("represents"),0) == "on") {
	        var initml = Math.round(((parseInt(myGet("RIDING_ML",  obj.get("represents"),0)) + parseInt(myGet("STEED_INIT",  obj.get("represents"),0)))/2) - pp  + initRoll());
	    } else {
	        var initml = parseInt(myGet("INITIATIVE_ML",  obj.get("represents"),0)) - pp  + initRoll();
	    }
	}

	turnorder.push({
		id: obj.id,
		pr: initml,
		custom: ""
	});
}

function addWeapon(charid,weapon_name) {
	if (trace) {log("addWeapon("+charid+", "+weapon_name+")")}
	if (weapon_name in weapons_table) {

		var mid = makeid();
		mySet("repeating_weapon_"+ mid +"_WEAPON_NAME",charid,weapon_name);
		if(weapon_name in prices) {mySet("repeating_weapon_"+ mid +"_WEAPON_WGT",charid,prices[weapon_name]["weight"]);} else {
			mySet("repeating_weapon_"+ mid +"_WEAPON_WGT",charid,0);
		}
		mySet("repeating_weapon_"+ mid +"_WEAPON_WQ",charid,weapons_table[weapon_name][0]);
		mySet("repeating_weapon_"+ mid +"_WEAPON_ATK",charid,weapons_table[weapon_name][1]);
		mySet("repeating_weapon_"+ mid +"_WEAPON_DEF",charid,weapons_table[weapon_name][2]);
		mySet("repeating_weapon_"+ mid +"_WEAPON_HM",charid,weapons_table[weapon_name][3]);
		mySet("repeating_weapon_"+ mid +"_WEAPON_B",charid,weapons_table[weapon_name][4]);
		mySet("repeating_weapon_"+ mid +"_WEAPON_E",charid,weapons_table[weapon_name][5]);
		mySet("repeating_weapon_"+ mid +"_WEAPON_P",charid,weapons_table[weapon_name][6]);
		
		if (weapon_name.indexOf("Unarmed") == 0) {
		    mySet("repeating_weapon_"+ mid +"_WEAPON_ML",charid,myGet("UNARMED_ML",charid,0));
		} else {
    		var wepskill  = filterObjs(function(obj) {
    			obn = obj.get('name');
    			if(obn) {
    				if((obn.indexOf("COMBATSKILL_NAME")) !== -1 && (obj.get("_characterid") == charid) && (weapon_name.indexOf(obj.get("current")) !== -1)) {return true;   
    				} else {return false;}
    			} else {return false;}
    		});
    
    		if (wepskill[0]) {
    			mySet("repeating_weapon_"+ mid +"_WEAPON_ML",charid,myGet(wepskill[0].get('name').slice(0,-4)+"ML",charid,0));
    		} 
		}
		mySet("repeating_weapon_"+ mid +"_WEAPON_AML",charid,0);
		mySet("repeating_weapon_"+ mid +"_WEAPON_DML",charid,0);
		mySet("repeating_weapon_"+ mid +"_WEAPON_NOTE",charid," ");
	}
	var mid = makeid();
	mySet("repeating_inventoryitems_"+ mid +"_INVENTORY_NAME",charid,weapon_name);
	mySet("repeating_inventoryitems_"+ mid +"_INVENTORY_TYPE",charid,"Weapon");
	mySet("repeating_inventoryitems_"+ mid +"_INVENTORY_LOCATION",charid,"");
	mySet("repeating_inventoryitems_"+ mid +"_INVENTORY_Q",charid,"0");
	mySet("repeating_inventoryitems_"+ mid +"_INVENTORY_QUANTITY",charid,"1");
	mySet("repeating_inventoryitems_"+ mid +"_INVENTORY_WORN",charid,"on");


	if(weapon_name in prices) {
	    mySet("repeating_inventoryitems_"+ mid +"_INVENTORY_WGT",charid,prices[weapon_name]["weight"]);
	    mySet("repeating_inventoryitems_"+ mid +"_INVENTORY_PRICE",charid,prices[weapon_name]["price"]);
	} else {
		mySet("repeating_inventoryitems_"+ mid +"_INVENTORY_WGT",charid,0);
		mySet("repeating_inventoryitems_"+ mid +"_INVENTORY_PRICE",charid,0)
	}

}

function addItem(charid, item) {
	if (trace) {log("addItem("+charid+", "+item+")")}
    if (item in weapons_table) {
        addWeapon(charid, item);
    } else {
    	var mid = makeid();
    	mySet("repeating_inventoryitems_"+ mid +"_INVENTORY_NAME",charid,item);
    	if (item.substr(0,item.lastIndexOf(",")) in armor_coverage) {
    	    mySet("repeating_inventoryitems_"+ mid +"_INVENTORY_TYPE",charid,"Armor");
    	} else {
    	    mySet("repeating_inventoryitems_"+ mid +"_INVENTORY_TYPE",charid,"Item");
    	}
    	
    	mySet("repeating_inventoryitems_"+ mid +"_INVENTORY_NOTES",charid,"");
    	mySet("repeating_inventoryitems_"+ mid +"_INVENTORY_Q",charid,"0");
    	mySet("repeating_inventoryitems_"+ mid +"_INVENTORY_QUANTITY",charid,"1");
    	mySet("repeating_inventoryitems_"+ mid +"_INVENTORY_WORN",charid,"on");
    	log(item)
    
    
    	if(item in prices) {
    	    mySet("repeating_inventoryitems_"+ mid +"_INVENTORY_WGT",charid,prices[item]["weight"]);
    	    mySet("repeating_inventoryitems_"+ mid +"_INVENTORY_PRICE",charid,prices[item]["price"]);
    	} else {
    		mySet("repeating_inventoryitems_"+ mid +"_INVENTORY_WGT",charid,0);
    		mySet("repeating_inventoryitems_"+ mid +"_INVENTORY_PRICE",charid,0)
    	}
    }
}     

function addArmor(charid, item) {
	if (trace) {log("addIArmor("+charid+", "+item+")")}
	var mid = makeid();
	mySet("repeating_inventoryitems_"+ mid +"_INVENTORY_NAME",charid,item);
	mySet("repeating_inventoryitems_"+ mid +"_INVENTORY_TYPE",charid,"Armor");
	mySet("repeating_inventoryitems_"+ mid +"_INVENTORY_NOTES",charid,"");
	mySet("repeating_inventoryitems_"+ mid +"_INVENTORY_Q",charid,"0");
	mySet("repeating_inventoryitems_"+ mid +"_INVENTORY_QUANTITY",charid,"1");
	mySet("repeating_inventoryitems_"+ mid +"_INVENTORY_WORN",charid,"on");


	if(item in prices) {
	    mySet("repeating_inventoryitems_"+ mid +"_INVENTORY_WGT",charid,prices[item]["weight"]);
	    mySet("repeating_inventoryitems_"+ mid +"_INVENTORY_PRICE",charid,prices[item]["price"]);
	} else {
		mySet("repeating_inventoryitems_"+ mid +"_INVENTORY_WGT",charid,0);
		mySet("repeating_inventoryitems_"+ mid +"_INVENTORY_PRICE",charid,0)
	}
}  

function calcArmor(charid) {

	var atts  = filterObjs(function(obj) {
		obn = obj.get('name');
		if(obn) {
			if((obn.indexOf("INVENTORY_NAME")) !== -1 && (obj.get("_characterid") == charid)) {return true;   
			} else {return false;}
		} else {return false;}
	});



	var newa = coverage2loc
	_.each(newa,  function(ob1) { 
		ob1["COV"]="";
		ob1["AQ"]=0;
		ob1["B"]=0;
		ob1["E"]=0;
		ob1["P"]=0;
		ob1["F"]=0;



		});
	_.each(atts,  function(ob1) { 


		var ojn = ob1.get('name');
		if(myGet(ojn.slice(0, -4) + "TYPE", charid, 0) == "Armor") {
    		if(myGet(ojn.slice(0, -4) + "WORN", charid, 0) == "on") {
        		ojv = ob1.get('current');
        		if(ojv.slice(ojv.lastIndexOf(",")+2) in armor_prot) {
        
        			var art = armor_prot[ojv.slice(ojv.lastIndexOf(",")+2)];

        			if(ojv.slice(0,ojv.lastIndexOf(",")) in armor_coverage) {
            			var arl = armor_coverage[ojv.slice(0,ojv.lastIndexOf(","))]["coverage"];
            			for (var i = 0; i < arl.length; i++) {
            				newa[arl[i]]["COV"] += " "+art[0];
            				aq = parseInt(myGet(ojn.slice(0,-4)+"Q",charid,0))
            				newa[arl[i]]["AQ"] += aq;
            				newa[arl[i]]["B"] += parseInt(art[1])+aq;
            				newa[arl[i]]["E"] += parseInt(art[2])+aq;
            				newa[arl[i]]["P"] += parseInt(art[3])+aq;
            				newa[arl[i]]["F"] += parseInt(art[4])+aq;
            			}
        			}
        		} 
    		}
		}
	});

	_.each(newa,  function(ob1) { 
		mySet(ob1["LOC"]+"_LAYERS",charid,ob1["COV"]);
		mySet(ob1["LOC"]+"_AQ",charid,ob1["AQ"]);
		mySet(ob1["LOC"]+"_B",charid,ob1["B"]);
		mySet(ob1["LOC"]+"_E",charid,ob1["E"]);
		mySet(ob1["LOC"]+"_P",charid,ob1["P"]);
		mySet(ob1["LOC"]+"_F",charid,ob1["F"]);

	});



}
function opad(num) {
	return ("0" + num).slice(-2);
}
function getHarnTimeStr(timef) {
	var year =  Math.floor(timef/ 31104000);
	var month = Math.floor((timef- (year * 31104000))/2592000)+1;
	var mday = Math.floor((timef- (year *31104000) - ((month-1) * 2592000))/86400)+1;
	var day = Math.floor((timef- (year * 31104000))/86400);
	var hour = Math.floor((timef- (year *31104000) - (day * 86400))/3600);
	var minute = Math.floor((timef- (year *31104000) - (day * 86400) - (hour *3600))/60);
	var sec = Math.floor(timef - (year *31104000) - (day * 86400) - (hour *3600) - (minute *60));
	return (year+720).toString() + '-' + month.toString() + '('+ months[(month-1)] +')-' + mday.toString() +' ' + opad(hour.toString()) + ':' + opad(minute.toString()) +':' + opad(sec.toString() ) ;

}
function setHarnTime(args) {
	var seconds = (parseFloat(args[1]) -720) * 31104000;
	if (args[2]) {
		seconds = seconds + (parseFloat(args[2])-1) * 2592000;
	}
	if (args[3]) {
		seconds = seconds + (parseFloat(args[3])-1) * 86400;

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
			name:attname,
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
			name:attname,
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
			name:attname,
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
			name:attname,
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

    var dis=0;
    for(i=2;i<moves.length-1;i=i+2) {
        dis = dis + pixel2dis(parseFloat(moves[i-2]),parseFloat(moves[i-1]),parseFloat(moves[i]),parseFloat(moves[i+1]));
    }

    dis = dis + pixel2dis(parseFloat(moves[moves.length-2]),parseFloat(moves[moves.length-1]),parseFloat(toke.get("left")),parseFloat(toke.get("top")));
    dis =dis * curScale;
    dis = Math.round(dis * 10) / 10;
    return dis;
}
function pixel2dis(left1,top1,left2,top2) {
	var lDist = Math.abs(left1-left2)/70;
	var tDist = Math.abs(top1-top2)/70;
	var dist = 0;
	dist = Math.sqrt(lDist * lDist + tDist * tDist);
	return dist;
}
function tokendistance(token1,token2) {

	var curPage = getObj("page", token1.get("_pageid"));
	var curScale = curPage.get("scale_number"); // scale for 1 unit, eg. 1 unit = 5ft 
	var curUnit = curPage.get("scale_units"); // ft, m, km, mi etc.
	var gridSize = 70;
	var lDist = Math.abs(token1.get("left")-token2.get("left"))/gridSize;
	var tDist = Math.abs(token1.get("top")-token2.get("top"))/gridSize;
	var dist = Math.sqrt(lDist * lDist + tDist * tDist);
	var distSQ = dist;

	dist = dist * curScale;
	dist = Math.round(dist * 10) / 10;
	return [dist, curUnit];
}


function skillList(char) {
    
	var slist = [];
	
	slist.push.apply(slist,autoskillsnames);

	var atts = findObjs({                              
		_characterid: char.id,                              
		_type: "attribute",                          
	});
	
	_.each(atts,  function(ob1) {    
		
		ojn = ob1.get('name')
		ojv = ob1.get('current')

		if ((ojv) && (ojn.indexOf("SKILL_NAME") !== -1)) {
			_.each(_.keys(skilllist), function(obj) {
				if (ojv.indexOf(obj) !== -1)  {
					slist.push(ojv);
				}
			});
		}
	});
	return slist;
}




function findSkill(char,skillname) {
    
    var nameout = "False"
    if (skillname.toUpperCase() in autoskills) {
        nameout = skillname.toUpperCase() + "_NAME"
    } else {
        var atts = findObjs({                              
          _characterid: char.id,                              
          _type: "attribute",                          
        });
        
        _.each(atts,  function(ob1) {    
            
    
            ojn = ob1.get('name')
            ojv = ob1.get('current')

            if (ojn.indexOf("SKILL_NAME") !== -1) {
                _.each(_.keys(skilllist), function(obj) {
                    if ((ojv.indexOf(obj) !== -1) && (skillname.indexOf(obj) !== -1)) {
                        nameout = ojn;
                    }
                });
            }
        });
    }
    if (nameout == "False") {

        _.each(_.keys(skilllist), function(obj) {
            if (skillname.indexOf(obj) !== -1) {
                var mid = makeid();
                
                if (skilllist[obj]["type"] == "PHYSICAL") {
                    mySet("repeating_physicalskill_"+ mid +"_PHYSICALSKILL_NAME",char.id,obj);
                    mySet("repeating_physicalskill_"+ mid +"_PHYSICALSKILL_SB",char.id,0);
                    mySet("repeating_physicalskill_"+ mid +"_PHYSICALSKILL_ML",char.id,0);
                    nameout = "repeating_physicalskill_"+ mid +"_PHYSICALSKILL_NAME";
                } else if (skilllist[obj]["type"] == "LORE") {
                    mySet("repeating_loreskill_"+ mid +"_LORESKILL_NAME",char.id,obj);
                    mySet("repeating_loreskill_"+ mid +"_LORESKILL_SB",char.id,0);
                    mySet("repeating_loreskill_"+ mid +"_LORESKILL_ML",char.id,0);
                    nameout = "repeating_loreskill_"+ mid +"_LORESKILL_NAME";
                } else if (skilllist[obj]["type"] == "MAGIC") {
                    mySet("repeating_magicskill_"+ mid +"_MAGICSKILL_NAME",char.id,obj);
                    mySet("repeating_magicskill_"+ mid +"_MAGICSKILL_SB",char.id,0);
                    mySet("repeating_magicskill_"+ mid +"_MAGICSKILL_ML",char.id,0);
                    nameout = "repeating_magicskill_"+ mid +"_MAGICSKILL_NAME";
                } else if (skilllist[obj]["type"] == "COMBAT") {
                    mySet("repeating_combatskill_"+ mid +"_COMBATSKILL_NAME",char.id,obj);
                    mySet("repeating_combatskill_"+ mid +"_COMBATSKILL_SB",char.id,0);
                    mySet("repeating_combatskill_"+ mid +"_COMBATSKILL_ML",char.id,0);
                    nameout = "repeating_combatskill_"+ mid +"_COMBATSKILL_NAME";
                } else if (skilllist[obj]["type"] == "COMMUNICATION") {
                    mySet("repeating_communicationskill_"+ mid +"_COMMUNICATIONSKILL_NAME",char.id,obj);
                    mySet("repeating_communicationskill_"+ mid +"_COMMUNICATIONSKILL_SB",char.id,0);
                    mySet("repeating_communicationskill_"+ mid +"_COMMUNICATIONSKILL_ML",char.id,0);
                    nameout = "repeating_communicationskill_"+ mid +"_COMMUNICATIONSKILL_NAME";
                } else if (skilllist[obj]["type"] == "RITUAL") {
                    mySet("repeating_ritualskill_"+ mid +"_RITUALSKILL_NAME",char.id,obj);
                    mySet("repeating_ritualskill_"+ mid +"_RITUALSKILL_SB",char.id,0);
                    mySet("repeating_ritualskill_"+ mid +"_RITUALSKILL_ML",char.id,0);
                    nameout = "repeating_ritualskill_"+ mid +"_RITUALSKILL_NAME";
                }
            }
        });

    }
    
    return nameout;
}


function calcSB(char,msg) {

    
    var rolls = ["STR","STA","DEX","AGL","INT","AUR","WIL","EYE","HRG","SML","VOI","CML","FRAME"]
    _.each(rolls, function(attname) {
        var r = randomInteger(6) + randomInteger(6) + randomInteger(6);
        myGet(attname,char.id,r);
    });

    _.each(_.keys(autoskills), function(skillname) {

        myGet(skillname+"_SB",char.id,1);
    });


    
    var atts = findObjs({                              
      _characterid: char.id,                              
      _type: "attribute",                          
    });
    var sss = myGet('SUNSIGN', char.id,"Ulandus").split('-');

    _.each(atts,  function(ob1) {    
        

        ojn = ob1.get('name')
        ojv = ob1.get('current')

        if (ojn.indexOf("SKILL_NAME") !== -1){
            
            _.each(_.keys(skilllist), function(obj) {
                if (ojv.indexOf(obj) !== -1) {
                    var sb = Math.round(((Number(myGet(skilllist[obj]["sba"][0], char.id))+Number(myGet(skilllist[obj]["sba"][1], char.id))+Number(myGet(skilllist[obj]["sba"][2], char.id)))/3));
                    var sb1 = 0;
                    var sb2 = 0;
                    if (sss.length == 2) {

                        if (sss[0].slice(0,3) in skilllist[obj]["ssm"]) {
                        sb1 = Number(skilllist[obj]["ssm"][sss[0].slice(0,3)])
                        }
                        if (sss[1].slice(0,3) in skilllist[obj]["ssm"]) {
                        sb2 = Number(skilllist[obj]["ssm"][sss[1].slice(0,3)])
                        }
                        if (sb1>sb2) {
                            sb += sb1;
                        } else {
                            sb += sb2;
                        }

                    } else {
                        if (sss[0].slice(0,3) in skilllist[obj]["ssm"]) {
                        sb = sb + Number(skilllist[obj]["ssm"][sss[0].slice(0,3)])
                        } 
                    }
                                       
                    log(obj + " - " + Math.round(sb))
                    if ( msg.content.indexOf("?") !== -1) {
                        myGet(ojn.slice(0,-4)+"SB",char.id, sb);
                    }
                    else  {
                        mySet(ojn.slice(0,-4)+"SB",char.id, sb);
                    }
                    var ml = parseInt(myGet(ojn.slice(0,-4)+"ML",char.id,0));
                    
                    if((!ml) || (ml == 0)) {
                        if(skilllist[obj]["oml"]) {
                            mySet(ojn.slice(0,-4)+"ML",char.id,(sb*parseInt(skilllist[obj]["oml"])))
                        }
                    } else if ((parseInt(ml) > 0) && (parseInt(ml) < sb)){
                        if(skilllist[obj]["oml"]) {
                            mySet(ojn.slice(0,-4)+"ML",char.id,(sb*parseInt(ml)))
                        }
                    }
                }
            });
        }
        if (ojn.indexOf("_SB") !== -1){
            
            _.each(_.keys(skilllist), function(obj) {
                if (ojn.indexOf(obj) !== -1) {
                    var sb = Math.round(((Number(myGet(skilllist[obj]["sba"][0], char.id))+Number(myGet(skilllist[obj]["sba"][1], char.id))+Number(myGet(skilllist[obj]["sba"][2], char.id)))/3));   
                    var sb1 = 0;
                    var sb2 = 0;
                    
                    if (sss.length == 2) {
                        if (sss[0].slice(0,3) in skilllist[obj]["ssm"]) {
                        sb1 = Number(skilllist[obj]["ssm"][sss[0].slice(0,3)])
                        }
                        if (sss[1].slice(0,3) in skilllist[obj]["ssm"]) {
                        sb2 = Number(skilllist[obj]["ssm"][sss[1].slice(0,3)])
                        }
                        if(sb1>sb2) {
                            sb += sb1
                        } else {
                            sb += sb2
                        }
                    } else {
                        if (sss[0].slice(0,3) in skilllist[obj]["ssm"]) {
                        sb = sb + Number(skilllist[obj]["ssm"][sss[0].slice(0,3)])
                        } 
                    }                  
                    if ( msg.content.indexOf("?") !== -1) {
                        myGet(ojn,char.id, sb);
                    }
                    else  {
                        mySet(ojn,char.id, sb);
                    }
                    var ml = parseInt(myGet(ojn.slice(0,-2)+"ML",char.id,0));
                    
                    if((!ml) || (ml == 0)) {
                        if(skilllist[obj]["oml"]) {
                            mySet(ojn.slice(0,-2)+"ML",char.id,(sb*parseInt(skilllist[obj]["oml"])))
                        }
                    } else if ((parseInt(ml) > 0) && (parseInt(ml) < sb)){
                        if(skilllist[obj]["oml"]) {
                            mySet(ojn.slice(0,-2)+"ML",char.id,(sb*parseInt(ml)))
                        }
                    }
                    
                }

            });
        
        }
            
    });
    sendChat("API", "/w gm done calc SB");
}


function out(charid) {
    
    
    var char = getObj("character", charid);
    var atts = findObjs({                              
      _characterid: charid,                              
      _type: "attribute",    

    });
    log("=================================")
    _.each(atts,  function(ob1) {    
        ojn = ob1.get('name')
        ojv = ob1.get('current')
        log(ojn+ " - "+ojv)

            
    });
}
function invin(charid) {
    var char = getObj("character", charid);
    var atts = findObjs({                              
      _characterid: charid,                              
      _type: "attribute",    
      name: "TEXTAREA_NOTE"
    });

    if(atts[0]) {
        log("=================================")
        ojv = atts[0].get('current');
        log(atts[0]);
        if (ojv.length > 100) {
            ojv = ojv.replace(/\t/g,"")
            for (i = 0; i < 10; i++) {  
                ojv = ojv.replace(/  /g," ")
            }
        
            ojv = ojv.replace(/\n /g,"\n");
            ojv = ojv.replace(/\nOffspring:/g,"");
            ojv = ojv.replace(/\nOrphan:/g,"");
            lns = ojv.split("\n");
        
        
        
            var tv = lns[1].split(" ");
            var xi = 0;
    
            if(lns[xi].slice(0,15) == "Clothing/Armor:"){
                lns[xi] = lns[xi].slice(16);
                while((lns[xi].slice(0,8) !== "Weapons:") && (lns[xi].slice(0,6) !== "Notes:")) {
                    if(lns[xi].length >2) {addArmor(charid, lns[xi]);}
                    xi++;
            
                     
                }
        
            }
    
            if(lns[xi].slice(0,8) == "Weapons:"){
                lns[xi] = lns[xi].slice(9);
                while((lns[xi].slice(0,10) !== "Equipment:") && (lns[xi].slice(0,6) !== "Notes:")) {
                    if(lns[xi].length >2) {addWeapon(charid,lns[xi]);}
                    xi++;
                }
        
        
            }
    
            if(lns[xi].slice(0,10) == "Equipment:"){
                lns[xi] = lns[xi].slice(11);
                while(lns[xi].slice(0,6) !== "Notes:") {
                    if(lns[xi].length >2) {addItem(charid, lns[xi]);}
                    xi++;
                }
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

    if(atts[0]) {
        log("=================================")
        ojv = atts[0].get('current');
        //log(atts[0]);
        if (ojv.length > 100) {
        ojv = ojv.replace(/\t/g,"")
        for (i = 0; i < 10; i++) {  
            ojv = ojv.replace(/  /g," ")
        }
    
        ojv = ojv.replace(/\n /g,"\n");
        ojv = ojv.replace(/\nOffspring:/g,"");
        ojv = ojv.replace(/\nOrphan:/g,"");
        lns = ojv.split("\n");
    
    
    
        var tv = lns[1].split(" ");
        if(tv[0]!=="Strength"){
            log("no");
        } else {
            mySet("NAME",charid,lns[0]);
            mySet("STR",charid,parseInt(tv[1]));
            mySet("AGL",charid,parseInt(tv[3]));
            mySet("SML",charid,parseInt(tv[5]));
            mySet("WIL",charid,parseInt(tv[7]));
            mySet("CML",charid,parseInt(tv[9]));
            var tv = lns[2].split(" ");
            mySet("STA",charid,parseInt(tv[1]));
            mySet("EYE",charid,parseInt(tv[3]));
            mySet("VOI",charid,parseInt(tv[5]));
            mySet("AUR",charid,parseInt(tv[7]));
            mySet("END",charid,parseInt(tv[9]));
            var tv = lns[3].split(" ");
            mySet("DEX",charid,parseInt(tv[1]));
            mySet("HRG",charid,parseInt(tv[3]));
            mySet("INT",charid,parseInt(tv[5]));
            mySet("MORAL",charid,parseInt(tv[7]));
            mySet("SPECIES",charid,lns[4].slice(9));
        
            mySet("GENDER",charid,lns[5].slice(5));
            mySet("BIRTHDATE",charid,(lns[7].slice(12)+" "+lns[8].slice(11)+", "+lns[9].slice(12)));
            mySet("SUNSIGN",charid,lns[10].slice(10,-1));
            mySet("AGE",charid,lns[6].slice(5));
            mySet("PIETY",charid,lns[28].slice(7));
            mySet("HEIGHT",charid,lns[18].slice(8));
            mySet("FRAME",charid,lns[19].slice(7));
            mySet("WEIGHT",charid,lns[20].slice(8));
            mySet("COMPLEXION",charid,lns[23].slice(12));
            mySet("HAIR_COLORS",charid,lns[24].slice(12));
            mySet("EYE_COLOR",charid,lns[25].slice(11));
            mySet("CULTURE",charid,lns[11].slice(9));
            mySet("SOCIAL_CLASS",charid,lns[12].slice(13));
            mySet("SIBLING_RANK",charid,lns[13].slice(13));
            mySet("PARENT",charid,lns[15].slice(11));
            mySet("ESTRANGEMENT",charid,lns[16].slice(13));
            mySet("CLANHEAD",charid,lns[17].slice(10));


            
        
            
            var xi = 26;
            while(lns[xi].indexOf("Physical Skills:")==-1) {
                if(lns[xi].indexOf("Occupation:")!==-1){
                    char.set("name",lns[xi].slice(12)+getIndex())
                    mySet("OCCUPATION",charid,lns[xi].slice(12));
                }
                if(lns[xi].indexOf("Medical:")!==-1){
                    mySet("PHYSICAL",charid,lns[xi].slice(9));
                }
                if(lns[xi].indexOf("Psyche:")!==-1){
                    mySet("MENTAL",charid,lns[xi].slice(8));
                }
                if(lns[xi].indexOf("Diety:")!==-1){
                    mySet("DIETY",charid,lns[xi].slice(7));
                    var diety = lns[xi].slice(7);
                }
                if(lns[xi].indexOf("Piety:")!==-1){
                    mySet("PIETY",charid,lns[xi].slice(7));
                }
        
                xi++;
            }
            xi++;
            
            while(lns[xi] !== "Communications Skills:") {
                tv = lns[xi].replace(/ /g,"").split("/");
                if(tv.length > 1) {
                    if (tv[0] in autoskills) {
                        tv2 = tv[1].split("(SB:");
                        tv3 = tv2[1].split(")OML:");
                        mySet(tv[0]+"_SB",charid,tv3[0])
                        mySet(tv[0]+"_ML",charid,tv2[0])
                        
            
                    } else {
                        var tv2 = tv[1].split("(SB:");
                        var tv3 = tv2[1].split(")OML:");
                        var mid = makeid();
                        mySet("repeating_physicalskill_"+ mid +"_PHYSICALSKILL_NAME",charid,tv[0]);
                        mySet("repeating_physicalskill_"+ mid +"_PHYSICALSKILL_SB",charid,tv3[0]);
                        mySet("repeating_physicalskill_"+ mid +"_PHYSICALSKILL_ML",charid,tv2[0]);
                    }
                }
                xi++ 
            }
        
        
            xi++;
            while(lns[xi] !== "Combat Skills:") {
                var stv = lns[xi].replace(/ /g,"")
                var tv = stv.split("/");
                if(tv.length > 1) {
                    if (tv[0] in autoskills) {
                        var tv2 = tv[1].split("(SB:");
                        var tv3 = tv2[1].split(")OML:");
                        mySet(tv[0]+"_SB",charid,tv3[0])
                        mySet(tv[0]+"_ML",charid,tv2[0])
            
                    } else {
                        var tv2 = tv[1].split("(SB:");
                        var tv3 = tv2[1].split(")OML:");
                        var mid = makeid();
                        mySet("repeating_communicationskill_"+ mid +"_COMMUNICATIONSKILL_NAME",charid,tv[0]);
                        mySet("repeating_communicationskill_"+ mid +"_COMMUNICATIONSKILL_SB",charid,tv3[0]);
                        mySet("repeating_communicationskill_"+ mid +"_COMMUNICATIONSKILL_ML",charid,tv2[0]);
                    }
                }
                xi++ 
            }
        
            xi++;
            while(lns[xi] !== "Crafts & Lore Skills:") {
                tv = lns[xi].replace(/ /g,"").split("/");
                if(tv.length > 1) {
                    if (tv[0] in autoskills) {
                        tv2 = tv[1].split("(SB:");
                        tv3 = tv2[1].split(")OML:");
                        mySet(tv[0]+"_SB",charid,tv3[0])
                        mySet(tv[0]+"_ML",charid,tv2[0])
                        
            
                    } else {
                        var tv2 = tv[1].split("(SB:");
                        var tv3 = tv2[1].split(")OML:");
                        var mid = makeid();
                        mySet("repeating_combatskill_"+ mid +"_COMBATSKILL_NAME",charid,tv[0]);
                        mySet("repeating_combatskill_"+ mid +"_COMBATSKILL_SB",charid,tv3[0]);
                        mySet("repeating_combatskill_"+ mid +"_COMBATSKILL_ML",charid,tv2[0]);
                    }
                }
                xi++ 
            }
            
        
            xi++;
            
            
            while(lns[xi] !== "Convocaton Skills:") {
                tv = lns[xi].replace(/ /g,"").split("/");
        
                if(tv.length > 1) {
                    var tv2 = tv[1].split("(SB:");
                    var tv3 = tv2[1].split(")OML:");
                    var mid = makeid();
                    mySet("repeating_loreskill_"+ mid +"_LORESKILL_NAME",charid,tv[0]);
                    mySet("repeating_loreskill_"+ mid +"_LORESKILL_SB",charid,tv3[0]);
                    mySet("repeating_loreskill_"+ mid +"_LORESKILL_ML",charid,tv2[0]);
                }
                xi++ 
            }
        
            xi++;
        
            while(lns[xi] !== "Psionics Skills:") {
                tv = lns[xi].replace(/ /g,"").split("/");
        
                if(tv.length > 1) {
                    var tv2 = tv[1].split("(SB:");
                    var tv3 = tv2[1].split(")OML:");
                    var mid = makeid();
                    mySet("repeating_magicskill_"+ mid +"_MAGICSKILL_NAME",charid,tv[0]);
                    mySet("repeating_magicskill_"+ mid +"_MAGICSKILL_SB",charid,tv3[0]);
                    mySet("repeating_magicskill_"+ mid +"_MAGICSKILL_ML",charid,tv2[0]);
                }
                xi++ 
            }
        
            xi++;
        
            
            while(lns[xi] !== "Ritual Skills:") {
                tv = lns[xi].replace(/ /g,"").split("/");
                if(tv.length > 1) {
                    var tv2 = tv[1].split("(SB:");
                    var tv3 = tv2[1].split(")OML:");
                    var mid = makeid();
                    mySet("repeating_psionics_"+ mid +"_TALENT_NAME",charid,tv[0]);
                    mySet("repeating_psionics_"+ mid +"_TALENT_FATIGUE",charid,"0");
                    mySet("repeating_psionics_"+ mid +"_TALENT_TIME",charid,"0");
                    mySet("repeating_psionics_"+ mid +"_TALENT_EML",charid,tv2[0]);
                    mySet("repeating_psionics_"+ mid +"_TALENT_NOTE",charid,lns[xi]);
        
                }
        
        
                xi++ 
            }
        
            xi++;
        
            while((lns[xi].slice(0,6) !== "Money:") && (lns[xi].slice(0,7) !== "Spells:") && (lns[xi].slice(0,12) !== "Invocations:")) {
                tv = lns[xi].replace(/ /g,"").split("/");
        
                if(tv.length > 1) {
                    var tv2 = tv[1].split("(SB:");
                    var tv3 = tv2[1].split(")OML:");
                    var mid = makeid();
                    mySet("repeating_ritualskill_"+ mid +"_RITUALSKILL_NAME",charid,tv[0]);
                    mySet("repeating_ritualskill_"+ mid +"_RITUALSKILL_SB",charid,tv3[0]);
                    mySet("repeating_ritualskill_"+ mid +"_RITUALSKILL_ML",charid,tv2[0]);    
                }
        
        
                xi++ 
            }
            if(lns[xi].slice(0,12) == "Invocations:"){
                lns[xi] = lns[xi].slice(12);
                while(lns[xi].slice(0,6) !== "Money:") {
                    tv = lns[xi].split("/");
                    if(tv.length > 1) {
        
                        var mid = makeid();
                        mySet("repeating_rituals_"+ mid +"_RITUAL_NAME",charid,tv[0]);
                        mySet("repeating_rituals_"+ mid +"_RITUAL_RELIGION",charid,diety);
						mySet("repeating_rituals_"+ mid +"_RITUAL_LEVEL",charid,tv[1]);
						mySet("repeating_rituals_"+ mid +"_RITUAL_ML",charid,0);
                        mySet("repeating_rituals_"+ mid +"_RITUAL_EML",charid,0);
                        mySet("repeating_rituals_"+ mid +"_RITUAL_NOTE",charid,lns[xi]);
            
                    }
            
            
                    xi++ 
                }
        
            }
            if(lns[xi].slice(0,7) == "Spells:"){
                lns[xi] = lns[xi].slice(7);
                while(lns[xi].slice(0,6) !== "Money:") {
                    tv = lns[xi].split("/");
                    if(tv.length > 1) {
        
                        var mid = makeid();
                        mySet("repeating_spells_"+ mid +"_SPELL_NAME",charid,tv[0]);
                        mySet("repeating_spells_"+ mid +"_SPELL_CONVOCATION",charid,"");
						mySet("repeating_spells_"+ mid +"_SPELL_LEVEL",charid,tv[1]);
						mySet("repeating_spells_"+ mid +"_SPELL_ML",charid,0);
                        mySet("repeating_spells_"+ mid +"_SPELL_EML",charid,0);
                        mySet("repeating_spells_"+ mid +"_SPELL_NOTE",charid,"");

            
                    }
            
            
                    xi++ 
                }
        
            }
            if(lns[xi].slice(0,6) == "Money:") {
                var mid = makeid();
                mySet("repeating_inventoryitems_"+ mid +"_INVENTORY_NAME",charid,lns[xi]);
                mySet("repeating_inventoryitems_"+ mid +"_INVENTORY_WGT",charid,parseFloat(lns[xi].split(":")[1].slice(0,-1))/240);
            }
            xi++;
            if(lns[xi].slice(0,15) == "Clothing/Armor:"){
                lns[xi] = lns[xi].slice(16);
                while((lns[xi].slice(0,8) !== "Weapons:") && (lns[xi].slice(0,6) !== "Notes:")) {
                    addItem(charid, lns[xi]);
                    xi++;
            
                     
                }
        
            }

            if(lns[xi].slice(0,8) == "Weapons:"){
                lns[xi] = lns[xi].slice(9);
                while((lns[xi].slice(0,10) !== "Equipment:") && (lns[xi].slice(0,6) !== "Notes:")) {
                    addWeapon(charid,lns[xi]);
                    xi++;
                }
        
        
            }

	            if(lns[xi].slice(0,10) == "Equipment:"){
	                lns[xi] = lns[xi].slice(11);
	                while(lns[xi].slice(0,6) !== "Notes:") {
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
    for (var i=0; i<acom.length; i++)  {
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

            var tt1 = scda.substring(22,scda.indexOf('</td></tr></tbody></table>'));
            var tt2 = tt1.split('</td></tr><tr><td>');
            var tt3 =[];
            for (var i=0; i<tt2.length; i++)  {
                tt3[i] = tt2[i].split('</td><td>')
            }
        log("p")
        var r1 = msg.inlinerolls[0].results.total;
        var r2 = msg.inlinerolls[1].results.total;
        var i1 = tt3.length-1;
        var i2 = tt3[0].length-1;
        for (var i=2; i<tt3.length; i++)  {
            if (r1 <= parseInt(tt3[i][0]) ) {
                i1 = i;
                break;            
            }
        }
        for (var i=1; i<tt3[0].length; i++)  {
            if (r2 <= parseInt(tt3[0][i]) ) {
                i2 = i;
                break;            
            }
        }
        var description = tt3[i1][i2].split(';');
        var out = '&{template:default} {{name=' + args[1] + '}} {{Rolls=' +  r1.toString() + ' ' + r2.toString() + '}} {{' + tt3[1][i2] + '= ' + description[0] + '}}';
        sendChat(msg.who, out);
        if (args[4] && description[1]) {
            log(args[4]);
            for (var i=1; i<description.length; i++) {
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
                    for (var j=2; j<commandLine.length; j++) {
                        out = out + ' ' + commandLine[j];
                    }
                    
                    sendChat(args[1], out);
                }
            }
        }
        });
}


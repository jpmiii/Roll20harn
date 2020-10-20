



on("ready", function() {
    if( ! state.MainGameNS ) {
        state.MainGameNS = { index: 0, dis: 0 };
    }
    log(getHarnTimeStr(state.MainGameNS.GameTime));
	log("loaded. trace: "+ trace);
	initializeTables(0);
	started = true;
});






on("chat:message", function(msg) {
if (trace) {log(`>chat:message(${msg.content})`);}
 if(msg.type == "api") {
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


 if (trace) {log("<chat:message")}
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
    } else if (obj.get('name').includes("WEAPON_NAME") && weapon_list_on) {
        setWeaponsList(obj.get("_characterid"));
    } else if (obj.get('name').includes("SKILL_NAME") && skill_list_on) {
        setSkillList(obj.get("_characterid"));
    } else if (obj.get('name') == "tab") {
		if (obj.get('current') == 2 && skill_list_on) {
	        setSkillList(obj.get("_characterid"));
		} else if (obj.get('current') == 3 && weapon_list_on) {
	        setWeaponsList(obj.get("_characterid"));
		}
    }
});

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



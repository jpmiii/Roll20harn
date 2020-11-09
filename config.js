//
//
// CONFIGURATION
//
// eslint-disable-line no-unused-vars
var trace = state.Harn.trace; // API debug logging

function handle_toggle_config(args, msg) {
    let who=(getObj('player',msg.playerid)||{get:()=>'API'}).get('_displayname');
    switch(args[1]) {
        case 'house_rule_additional_target_locations':
        case 'house_rule_occupations':
        case 'house_rule_items':
        case 'house_rule_skills':
        case 'generate_item_list':
        case 'skill_list_on':
        case 'weapon_list_on':
        case 'realtime':
        case 'gametime':
            state.Harn.config[args[1]]=!state.Harn.config[args[1]];
            sendChat('H&acirc;rn API', `/w "${who}" ${args[1]} set to ${state.Harn.config[args[1]]}`);
            break;
        case 'trace':
            trace = !trace;  // keep it as a local variable to simplify the code where it's used.
            state.Harn.trace = trace; // but persist it between restarts
            if (trace) log(`trace: ${trace}`);
            sendChat('H&acirc;rn API', `/w "${who}" trace set to ${trace}`);
            break;
        default:
            sendChat('H&acirc;rn API', `/w "${who}" Unkown config option ${args[1]} `)
        }
}
function handle_get_config(args, msg) {
    let who=(getObj('player',msg.playerid)||{get:()=>'API'}).get('_displayname');
    sendChat('H&acirc;rn API', `/w "${who}"
        ${_h.outer(
            _h.title("H&acirc;rn Config v", config.version),
            _h.group(
                _h.subhead('House Rules'),
                getConfigOption_house_rule_emlmax(),
                getConfigOption_house_rule_emlmin(),
                getConfigOption_house_rule_additional_target_locations(),
                getConfigOption_house_rule_occupations(),
                getConfigOption_house_rule_items(),
                getConfigOption_house_rule_skills(),
                getConfigOption_house_rule_randomize_init_roll(),
                getConfigOption_house_rule_missle_close_range_mod()
            ),
            _h.group(
                _h.subhead('UI Tweaks'),
                getConfigOption_realtime(),
                getConfigOption_gametime()
            ),
            _h.group(
                _h.subhead('API Optimization'),
                getConfigOption_trace(),
                getConfigOption_attack_template(),
                getConfigOption_generate_item_list(),
                getConfigOption_skill_list_on(),
                getConfigOption_weapon_list_on()
            )
    )}`)
}

function handle_set_config(args, msg) {
    let who=(getObj('player',msg.playerid)||{get:()=>'API'}).get('_displayname');
    switch(args[1]) {
        case 'house_rule_missle_close_range_mod':
        case 'house_rule_emlmax':
        case 'house_rule_emlmin':
                    state.Harn.config[args[1]]=parseInt(args[2]);
            break;
        case 'attack_template':
            if (args[2] == 'Fancy') {
                state.Harn.config.attack_template='harn-fancy';
                state.Harn.config.defend_template='harn-defend';
            } else {
                state.Harn.config.attack_template='harnroll';
                state.Harn.config.defend_template='harnroll';
            }
            break;
        default:
            sendChat('H&acirc;rn API', `/w "${who}" Unkown config option ${args[1]} `)
        }
}

function getConfigOption_attack_template(){
    return makeConfigOptionNum(
        state.Harn.config.house_rule_emlmax,
        `!set-config attack_template ?{Template to use for attack rolls?|Fancy|Plain}`,
        `${_h.bold('Attack template')} The template to use for attacks. Select plain if the API server is slow. Current Value ${_h.bold(state.Harn.config.attack_template=='harn-fancy'?"Fancy":"Plain")}`
    );
}

function getConfigOption_house_rule_emlmax(){
    return makeConfigOptionNum(
        state.Harn.config.house_rule_emlmax,
        `!set-config house_rule_emlmax ?{Maximum value for EML after all modifications (default: 95)?|${state.Harn.config.house_rule_emlmax}}`,
        `${_h.bold('Max EML')} The maximum value an EML can have after all modifications. Current value: ${_h.bold(state.Harn.config.house_rule_emlmax)}`
    );
}

function getConfigOption_house_rule_emlmin(){
    return makeConfigOptionNum(
        state.Harn.config.house_rule_emlmin,
        `!set-config house_rule_emlmin ?{Minimum value for EML after all modifications (default: 5)?|${state.Harn.config.house_rule_emlmin}}`,
        `${_h.bold('Min EML')} The minimum value an EML can have after all modifications. Current value: ${_h.bold(state.Harn.config.house_rule_emlmin)}`
    );
}

function getConfigOption_house_rule_missle_close_range_mod(){
    return makeConfigOptionNum(
        state.Harn.config.house_rule_missle_close_range_mod,
        `!set-config house_rule_missle_close_range_mod ?{Bonus for very close range for missiles?|${state.Harn.config.house_rule_missle_close_range_mod}}`,
        `${_h.bold('Close Range Mod')} bonus granted to EML for missile attacks at very close range. Current value: ${_h.bold(state.Harn.config.house_rule_missle_close_range_mod)}`
    );
}

function getConfigOption_trace() {
    return makeConfigOption(
        trace,
        `!toggleconfig trace`,
        `${_h.bold('trace')} If true enables API tracing for debugging.`
  );
}

function getConfigOption_house_rule_randomize_init_roll() {
    return makeConfigOption(
        state.Harn.config.house_rule_randomize_init_roll,
        `!toggleconfig house_rule_randomize_init_roll`,
        `${_h.bold('Add 3d6 to initiative')} If true, adds a random element to initiative turn order.`
  );
}

function getConfigOption_house_rule_additional_target_locations() {
    return makeConfigOption(
        state.Harn.config.house_rule_additional_target_locations,
        `!toggleconfig house_rule_additional_target_locations`,
        `${_h.bold('Use additional target locations')} If true, allows players to target e.g. the neck for faster combat resolution.`
  );
}

function getConfigOption_house_rule_occupations() {
    return makeConfigOption(
        state.Harn.config.house_rule_occupations,
        `!toggleconfig house_rule_occupations`,
        `${_h.bold('Use additional occupations')} If true, will add ${Object.keys(config.add_occupational_skills).length} occupations.`
  );
}

function getConfigOption_house_rule_items() {
    return makeConfigOption(
        state.Harn.config.house_rule_items,
        `!toggleconfig house_rule_items`,
        `${_h.bold('Use additional items')} If true, will add ${Object.keys(config.add_items).length} items and remove ${Object.keys(config.remove_items).length} items.`
  );
}

function getConfigOption_house_rule_skills() {
    return makeConfigOption(
        state.Harn.config.house_rule_skills,
        `!toggleconfig house_rule_skills`,
        `${_h.bold('Use additional skills')} If true, will add ${Object.keys(config.add_skills).length} skills.`
  );
}

function getConfigOption_skill_list_on() {
    return makeConfigOption(
        state.Harn.config.skill_list_on,
        `!toggleconfig skill_list_on`,
        `${_h.bold('Update skill list on change')} If true, will update the list of skills for a player anytime anything changes on the skills tab. Set to false if the API server is slow.`
  );
}

function getConfigOption_weapon_list_on() {
    return makeConfigOption(
        state.Harn.config.weapon_list_on,
        `!toggleconfig weapon_list_on`,
        `${_h.bold('Update weapon list on change')} If true, will update the list of weapon list for a player anytime anything changes on the inventory tab. Set to false if the API server is slow.`
  );
}

function getConfigOption_generate_item_list() {
    return makeConfigOption(
        state.Harn.config.generate_item_list,
        `!toggleconfig generate_item_list`,
        `${_h.bold('Generate Item List on startup')} Controls if you want the Item list used in e.g. dropdowns to be re-calculated on startup. Set to true if you are developing the module. Set to false if the API server is slow.`
  );
}

function getConfigOption_realtime() {
    return makeConfigOption(
        state.Harn.config.realtime,
        `!toggleconfig realtime`,
        `${_h.bold('Log real time')} Log the real-world time in the character log, e.g. for critical successes and failures.`
  );
}

function getConfigOption_gametime() {
    return makeConfigOption(
        state.Harn.config.gametime,
        `!toggleconfig gametime`,
        `${_h.bold('Log H&acirc;rn time')} Log the H&acirc;rn-world time in the character log, e.g. for critical successes and failures.`
  );
}


function makeConfigOption(option,command,text) {
    const onOff = (option ? 'On' : 'Off' );
    const color = (option ? '#5bb75b' : '#faa732' );

    return _h.configRow(
        _h.floatRight( _h.makeButton(command,onOff,color)),
        text,
        _h.clearBoth()
      );
};

function makeConfigOptionNum(config,command,text) {
    return _h.configRow(
        _h.floatRight( _h.makeButton(command,"Set")),
        text,
        _h.clearBoth()
      );
};


function checkInstall() {
	log(`-=> H&acirc;rn v${config.version} <=-  [${config.lastUpdate}]`);

	if( ! _.has(state,'Harn') || state.Harn.version !== config.schemaVersion) {
		log('  > Updating Schema to v'+config.schemaVersion+' <');
        switch(state.Harn && state.Harn.version) {

            case 0.1:
              /* break; // intentional dropthrough */ /* falls through */
    
            case 'UpdateSchemaVersion':
              state.Harn.version = config.schemaVersion;
              break;
    
            default:
                state.Harn = {
                version: config.schemaVersion,
                trace: false,
                config: {
                    attack_template: "harn-fancy",
                    defend_template: "harn-defend",
                    house_rule_emlmax: 95,
                    house_rule_emlmin: 5,
                    house_rule_missle_close_range_mod: 0,
                    house_rule_randomize_init_roll: false,
                    house_rule_additional_target_locations: false,
                    house_rule_occupations: false,
                    house_rule_items: false,
                    house_rule_skills: false,
                    generate_item_list: true, 
                    skill_list_on: true, 
                    weapon_list_on: true, 
                    realtime: true, 
                    gametime: true, 
                    },
                };
            }
	}
};

const config = {
    version: '0.1.0',
    lastUpdate: '8-Nov-2020',
    schemaVersion: 0.1,

    // house rule tables - add additional entries to tables. Any entry listed here which is also in the canon table will override the canon table.
    add_skills: {            //additional skills for characters
        "Needlework": { "type": "LORE", "sba": ["DEX", "EYE", "WIL"], "ssm": { "Ula": "0" }, "oml": "1", "notes": "" }
    },
    // These items will be added/updated to the available inventory to buy if house_rule_items is true
    add_items: {
        "Bow(Minicrossbow)": { "price": 1800, "weight": 2.5 },
        "Byrnie(long), mail": { "price": 760, "weight": 26.0 },
        "Byrnie(long), ring": { "price": 365, "weight": 19.6 },
        "Byrnie(long), scale": { "price": 500, "weight": 34.8 },
        "Cap, cloth": { "price": 8, "weight": 0.4 },
        "Cap, leather": { "price": 16, "weight": 0.8 },
        "Cloak(long), cloth": { "price": 120, "weight": 8.8 },
        "Cloak(long), hood, cloth": { "price": 140, "weight": 10.8 },
        "Cloak(long), hood, leather": { "price": 170, "weight": 14.0 },
        "Cloak(long), leather": { "price": 150, "weight": 12.0 },
        "Cloak, cloth": { "price": 100, "weight": 6.6 },
        "Cloak, hood, cloth": { "price": 115, "weight": 8.6 },
        "Cloak, hood, leather": { "price": 140, "weight": 11 },
        "Cowl(long), cloth": { "price": 15, "weight": 1.2 },
        "Cowl(long), leather": { "price": 18, "weight": 2.4 },
        "Cowl(long), mail": { "price": 180, "weight": 6.0 },
        "Cowl(long), quilt": { "price": 42, "weight": 3.6 },
        "Cowl, cloth": { "price": 10, "weight": 0.8 },
        "Cowl, leather": { "price": 12, "weight": 1.6 },
        "Cowl, mail": { "price": 120, "weight": 4.0 },
        "Dress(longsleeve), cloth": { "price": 160, "weight": 8.2 },
        "Dress(shortsleeve), cloth": { "price": 150, "weight": 7.8 },
        "Gauntlets, leather": { "price": 16, "weight": 0.8 },
        "Gloves, cloth": { "price": 15, "weight": 0.4 },
        "Gorget, plate": { "price": 50, "weight": 2.0 },
        "Hat, cloth": { "price": 16, "weight": 0.5 },
        "Hat, leather": { "price": 28, "weight": 1.2 },
        "Hauberk(shortsleeve), mail": { "price": 855, "weight": 26.0 },
        "Hauberk(shortsleeve), ring": { "price": 399, "weight": 24 },
        "Hauberk(shortsleeve), scale": { "price": 570, "weight": 45.5 },
        "Hauberk, mail": { "price": 900, "weight": 27.0 },
        "Hauberk, ring": { "price": 420, "weight": 26 },
        "Hauberk, scale": { "price": 600, "weight": 50 },
        "Hood, cloth": { "price": 16, "weight": 0.8 },
        "Hood, leather": { "price": 12, "weight": 1.6 },
        "Hood, quilt": { "price": 32, "weight": 2.4 },
        "Leggings, cloth": { "price": 88, "weight": 4.4 },
        "Leggings, leather": { "price": 176, "weight": 8.8 },
        "Lightsabre": { "price": 9600000, "weight": 0.2 },
        "Loincloth, cloth": { "price": 20, "weight": 1.0 },
        "Loincloth, fur": { "price": 40, "weight": 2.4 },
        "Loincloth, leather": { "price": 40, "weight": 2.0 },
        "Pants, leather": { "price": 165, "weight": 7.0 },
        "Pants, quilt": { "price": 174, "weight": 8.2 },
        "Robe, cloth": { "price": 156, "weight": 7.8 },
        "Robe, hood, cloth": { "price": 156, "weight": 7.8 },
        "Shirt(long), cloth": { "price": 100, "weight": 6.8 },
        "Shirt(long), leather": { "price": 120, "weight": 11.8 },
        "Shirt(long), quilt": { "price": 200, "weight": 17.5 },
        "Shirt, cloth": { "price": 100, "weight": 5.2 },
        "Shirt, leather": { "price": 120, "weight": 9.8 },
        "Shirt, quilt": { "price": 200, "weight": 15.0 },
        "Shorts, cloth": { "price": 40, "weight": 2.0 },
        "Shorts, fur": { "price": 60, "weight": 4.8 },
        "Shorts, leather": { "price": 60, "weight": 4.0 },
        "Skirt(long), cloth": { "price": 20, "weight": 4.0 },
        "Skirt(long), leather": { "price": 30, "weight": 5.6 },
        "Skirt(mid), cloth": { "price": 20, "weight": 3.0 },
        "Skirt(mid), leather": { "price": 30, "weight": 4.2 },
        "Skirt(mini), cloth": { "price": 20, "weight": 1.0 },
        "Skirt(mini), leather": { "price": 30, "weight": 1.4 },
        "Skirt(short), cloth": { "price": 20, "weight": 2.0 },
        "Skirt(short), leather": { "price": 30, "weight": 2.8 },
        "Skull, bone": { "price": 0, "weight": 0 },
        "Surcoat, cloth": { "price": 104, "weight": 5.2 },
        "Surcoat, leather": { "price": 208, "weight": 10.4 },
        "Tunic(long), cloth": { "price": 100, "weight": 4.8 },
        "Tunic(long), leather": { "price": 125, "weight": 9.2 },
        "Tunic(long), quilt": { "price": 200, "weight": 15.6 },
        "Tunic, cloth": { "price": 88, "weight": 4.4 },
        "Vest, cloth": { "price": 56, "weight": 2.8 },
        "Vest, fur": { "price": 112, "weight": 7.0 },
        "Vest, leather": { "price": 112, "weight": 5.6 },
        "Vest, quilt": { "price": 112, "weight": 7.0 },
    },
    // These items will be removed from the available inventory to buy.
    remove_items: [
        "Body, fur", "Body, mail", "Body, nat1", "Body, plate ", "Breastplate-Backplate, kurbul",
        "Cloak, beaver", "Cloak, buckram", "Cloak, canvas", "Cloak, ermine", "Cloak, linen", "Cloak, russet",
        "Cloak, sealskin", "Cloak, serge", "Cloak, silk", "Cloak, waxed canvas", "Cloak, worsted",
        "Cowl, long, mail", "Cowl, long, ring", "Cowl, short, mail", "Cowl, short, ring", "Cowl/hood, beaver",
        "Cowl/hood, buckram", "Cowl/hood, canvas", "Cowl/hood, ermine", "Cowl/hood, leather",
        "Cowl/hood, linen", "Cowl/hood, russet", "Cowl/hood, sealskin", "Cowl/hood, serge", "Cowl/hood, silk",
        "Cowl/hood, waxed canvas", "Cowl/hood, worsted", "Dress, lightlinen", "Dress, lightsilk",
        "Gloves, buckram", "Gloves, leather", "Gloves, russet", "Gloves, silk", "Habergeon, mail",
        "Habergeon, scale", "Hat/Cap, beaver", "Hat/Cap, buckram", "Hat/Cap, ermine", "Hat/Cap, leather",
        "Hat/Cap, russet", "Hat/Cap, sealskin", "Hat/Cap, serge", "Hat/Cap, silk", "Hat/Cap, worsted",
        "Hauberk, long, mail", "Hauberk, long, mail+2", "Hauberk, long, ring", "Hauberk, long, scale",
        "Hauberk, mail", "Hauberk, short, mail", "Hauberk, short, ring", "Hauberk, short, scale",
        "Leggings, beaver", "Leggings, buckram", "Leggings, canvas", "Leggings, leather", "Leggings, linen",
        "Leggings, russet", "Leggings, sealskin", "Leggings, serge", "Leggings, silk", "Leggings, waxed canvas",
        "Leggings, worsted", "Longshirt, ring", "Pants, quilt", "Robe, beaver", "Robe, buckram", "Robe, ermine",
        "Robe, lightlinen", "Robe, linen", "Robe, russet", "Robe, sealskin", "Robe, serge", "Robe, silk",
        "Robe, worsted", "Shirt(Long), leather", "Shirt, beaver", "Shirt, buckram", "Shirt, ermine",
        "Shirt, leather", "Shirt, linen", "Shirt, ring", "Shirt, russet", "Shirt, sealskin", "Shirt, serge",
        "Shirt, silk", "Shirt, worsted", "Skull", "Surcoat, buckram", "Surcoat, leather", "Surcoat, linen",
        "Surcoat, silk", "Tunic, beaver", "Tunic, buckram", "Tunic, canvas", "Tunic, ermine", "Tunic, lightlinen",
        "Tunic, linen", "Tunic, russet", "Tunic, sealskin", "Tunic, serge", "Tunic, silk", "Tunic, waxed canvas",
        "Tunic, worsted", "Vest, beaver", "Vest, buckram", "Vest, ermine", "Vest, leather", "Vest, linen",
        "Vest, ring", "Vest, russet", "Vest, sealskin", "Vest, serge", "Vest, silk", "Vest, worsted",
    ],
    //Add armor coverage shortcuts.
    add_armor_coverage: {
        "Byrnie(long)": { "zone": "body", "coverage": ["Ua", "Sh", "Tx", "Ab", "Hp", "Gr", "Th"] },
        "Cloak(long), hood": { "zone": "body", "coverage": ["Sk", "Nk", "Sh", "Tx", "Ab", "Hp", "Gr", "Th", "Kn", "Ua"] },
        "Cloak, hood": { "zone": "cloak", "coverage": ["SK", "Nk", "Sh", "Tx", "Hp", "Ua", "Gr"] },
        "Cowl(long)": { "zone": "head", "coverage": ["Sk", "Nk", "Sh"] },
        "Cuirass": { "zone": "thor", "coverage": ["Tx", "Ab"] },
        "Dress(longsleeve)": { "zone": "robe", "coverage": ["Fo", "El", "Ua", "Sh", "Tx", "Ab", "Hp", "Gr", "Th", "Kn", "Ca"] },
        "Dress(shortsleeve)": { "zone": "robe", "coverage": ["Ua", "Sh", "Tx", "Ab", "Hp", "Gr", "Th", "Kn", "Ca"] },
        "Hat": { "zone": "head", "coverage": ["Sk"] },
        "Hauberk(shortsleeve)": { "zone": "body", "coverage": ["Ua", "Sh", "Tx", "Ab", "Hp", "Gr", "Th"] },
        "Loincloth": { "zone": "thor", "coverage": ["Hp", "Gr"] },
        "Robe, hood": { "zone": "robe", "coverage": ["Sk", "Nk", "Ua", "Sh", "Tx", "Ab", "Hp", "Gr", "Fo", "El", "Th", "Kn", "Ca"] },
        "Shirt(long)": { "zone": "body", "coverage": ["Fo", "El", "Ua", "Sh", "Tx", "Ab", "Hp", "Gr", "Th"] },
        "Shorts": { "zone": "thor", "coverage": ["Hp", "Gr", "Th"] },
        "Skirt(long)": { "zone": "thor", "coverage": ["Hp", "Gr", "Th", "Kn", "Ca"] },
        "Skirt(mid)": { "zone": "thor", "coverage": ["Hp", "Gr", "Th", "Kn"] },
        "Skirt(mini)": { "zone": "thor", "coverage": ["Hp", "Gr"] },
        "Skirt(short)": { "zone": "thor", "coverage": ["Hp", "Gr", "Th"] },
        "Tunic(long)": { "zone": "body", "coverage": ["Ua", "Sh", "Tx", "Ab", "Hp", "Gr", "Th"] }
    },
    // These armor coverages will be removed. NB any armor which references these will stop working.
    remove_armor_coverage: [
        "Breastplate-Backplate", "Byrnie, long", "Cloak(Long), hood", "Cowl, long", "Cowl, short",
        "Cowl/hood", "Cuirass", "Dress", "Hat/Cap", "Haubergeon", "Hauberk, long", "Hauberk, short",
        "Shirt(Long)", "ShortSleeveShirt", "ShortSleeveShirt(long)", "Skirt, long", "Skirt, short",
        "Tunic, long"
    ],
    add_armor_prot: {
        "bone": ["bone", "2", "2", "2", "2"],
        "bone+1": ["bone+1", "3", "3", "3", "3"],
        "bone+2": ["bone+2", "4", "4", "4", "4"],
        "belt lizard king": ["magic belt", "2", "4", "3", "3"]
    },
    add_occupational_skills: {
        "Seaman": [
            "Seamanship/4",
            "CLIMBING/5",
            "Club/5",
            "Dagger/4",
            "Fishing/3",
            "Weatherlore/3",
            "Piloting/2",
            "Shipwright/2",
            "Packing/3"
        ],
        "Teamster": [
            "RIDING/4",
            "Animalcraft/3",
            "Whip/3",
            "Woodcraft/2",
            "Driving/4",
            "Packing/3"
        ],
        "Thief": [
            "Legerdemain/4",
            "AWARENESS/5",
            "STEALTH/4",
            "INTRIGUE/4",
            "Lockcraft/3",
            "Club/5",
            "Dagger/4",
            "Acrobatics/2",
            "Searching/3"
        ],
        "Feudal Yeoman, Foot": [
            "INITIATIVE/5",
            "Foraging/4",
            "Survival/4",
            "Heraldry/2",
            "Physician/2",
            "Weaponcraft/2",
            "Spear/5",
            "Sword(Shortsword)/4",
            "Dagger/4",
            "Shield(Round)/4",
            "Tactics/1"
        ],
        "Feudal Guardsman, Light": [
            "INITIATIVE/5",
            "Foraging/4",
            "Survival/4",
            "Heraldry/2",
            "Physician/2",
            "Weaponcraft/2",
            "Spear/6",
            "Sword(Shortsword)/5",
            "Dagger/5",
            "Shield(Round)/5",
            "Tactics/2"
        ],
        "Feudal Guardsman, Heavy": [
            "INITIATIVE/5",
            "Foraging/4",
            "Survival/4",
            "Heraldry/2",
            "Physician/2",
            "Weaponcraft/2",
            "Spear/6",
            "Sword(Falchion)/5",
            "Dagger/5",
            "Shield(Round)/5",
            "Tactics/2"
        ],
        "Feudal Yeoman, Shortbow": [
            "INITIATIVE/5",
            "Foraging/4",
            "Survival/4",
            "Heraldry/2",
            "Physician/2",
            "Weaponcraft/2",
            "Bow(Shortbow)/5",
            "Sword(Falchion)/5",
            "Dagger/5",
            "Shield(Buckler)/5",
            "Tactics/1"
        ],
        "Feudal Yeoman, Longbow": [
            "INITIATIVE/5",
            "Foraging/4",
            "Survival/4",
            "Heraldry/2",
            "Physician/2",
            "Weaponcraft/2",
            "Bow(Longbow)/5",
            "Sword(Falchion)/5",
            "Dagger/5",
            "Shield(Buckler)/5",
            "Tactics/1"
        ],
        "Feudal Knight, Medium": [
            "INITIATIVE/6",
            "Foraging/4",
            "Survival/4",
            "Heraldry/2",
            "Physician/2",
            "Weaponcraft/2",
            "RIDING/6",
            "Polearm(Lance)/6",
            "Sword(Broadsword)/5",
            "Axe(Handaxe)/5",
            "Dagger/5",
            "Shield(Knight)/6",
            "Dancing/3",
            "Tactics/3"
        ],
        "Feudal Knight, Heavy": [
            "INITIATIVE/6",
            "Foraging/4",
            "Survival/4",
            "Heraldry/2",
            "Physician/2",
            "Weaponcraft/2",
            "RIDING/6",
            "Polearm(Lance)/6",
            "Sword(Bastard Sword)/5",
            "Axe(Handaxe)/5",
            "Dagger/5",
            "Shield(Kite)/6",
            "Dancing/3",
            "Tactics/3"
        ],
        "Order Infantry, Light": [
            "INITIATIVE/5",
            "Foraging/4",
            "Survival/4",
            "Heraldry/2",
            "Physician/2",
            "Weaponcraft/2",
            "Spear/6",
            "Sword(Shortsword)/5",
            "Dagger/5",
            "Shield(Round)/5",
            "Tactics/2"
        ],
        "Order Infantry, Heavy": [
            "INITIATIVE/5",
            "Foraging/4",
            "Survival/4",
            "Heraldry/2",
            "Physician/2",
            "Weaponcraft/2",
            "Spear/6",
            "Sword(Falchion)/5",
            "Dagger/5",
            "Shield(Round)/5",
            "Tactics/2"
        ],
        "Order Archer": [
            "INITIATIVE/5",
            "Foraging/4",
            "Survival/4",
            "Heraldry/2",
            "Physician/2",
            "Weaponcraft/2",
            "Bow(Shortbow)/5",
            "Sword(Shortsword)/5",
            "Dagger/5",
            "Shield(Buckler)/5",
            "Tactics/2"
        ],
        "Order Knight, Medium": [
            "INITIATIVE/6",
            "Foraging/4",
            "Survival/4",
            "Heraldry/2",
            "Physician/2",
            "Weaponcraft/2",
            "RIDING/6",
            "Polearm(Lance)/6",
            "Sword(Broadsword)/5",
            "Club(Mace)/5",
            "Dagger/5",
            "Shield(Knight)/6",
            "Dancing/3",
            "Tactics/3"
        ],
        "Order Knight, Heavy": [
            "INITIATIVE/6",
            "Foraging/4",
            "Survival/4",
            "Heraldry/2",
            "Physician/2",
            "Weaponcraft/2",
            "RIDING/6",
            "Polearm(Lance)/6",
            "Sword(Bastard Sword)/5",
            "Club(Mace)/5",
            "Dagger/5",
            "Shield(Kite)/6",
            "Dancing/3",
            "Tactics/3"
        ],
        "Imperial Legionnaire, Light": [
            "INITIATIVE/5",
            "Foraging/4",
            "Survival/4",
            "Heraldry/2",
            "Physician/2",
            "Weaponcraft/2",
            "Spear/5",
            "Sword(Shortsword)/4",
            "Dagger/4",
            "Shield(Tower)/5",
            "Tactics/1"
        ],
        "Imperial Legionnaire, Medium": [
            "INITIATIVE/5",
            "Foraging/4",
            "Survival/4",
            "Heraldry/2",
            "Physician/2",
            "Weaponcraft/2",
            "Spear/6",
            "Sword(Shortsword)/5",
            "Dagger/4",
            "Shield(Tower)/5",
            "Tactics/2"
        ],
        "Imperial Legionnaire, Shortbow": [
            "INITIATIVE/5",
            "Foraging/4",
            "Survival/4",
            "Heraldry/2",
            "Physician/2",
            "Weaponcraft/2",
            "Bow(Shortbow)/6",
            "Sword(Shortsword)/5",
            "Dagger/5",
            "Shield(Buckler)/5",
            "Tactics/2"
        ],
        "Patrician": [
            "INITIATIVE/6",
            "Foraging/4",
            "Survival/4",
            "Heraldry/2",
            "Physician/2",
            "Weaponcraft/2",
            "RIDING/6",
            "Polearm(Lance)/6",
            "Sword(Broadsword)/5",
            "Axe(Handaxe)/5",
            "Dagger/5",
            "Shield(Kite)/6",
            "Dancing/3",
            "Tactics/3"
        ],
        "Viking Clansman, Light": [
            "INITIATIVE/5",
            "Foraging/4",
            "Survival/4",
            "Heraldry/2",
            "Physician/2",
            "Weaponcraft/2",
            "Spear/6",
            "Shield(Round)/6",
            "Bow((Shortbow))/5",
            "Dagger(Keltan)/5",
            "Seamanship/3",
            "Tactics/1"
        ],
        "Viking Huscarl, Medium Foot": [
            "INITIATIVE/6",
            "Foraging/4",
            "Survival/4",
            "Heraldry/2",
            "Physician/2",
            "Weaponcraft/2",
            "Axe(Battleaxe)/6",
            "Sword(Broadsword)/5",
            "Dagger(Keltan)/5",
            "Shield(Round)/5",
            "Seamanship/3",
            "Piloting/2",
            "Tactics/2"
        ],
        "Viking Huscarl, Light Horse": [
            "INITIATIVE/6",
            "Foraging/4",
            "Survival/4",
            "Heraldry/2",
            "Physician/2",
            "Weaponcraft/2",
            "RIDING/6",
            "Polearm(Lance)/6",
            "Sword(Broadsword)/5",
            "Shield(Round)/5",
            "Seamanship/3",
            "Piloting/2",
            "Tactics/2"
        ],
        "Khuzdul Clansman": [
            "INITIATIVE/5",
            "Foraging/4",
            "Survival/4",
            "Heraldry/2",
            "Physician/2",
            "Weaponcraft/2",
            "Spear/6",
            "Axe(Handaxe)/5",
            "Shield(Round)/5",
            "Tactics/1"
        ],
        "Khuzdul Low Guard": [
            "INITIATIVE/5",
            "Foraging/4",
            "Survival/4",
            "Heraldry/2",
            "Physician/2",
            "Weaponcraft/2",
            "Spear/6",
            "Axe(Battleaxe)/5",
            "Dagger/5",
            "Shield(Round)/5",
            "Tactics/2"
        ],
        "Khuzdul High Guard": [
            "INITIATIVE/6",
            "Foraging/4",
            "Survival/4",
            "Heraldry/2",
            "Physician/2",
            "Weaponcraft/2",
            "Polearm(Poleaxe)/6",
            "Club(Mace)/5",
            "Dagger/5",
            "Shield(Round)/5",
            "Tactics/3"
        ],
        "Sindarin Ranger, Unarmored": [
            "INITIATIVE/5",
            "Foraging/4",
            "Survival/4",
            "Heraldry/2",
            "Physician/2",
            "Weaponcraft/2",
            "Bow(Hartbow)/6",
            "Sword(Longknife)/5",
            "Dagger/5",
            "Shield(Buckler)/5",
            "Tactics/2"
        ],
        "Sindarin Ranger, Light": [
            "INITIATIVE/5",
            "Foraging/4",
            "Survival/4",
            "Heraldry/2",
            "Physician/2",
            "Weaponcraft/2",
            "Bow(Hartbow)/6",
            "Sword(Longknife)/5",
            "Dagger/5",
            "Shield(Buckler)/5",
            "Tactics/2"
        ],
        "Sindarin Guardian": [
            "INITIATIVE/5",
            "Foraging/4",
            "Survival/4",
            "Heraldry/2",
            "Physician/2",
            "Weaponcraft/2",
            "Spear/7",
            "Sword(Longknife)/6",
            "Dagger/5",
            "Shield(Round)/6",
            "Tactics/3"
        ],
        "Sindarin Horsebow": [
            "INITIATIVE/5",
            "Foraging/4",
            "Survival/4",
            "Heraldry/2",
            "Physician/2",
            "Weaponcraft/2",
            "RIDING/6",
            "Bow(Hartbow)/6",
            "Polearm(Lance)/5",
            "Sword(Longknife)/5",
            "Shield(Knight)/6",
            "Dancing/3",
            "Musician/2",
            "Tactics/2"
        ],
        "Sindarin Knight": [
            "INITIATIVE/6",
            "Foraging/4",
            "Survival/4",
            "Heraldry/2",
            "Physician/2",
            "Weaponcraft/2",
            "RIDING/7",
            "Polearm(Lance)/7",
            "Sword(Longknife)/6",
            "Shield(Knight)/6",
            "Dancing/3",
            "Musician/2",
            "Tactics/3"
        ]
    },
    add_occupation_time: {
        "Archeologist": "14"
    }
}

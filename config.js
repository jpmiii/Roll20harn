//
//
// CONFIGURATION
//
// eslint-disable-line no-unused-vars
var trace = state.hasOwnProperty('Harn')?state.Harn.trace:true; // API debug logging

function handle_toggle_config(args, msg) {
    let who=(getObj('player',msg.playerid)||{get:()=>'API'}).get('_displayname');
    switch(args[1]) {
        case 'house_rule_additional_target_locations':
        case 'house_rule_randomize_init_roll':
        case 'house_rule_occupations':
        case 'house_rule_items':
        case 'house_rule_skills':
            state.Harn.config[args[1]]=!state.Harn.config[args[1]];
            initializeTables(0);
            sendChat('H&acirc;rn API', `/w "${who}" ${args[1]} set to ${state.Harn.config[args[1]]}`);
            break;
        case 'slow_api':
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
            _h.title("H&acirc;rn Config v", Roll20HarnAPI.version),
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
                getConfigOption_slow_api(),
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
        `${_h.bold('Use additional occupations')} If true, will use a list of house rule occupations instead of cannon.`
  );
}

function getConfigOption_house_rule_items() {
    return makeConfigOption(
        state.Harn.config.house_rule_items,
        `!toggleconfig house_rule_items`,
        `${_h.bold('Use additional items')} If true, use a list of house rule items instead of cannon.`
  );
}

function getConfigOption_house_rule_skills() {
    return makeConfigOption(
        state.Harn.config.house_rule_skills,
        `!toggleconfig house_rule_skills`,
        `${_h.bold('Use additional skills')} If true, use the list of houserule skills instead of cannon skills.`
  );
}

function getConfigOption_slow_api() {
    return makeConfigOption(
        state.Harn.config.slow_api,
        `!toggleconfig slow_api`,
        `${_h.bold('Optimize for a slow API')} Set to true if the api engine is slow and you want to try some optimizations/heavier caching.`
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
	log(`-=> Harn v${Roll20HarnAPI.version} <=-  [${Roll20HarnAPI.lastUpdate}]`);

	if( ! _.has(state,'Harn') || state.Harn.version !== Roll20HarnAPI.schemaVersion) {
		log('  > Updating Schema to v'+Roll20HarnAPI.schemaVersion+' <');
        switch(state.Harn && state.Harn.version) {

            case 0.1:
              /* break; // intentional dropthrough */ /* falls through */
    
            case 'UpdateSchemaVersion':
              state.Harn.version = Roll20HarnAPI.schemaVersion;
              break;
    
            default:
                state.Harn = {
                version: Roll20HarnAPI.schemaVersion,
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
                    slow_api: false,
                    realtime: true, 
                    gametime: true, 
                    },
                };
            }
	}
};

const Roll20HarnAPI = {
    version: '0.1.0',
    lastUpdate: '8-Nov-2020',
    schemaVersion: 0.1,
}

// commandname -> object with
//                  "action" a function taking two args, args and msg, which implements the command.
//                  "re_syntax" regular expression the command has to match
//                  "hr_syntax" a more human understandable version of the command syntax

// Regular expression tester: https://regex101.com/
// Regular expression cheatsheet:
// Character id: [-_a-zA-Z0-9]{20}
// Number: [-+]?[0-9]+
// one of the following: (mid|low|high)

var dispatch_table = {
    "!calcsb": {
        "action": (args, msg) => { handle_calcsb(args, msg); },
        "re_syntax": /^!calcsb [-_a-zA-Z0-9]{20}$/,
        "hr_syntax": "!calcsb character_id<br/>Calculate the skill bonus for the selected character."
    },
    "!skilllist": {
        "action": (args, msg) => { handle_skilllist(args, msg); },
        "re_syntax": /^!skilllist [-_a-zA-Z0-9]{20}$/,
        "hr_syntax": "!skilllist<br/>Prepares the skill lists for use by other macros."
    },
    "!cheat": {
        "action": (args, msg) => { handle_cheat(args, msg); },
        "re_syntax": /^!cheat [-+]?[0-9]+$/,
        "hr_syntax": "!cheat number<br/>The next d100 roll will be the provided number."
    },
    "!mapsend": {
        "action": (args, msg) => { handle_mapsend(args, msg); },
        "re_syntax": /^!mapsend [^,]+,[^,]+$/,
        "hr_syntax": "!mapsend player_name,page_name <br/>Not sure what this does."
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
        "re_syntax": /^(!sheetattack|!attack) [-_a-zA-Z0-9]{20} (mid|low|high) (H|B|E|P|F) (melee|missile) [-+]?[0-9]+ [-_a-zA-Z0-9]{20} .+$/,
        "hr_syntax": "![sheet]attack attacker_id (high|low|mid) (H|B|E|P) (missile|melee) modifier defender_id weapon"
    },
    "!attack": {
        "action": (args, msg) => { handle_attack(args, msg); },
        "re_syntax": /^(!sheetattack|!attack) [-_a-zA-Z0-9]{20} (mid|low|high) (H|B|E|P|F) (melee|missile) [-+]?[0-9]+ [-_a-zA-Z0-9]{20} .+$/,
        "hr_syntax": "![sheet]attack attacker_id (high|low|mid) (H|B|E|P) (missile|melee) modifier defender_id weapon"
    },
    "!defend": {
        "action": (args, msg) => { handle_defend(args, msg); },
        "re_syntax": /^!defend (ignore|dodge|block|counterstrike) [-+]?[0-9]+ WeaponName:.*$/,
        "hr_syntax": "!defend (block mod WeaponName: weapon_name|dodge mod|ignore|counterstrike mod WeaponName: weapon_name)<br/>defends against an attack"
    },
    "!invin": {
        "action": (args, msg) => { handle_invin(args, msg); },
        "re_syntax": /^!invin [-_a-zA-Z0-9]{20}$/,
        "hr_syntax": "!invin character_id<br/>Outputs character in HârnMaster Character Utility text format in character note."
    },
    "!move": {
        "action": (args, msg) => { handle_move(args, msg); },
        "re_syntax": /^!move.*$/,
        "hr_syntax": "Does something"
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
        "hr_syntax": "Does something"
    },
    "!out": {
        "action": (args, msg) => { handle_out(args, msg); },
        "re_syntax": /^!out.*$/,
        "hr_syntax": "Does something"
    },
    "!attack_melee_table": {
        "action": (args, msg) => { handle_attack_melee_table(args, msg); },
        "re_syntax": /^!attack_melee_table (block|counterstrike|dodge|ignore) [1-4] [1-4]$/,
        "hr_syntax": "!attack_meleee_table (block|counterstrike|dodge|ignore) [1-4] [1-4]<br/>Outputs the attack melee table "
    },
    "!loc": {
        "action": (args, msg) => { handle_loc(args, msg); },
        "re_syntax": /^!loc [0-9]+ (1|2|3)$/,
        "hr_syntax": "!loc result (1|2|3)<br/>Gets the hit location"
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
    }
}

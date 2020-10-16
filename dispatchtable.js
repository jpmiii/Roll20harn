// commandname -> object with
//                  "action" a function taking two args, args and msg, which implements the command.
//                  "re_syntax" regular expression the command has to match
//                  "hr_syntax" a more human understandable version of the command syntax
var dispatch_table = {
    "!calcsb": {
        "action": (args, msg) => { handle_calcsb(args, msg); }
    },
    "!skilllist": {
        "action": (args, msg) => { handle_skilllist(args, msg); }
    },
    "!cheat": {
        "action": (args, msg) => { handle_cheat(args, msg); }
    },
    "!mapsend": {
        "action": (args, msg) => { handle_mapsend(args, msg); }
    },
    "!itemlist": {
        "action": (args, msg) => { handle_itemlist(args, msg); }
    },
    "!occupation": {
        "action": (args, msg) => { handle_occupation(args, msg); }
    },
    "!table": {
        "action": (args, msg) => { handle_table(args, msg); }
    },
    "!rollatts": {
        "action": (args, msg) => { handle_rollatts(args, msg); }
    },
    "!newturn": {
        "action": (args, msg) => { handle_newturn(args, msg); }
    },
    "!tokendis": {
        "action": (args, msg) => { handle_tokendis(args, msg); }
    },
    "!sheetattack": {
        "action": (args, msg) => { handle_sheetattack(args, msg); }
    },
    "!attack": {
        "action": (args, msg) => { handle_attack(args, msg); },
        "re_syntax": /^(!sheetattack|!attack) [-a-zA-Z0-9]+ (mid|low|high) (H|B|E|P|F) (melee|missile) [-+]?[0-9]+ [-a-zA-Z0-9]+ .+$/,
        "hr_syntax": "![sheet]attack attacker_id (high|low|mid) (H|B|E|P) (missile|melee) modifier defender_id weapon"
    },
    "!defend": {
        "action": (args, msg) => { handle_defend(args, msg); }
    },
    "!invin": {
        "action": (args, msg) => { handle_invin(args, msg); }
    },
    "!move": {
        "action": (args, msg) => { handle_move(args, msg); }
    },
    "!xin": {
        "action": (args, msg) => { handle_xin(args, msg); }
    },
    "!ca": {
        "action": (args, msg) => { handle_ca(args, msg); }
    },
    "!addItem": {
        "action": (args, msg) => { handle_addItem(args, msg); }
    },
    "!clearmove ": {
        "action": (args, msg) => { handle_clearmove(args, msg); }
    },
    "!tokemove ": {
        "action": (args, msg) => { handle_tokemove(args, msg); }
    },
    "!out": {
        "action": (args, msg) => { handle_out(args, msg); }
    },
    "!attack_melee_table": {
        "action": (args, msg) => { handle_attack_melee_table(args, msg); }
    },
    "!loc": {
        "action": (args, msg) => { handle_loc(args, msg); }
    },
    "!time": {
        "action": (args, msg) => { handle_time(args, msg); }
    },
    "!settime": {
        "action": (args, msg) => { handle_settime(args, msg); }
    },
    "!addtime": {
        "action": (args, msg) => { handle_addtime(args, msg); }
    },
    "!rand": {
        "action": (args, msg) => { handle_rand(args, msg); }
    },
    "!improveskill": {
        "action": (args, msg) => { handle_improveskill(args, msg); }
    },
    "!pickskill": {
	    "action": (args, msg) => { handle_pickskill(args, msg); }
    },
    "!gmrand": {
        "action": (args, msg) => { handle_gmrand(args, msg); }

    }
}

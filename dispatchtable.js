var dispatch_table = {
    "!calcsb": (args, msg) => {
        handle_calcsb(args, msg);
    },
    "!skilllist": (args, msg) => {
        handle_skilllist(args, msg);
    },
    "!cheat": (args, msg) => {
        handle_cheat(args, msg);
    },
    "!mapsend": (args, msg) => {
        handle_mapsend(args, msg);
    },
    "!itemlist": (args, msg) => {
        handle_itemlist(args, msg);
    },
    "!occupation": (args, msg) => {
        handle_occupation(args, msg);
    },
    "!table": (args, msg) => {
        handle_table(args, msg);
    },
    "!rollatts": (args, msg) => {
        handle_rollatts(args, msg);
    },
    "!newturn": (args, msg) => {
        handle_newturn(args, msg);
    },
    "!tokendis": (args, msg) => {
        handle_tokendis(args, msg);
    },
    "!sheetattack": (args, msg) => {
        handle_sheetattack(args, msg);
    },
    "!attack": (args, msg) => {
        handle_attack(args, msg);
    },
    "!defend": (args, msg) => {
        handle_defend(args, msg);
    },
    "!invin": (args, msg) => {
        handle_invin(args, msg);
    },
    "!move": (args, msg) => {
        handle_move(args, msg);
    },
    "!xin": (args, msg) => {
        handle_xin(args, msg);
    },
    "!ca": (args, msg) => {
        handle_ca(args, msg);
    },
    "!addItem": (args, msg) => {
        handle_addItem(args, msg);
    },
    "!clearmove ": (args, msg) => {
        handle_clearmove(args, msg);
    },
    "!tokemove ": (args, msg) => {
        handle_tokemove(args, msg);
    },
    "!out": (args, msg) => {
        handle_out(args, msg);
    },
    "!attack_melee_table": (args, msg) => {
        handle_attack_melee_table(args, msg);
    },
    "!loc": (args, msg) => {
        handle_loc(args, msg);
    },
    "!time": (args, msg) => {
        handle_time(args, msg);
    },
    "!settime": (args, msg) => {
        handle_settime(args, msg);
    },
    "!addtime": (args, msg) => {
        handle_addtime(args, msg);
    },
    "!rand": (args, msg) => {
        handle_rand(args, msg);
    },
    "!gmrand": (args, msg) => {
        handle_gmrand(msg);
    }
}
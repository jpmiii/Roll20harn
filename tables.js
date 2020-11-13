
//
//
// TABLES
//
//

/** Configure the main tables (including dispatch table) based
 * on the current house rule settings.
 */
function setupHouseruleTables() {
	if (state.Harn.config.house_rule_additional_target_locations) {
		default_abilities = houserule_tables.default_abilities;
		dispatch_table['!sheetattack'].re_syntax = houserule_tables.sheet_attack.re_syntax;
		dispatch_table['!sheetattack'].hr_syntax = houserule_tables.sheet_attack.hr_syntax;
		dispatch_table['!attack'].re_syntax = houserule_tables.sheet_attack.re_syntax;
		dispatch_table['!attack'].hr_syntax = houserule_tables.sheet_attack.hr_syntax;
	} else {
		default_abilities = cannon_tables.default_abilities;
		dispatch_table['!sheetattack'].re_syntax = cannon_tables.sheet_attack.re_syntax;
		dispatch_table['!sheetattack'].hr_syntax = cannon_tables.sheet_attack.hr_syntax;
		dispatch_table['!attack'].re_syntax = cannon_tables.sheet_attack.re_syntax;
		dispatch_table['!attack'].hr_syntax = cannon_tables.sheet_attack.hr_syntax;
	}
	if (state.Harn.config.house_rule_skills) {
		skilllist = houserule_tables.skilllist ;
	} else {
		skillist = cannon_tables.skilllist;
	}
	if (state.Harn.config.house_rule_items) {
		prices = houserule_tables.prices;
	} else {
		prices = cannon_tables.prices;
	}
	if (state.Harn.config.house_rule_occupations) {
		occupational_skills = houserule_tables.occupational_skills;
		occupation_time = houserule_tables.occupation_time;
	} else {
		occupational_skills = cannon_tables.occupational_skills;
		occupation_time = cannon_tables.occupation_time;
	}
}

var default_macros = {"helper-Physician-roll":"?{Treatment Bonus|Minor cut - Clean & Dress,30|Serious cut - Surgery,20|Grevious cut - Surgery,10|Minor stab - Clean & Dress,25|Serious stab - Clean & Dress,15|Grevious stab - Surgery,5|Minor bruise - Compress,30|Serious blunt fracture - Splint,20|Grevious blunt crush -Surgery/Splint,10|Bleeding wound - Tourniquet,50|No Bonus,0}",
			"Random-Char":"!rand"};
//
// houserule/cannon variables
//
var default_abilities = {};
var skilllist = {};
var prices = {};
var occupational_skills = {};
var occupational_time= {};


//
// tables where houserules don't matter
// either no house rule exists, or the houserule addition
// won't be visible to players or alter play.
//
var autoskills = {"CLIMBING":"ML","CONDITION":"ML","DODGE":"ML","JUMPING":"ML","STEALTH":"ML","INITIATIVE":"ML","UNARMED":"ML","THROWING":"ML","RIDING":"ML","AWARENESS":"ML","INTRIGUE":"ML","ORATORY":"ML","RHETORIC":"ML","SINGING":"ML","PHYSICIAN":"ML"}
var autoskillsnames = ["Initiative","Unarmed","Dodge","Riding","Climbing","Condition","Jumping","Stealth","Throwing","Awareness","Intrigue","Oratory","Rhetoric","Singing","Physician"]


var attack_melee = {
    "block": [
        ["BF", "AF", "DTA", "DTA"],
        ["DF", "Block", "DTA", "DTA"],
        ["A*2", "A*1", "Block", "DTA"],
        ["A*3", "A*2", "A*1", "Block"]
    ],
    "counterstrike": [
        ["BF", "AF", "D*2", "D*3"],
        ["DF", "Block", "D*1", "D*2"],
        ["A*3", "A*2", "B*1", "D*1"],
        ["A*4", "A*3", "A*1", "B*2"]
    ],
    "dodge": [
        ["BS", "AS", "DTA", "DTA"],
        ["DS", "miss", "miss", "DTA"],
        ["A*2", "A*1", "miss", "miss"],
        ["A*3", "A*2", "A*1", "miss"]
    ],
    "ignore": [
        ["DTA"],
        ["A*1"],
        ["A*3"],
        ["A*4"]]
}


var attack_missile = {
    "block": [
        ["Wild", "Wild", "Wild", "Wild"],
        ["miss", "miss", "miss", "miss"],
        ["M*2", "M*1", "Block", "Block"],
        ["M*3", "M*2", "M*1", "Block"]
    ],
    "dodge": [
        ["Wild", "Wild", "Wild", "Wild"],
        ["miss", "miss", "miss", "miss"],
        ["M*2", "M*1", "miss", "miss"],
        ["M*3", "M*2", "M*1", "miss"]
    ],
    "ignore": [
        ["Wild"],
        ["miss"],
        ["M*2"],
        ["M*3"]
    ],
    "counterstrike": [
        ["Wild", "Wild", "Wild", "Wild"],
        ["miss", "miss", "miss", "miss"],
        ["M*2", "M*2", "M*2", "M*2"],
        ["M*3", "M*3", "M*3", "M*3"]
    ]
}

var coverage2loc = {
    "Sk": { "LOC": "SKULL", "COV": "", "AQ": 0, "B": 0, "E": 0, "P": 0, "F": 0 },
    "Fa": { "LOC": "FACE", "COV": "", "AQ": 0, "B": 0, "E": 0, "P": 0, "F": 0 },
    "Nk": { "LOC": "NECK", "COV": "", "AQ": 0, "B": 0, "E": 0, "P": 0, "F": 0 },
    "Sh": { "LOC": "SHOULDER", "COV": "", "AQ": 0, "B": 0, "E": 0, "P": 0, "F": 0 },
    "Ua": { "LOC": "UPPERARM", "COV": "", "AQ": 0, "B": 0, "E": 0, "P": 0, "F": 0 },
    "El": { "LOC": "ELBOW", "COV": "", "AQ": 0, "B": 0, "E": 0, "P": 0, "F": 0 },
    "Fo": { "LOC": "FOREARM", "COV": "", "AQ": 0, "B": 0, "E": 0, "P": 0, "F": 0 },
    "Ha": { "LOC": "HAND", "COV": "", "AQ": 0, "B": 0, "E": 0, "P": 0, "F": 0 },
    "Tx": { "LOC": "THORAX", "COV": "", "AQ": 0, "B": 0, "E": 0, "P": 0, "F": 0 },
    "Ab": { "LOC": "ABDOMEN", "COV": "", "AQ": 0, "B": 0, "E": 0, "P": 0, "F": 0 },
    "Gr": { "LOC": "GROIN", "COV": "", "AQ": 0, "B": 0, "E": 0, "P": 0, "F": 0 },
    "Hp": { "LOC": "HIP", "COV": "", "AQ": 0, "B": 0, "E": 0, "P": 0, "F": 0 },
    "Th": { "LOC": "THIGH", "COV": "", "AQ": 0, "B": 0, "E": 0, "P": 0, "F": 0 },
    "Kn": { "LOC": "KNEE", "COV": "", "AQ": 0, "B": 0, "E": 0, "P": 0, "F": 0 },
    "Ca": { "LOC": "CALF", "COV": "", "AQ": 0, "B": 0, "E": 0, "P": 0, "F": 0 },
    "Ft": { "LOC": "FOOT", "COV": "", "AQ": 0, "B": 0, "E": 0, "P": 0, "F": 0 }
}



var hit_location_table = [
    ["01-15", "01-05", "-", "SKULL", "M1", "S2", "S3", "K4", "K5", "Sk", "-", "-", "-", "-", "01-56", "01-00", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
    ["16-30", "06-10", "-", "FACE", "M1", "S2", "S3", "G4", "K5", "Fa", "-", "-", "-", "-", "57-87", "-", "-", "01-00", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
    ["31-45", "11-15", "-", "NECK", "M1", "S2", "S3", "K4", "K5Amp", "Nk", "01-00", "-", "-", "-", "88-00", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
    ["46-57", "16-27", "-", "SHOULDER", "FumM1", "FumS2", "FumS3", "FumG4", "FumK4", "Sh", "-", "-", "-", "01-09", "-", "-", "-", "-", "-", "01-00", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
    ["58-69", "28-33", "-", "UPPERARM", "FumM1", "FumM1", "FumS2", "FumS3", "FumG4Amp", "Ua", "-", "01-45", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "01-00", "-", "-", "-", "-"],
    ["70-73", "34-35", "-", "ELBOW", "FumM1", "FumS2", "FumS3", "FumG4", "FumG5Amp", "El", "-", "46-50", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "01-00", "-", "-", "-"],
    ["74-81", "36-39", "01-06", "FOREARM", "FumM1", "FumM1", "FumS2", "FumS3", "FumG4Amp", "Fo", "-", "51-91", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "01-00", "-", "-"],
    ["82-85", "40-43", "07-12", "HAND", "FumM1", "FumS2", "FumS3", "FumG4", "FumG5Amp", "Ha", "-", "92-00", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "01-00", "-"],
    ["86-95", "44-60", "13-19", "THORAX", "M1", "S2", "S3", "G4", "K5", "Tx", "-", "-", "-", "10-49", "-", "-", "-", "-", "01-00", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
    ["95-00", "61-70", "20-29", "ABDOMEN", "M1", "S2", "S3", "K4", "K5", "Ab", "-", "-", "-", "50-72", "-", "-", "01-00", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
    ["-", "71-74", "30-35", "GROIN", "M1", "S2", "S3", "G4", "G5Amp", "Gr", "-", "-", "-", "73-83", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "01-00"],
    ["-", "75-80", "36-49", "HIP", "StuM1", "StuS2", "StuS3", "StuG4", "StuK4", "Hp", "-", "-", "-", "84-00", "-", "-", "-", "-", "-", "-", "01-00", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
    ["-", "81-88", "50-70", "THIGH", "StuM1", "StuS2", "StuS3", "StuG4", "StuK4Amp", "Th", "-", "-", "01-49", "-", "-", "-", "-", "-", "-", "-", "-", "01-00", "-", "-", "-", "-", "-", "-", "-", "-"],
    ["-", "89-90", "71-78", "KNEE", "StuM1", "StuS2", "StuS3", "StuG4", "StuG5Amp", "Kn", "-", "-", "50-54", "-", "-", "-", "-", "-", "-", "-", "-", "-", "01-00", "-", "-", "-", "-", "-", "-", "-"],
    ["-", "91-96", "79-92", "CALF", "StuM1", "StuM1", "StuS2", "StuS3", "StuG4Amp", "Ca", "-", "-", "55-85", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "01-00", "-", "-", "-", "-", "-", "-"],
    ["-", "97-00", "93-00", "FOOT", "StuM1", "StuS2", "StuS3", "StuG4", "StuG5Amp", "Ft", "-", "-", "86-00", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "01-00", "-", "-", "-", "-", "-"]
]

var hit_loc_penalty = {
    "high": { "index": 0, "penalty": 10 },
    "mid": { "index": 1, "penalty": 0 },
    "low": { "index": 2, "penalty": 10 },
    "arms": { "index": 11, "penalty": 20 },
    "legs": { "index": 12, "penalty": 20 },
    "torso": { "index": 13, "penalty": 20 },
    "head": { "index": 14, "penalty": 25 },
    "neck": { "index": 10, "penalty": 35 },
    "skull": { "index": 15, "penalty": 30 },
    "abdomen": { "index": 16, "penalty": 25 },
    "face": { "index": 17, "penalty": 35 },
    "thorax": { "index": 18, "penalty": 25 },
    "shoulder": { "index": 19, "penalty": 25 },
    "hip": { "index": 20, "penalty": 25 },
    "thigh": { "index": 21, "penalty": 25 },
    "knee": { "index": 22, "penalty": 30 },
    "calf": { "index": 23, "penalty": 25 },
    "foot": { "index": 24, "penalty": 30 },
    "upper_arm": { "index": 25, "penalty": 25 },
    "elbow": { "index": 26, "penalty": 30 },
    "forearm": { "index": 27, "penalty": 25 },
    "hand": { "index": 28, "penalty": 30 },
    "groin": { "index": 29, "penalty": 35 }
}
                        

var armor_coverage = {
    "Ailettes":{"zone":"aile","coverage":["Sh"]},
    "Backplate":{"zone":"thor","coverage":["Tx","Ab"]},
    "Body":{"zone":"body","coverage":["Sk","Nk","Fa","Ft","Ha","Ua","Sh","Tx","Ab","Hp","Gr","Fo","El","Th","Kn","Ca"]},
    "Boots, calf":{"zone":"feet","coverage":["Ca","Ft"]},
    "Boots, knee":{"zone":"feet","coverage":["Kn","Ca","Ft"]},
    "Breastplate":{"zone":"thor","coverage":["Tx","Ab"]},
    "Breastplate-Backplate":{"zone":"thor","coverage":["Tx","Ab"]},
    "Byrnie":{"zone":"body","coverage":["Ua","Sh","Tx","Ab","Hp","Gr"]},
    "Byrnie, long":{"zone":"body","coverage":["Ua","Sh","Tx","Ab","Hp","Gr","Th"]},
    "Cap":{"zone":"head","coverage":["Sk"]},
    "Cloak":{"zone":"clok","coverage":["Sh","Tx","Hp","Ua","Gr"]},
    "Cloak(Long), hood":{"zone":"body","coverage":["Sk","Nk","Sh","Tx","Ab","Hp","Gr","Th","Kn","Ua"]},
    "Coudes":{"zone":"coud","coverage":["El"]},
    "Cowl":{"zone":"head","coverage":["Sk","Nk"]},
    "Cowl, long":{"zone":"head","coverage":["Sk","Nk","Sh"]},
    "Cowl, short":{"zone":"head","coverage":["Sk","Nk"]},
    "Cowl/hood":{"zone":"head","coverage":["Sk","Nk"]},
    "Cuirass":{"zone":"thor","coverage":["Tx"]},
    "Dress":{"zone":"robe","coverage":["Ua","Sh","Tx","Ab","Hp","Gr","Th","Kn","Ca"]},
    "Gambeson":{"zone":"body","coverage":["Fo","El","Ua","Sh","Tx","Ab","Hp","Gr","Th"]},
    "Gauntlets":{"zone":"hand","coverage":["Ha"]},
    "Gloves":{"zone":"hand","coverage":["Ha"]},
    "Gorget":{"zone":"head","coverage":["Nk"]},
    "Greathelm":{"zone":"head","coverage":["Sk","Fa","Nk"]},
    "Greaves":{"zone":"grev","coverage":["Ca"]},
    "Halfhelm":{"zone":"head","coverage":["Sk"]},
    "Hat/Cap":{"zone":"head","coverage":["Sk"]},
    "Haubergeon":{"zone":"body","coverage":["Fo","El","Ua","Sh","Tx","Ab","Hp","Gr"]},
    "Hauberk":{"zone":"body","coverage":["Fo","El","Ua","Sh","Tx","Ab","Hp","Gr","Th"]},
    "Hauberk, long":{"zone":"body","coverage":["Fo","El","Ua","Sh","Tx","Ab","Hp","Gr","Th","Kn"]},
    "Hauberk, short":{"zone":"body","coverage":["Ua","Sh","Tx","Ab","Hp","Gr","Th"]},
    "Hood":{"zone":"head","coverage":["Sk","Nk"]},
    "Kneecops":{"zone":"knee","coverage":["Kn"]},
    "Leggings":{"zone":"legs","coverage":["Hp","Gr","Th","Kn","Ca","Ft"]},
    "Mittens":{"zone":"hand","coverage":["Ha"]},
    "Pants":{"zone":"legs","coverage":["Hp","Gr","Th","Kn","Ca"]},
    "Rerebraces":{"zone":"rere","coverage":["Ua"]},
    "Robe":{"zone":"robe","coverage":["Ua","Sh","Tx","Ab","Hp","Gr","Fo","El","Th","Kn","Ca"]},
    "Sandals":{"zone":"feet","coverage":["Ft"]},
    "Shirt":{"zone":"body","coverage":["Fo","El","Ua","Sh","Tx","Ab","Hp","Gr"]},
    "Shirt(Long)":{"zone":"body","coverage":["Fo","El","Ua","Sh","Tx","Ab","Hp","Gr","Th"]},
    "Shoes":{"zone":"feet","coverage":["Ft"]},
    "ShortSleeveShirt":{"zone":"body","coverage":["Ua","Sh","Tx","Ab","Hp","Gr"]},
    "ShortSleeveShirt(long)":{"zone":"body","coverage":["Ua","Sh","Tx","Ab","Hp","Gr","Th"]},
    "Skirt, long":{"zone":"thor","coverage":["Hp", "Gr","Th"]},
    "Skirt, short":{"zone":"thor","coverage":["Hp","Gr"]},
    "Skull":{"zone":"head","coverage":["Sk","Fa"]},
    "Surcoat":{"zone":"robe","coverage":["Sh","Tx","Ab","Hp","Gr","Th"]},
    "Three-quarter helm":{"zone":"head","coverage":["Sk","Fa"]},
    "Tunic":{"zone":"body","coverage":["Ua","Sh","Tx","Ab","Hp","Gr"]},
    "Tunic, long":{"zone":"body","coverage":["Ua","Sh","Tx","Ab","Hp","Gr","Th"]},
    "Vambraces":{"zone":"vamb","coverage":["Fo"]},
    "Vest":{"zone":"body","coverage":["Sh","Tx","Ab"]},    
}


var armor_prot = {
    "Brown bear": ["nat", "6", "4", "3", "5"],
    "Dire wolf": ["nat", "5", "4", "2", "4"],
    "beaver": ["leather", "2", "4", "3", "3"],
    "buckram": ["cloth", "1", "1", "1", "1"],
    "canvas": ["cloth", "1", "1", "1", "1"],
    "cloth": ["cloth", "1", "1", "1", "1"],
    "dog": ["nat", "4", "3", "1", "3"],
    "ermine": ["leather", "2", "4", "3", "3"],
    "fur(light)": ["fur", "3", "2", "2", "3"],
    "fur(thick)": ["fur", "5", "3", "2", "4"],
    "gargun": ["nat", "4", "3", "1", "3"],
    "horse": ["nat", "4", "3", "1", "3"],
    "kurbul": ["kurbul", "4", "5", "4", "3"],
    "kurbul+1": ["kurbul+1", "5", "6", "5", "4"],
    "leather": ["leather", "2", "4", "3", "3"],
    "leather+1": ["leather+1", "3", "5", "4", "4"],
    "leather+2": ["leather+2", "4", "6", "5", "5"],
    "lightlinen": ["cloth", "0", "1", "0", "1"],
    "lightsilk": ["cloth", "0", "1", "0", "0"],
    "linen": ["cloth", "1", "1", "1", "1"],
    "mail": ["mail", "2", "8", "5", "1"],
    "mail+1": ["mail+1", "3", "9", "6", "2"],
    "mail+2": ["mail+2", "4", "10", "7", "3"],
    "mail+3": ["mail+3", "5", "11", "8", "4"],
    "nat1": ["nat1", "1", "1", "1", "1"],
    "nat2": ["nat2", "2", "2", "2", "2"],
    "nat3": ["nat3", "3", "3", "3", "3"],
    "plate": ["plate", "6", "10", "6", "2"],
    "plate+1": ["plate+1", "7", "11", "7", "3"],
    "plate+2": ["plate+2", "8", "12", "8", "4"],
    "quilt": ["quilt", "5", "3", "2", "4"],
    "quilt+1": ["quilt+1", "6", "4", "3", "5"],
    "ring": ["ring", "3", "6", "4", "3"],
    "ring+1": ["ring+1", "4", "7", "5", "4"],
    "ring+2": ["ring+2", "5", "8", "6", "5"],
    "russet": ["cloth", "1", "1", "1", "1"],
    "scale": ["scale", "5", "9", "4", "5"],
    "sealskin": ["quilt", "5", "3", "2", "5"],
    "serge": ["cloth", "1", "1", "1", "1"],
    "silk": ["cloth", "1", "1", "1", "1"],
    "waxed canvas": ["cloth", "1", "1", "1", "1"],
    "wolf": ["nat", "4", "3", "1", "3"],
    "worsted": ["cloth", "1", "1", "1", "1"]
}


var weapons_table = {
    "Shield(Round)":["13","5","20","0","2","-","-"],
"Shield(Kite)":["14","5","25","0","3","-","-"],
"Shield(Knight)":["13","5","20","0","2","-","-"],
"Shield(Tower)":["14","5","25","0","3","-","-"],
"Shield(Buckler)":["12","5","15","0","1","-","-"],
"Dagger":["11","5","5","0","1","2","4"],
"Keltan":["12","5","10","0","2","0","3"],
"Knife":["10","5","0","0","0","1","4"],
"Taburi":["10","5","0","0","0","-","4"],
"Sword(Longknife)":["12","10","15","0","1","3","5"],
"Sword(Shortsword)":["12","10","5","0","2","4","4"],
"Mankar":["11","10","5","0","2","5","0"],
"Mang":["11","15","10","-5","3","6","0"],
"Sword(Broadsword)":["12","15","10","0","3","5","3"],
"Sword(StarSteel)":["14","17","10","0","3","5","4"],
"Sword(Estoc)":["11","15","10","0","3","0","6"],
"Sword(Falchion)":["12","15","5","0","4","6","1"],
"Sword(Bastard Sword)":["12","20","10","-10","4","7","4"],
"Sword(Battlesword)":["13","25","10","-20","5","8","4"],
"Club":["9","15","5","0","4","-","0"],
"Club(Mace)":["11","15","5","0","6","-","0"],
"Club(Morningstar)":["11","20","5","-10","0","-","5"],
"Club(Maul)":["9","20","5","-20","7","-","0"],
"Hatchet":["9","5","5","0","3","4","-"],
"Axe(Handaxe)":["11","10","5","0","4","6","-"],
"Axe(Warhammer)":["11","15","5","-5","6","-","-"],
"Axe(Battleaxe)":["12","20","10","-15","6","9","-"],
"Flail(Grainflail)":["9","20","5","0","5","-","-"],
"Flail(Ball & Chain)":["12","20","10","0","8","-","-"],
"Flail(Warflail)":["11","25","10","-20","9","-","-"],
"Spear(Staff)":["11","20","15","-10","4","-","-"],
"Spear(Javelin)":["10","15","5","-10","2","-","6"],
"Spear(Spear)":["11","20","10","-10","4","-","7"],
"Spear(Trident)":["12","20","15","-10","4","-","5"],
"Polearm(Lance)":["11","25","5","-15","4","-","8"],
"Polearm(Poleaxe)":["11","25","5","-15","6","9","6"],
"Polearm(Pike)":["12","25","5","-25","4","-","8"],
"q1":["11","25","5","-15","6","9","6"],
"Lightsabre":["18","35","25","0","-","30","30"],
"Bow(Crossbow)":["10","5","5","0","3","-","-"],
"Bow(Longbow)":["11","5","5","0","2","-","-"],
"Compound Bow":["13","5","5","0","1","-","-"],
"Bow(Shortbow)":["10","5","5","0","1","-","-"],
"Bow(Hartbow)":["13","5","5","0","1","-","-"],
"Unarmed(Kick)":["0","5","5","0","1","-","-"],
"Unarmed(Punch)":["0","0","15","0","0","-","-"],
"Bow(Minicrossbow)":["10","5","5","0","1","-","-"]
}



var missile_range = {"Bow(Shortbow)":[[5,6],[20,6],[40,5],[80,4],[160,3]],
"Bow(Longbow)":[[5,8],[25,8],[50,7],[100,6],[200,5]],
"Bow(Hartbow)":[[10,10],[30,9],[60,8],[120,7],[240,6]],
"Bow(Crossbow)":[[5,9],[20,8],[40,7],[80,6],[160,5]],
"Compound(Bow)":[[10,10],[30,10],[60,9],[120,8],[240,7]],
"Bow(Minicrossbow)":[[5,9],[20,8],[40,7],[80,6],[160,5]],
"Blowgun":[[2,0],[5,0],[10,0],[20,0],[40,0]],
"Sling":[[5,4],[15,4],[30,3],[60,2],[120,2]],
"StaffSling":[[5,5],[25,5],[50,4],[100,3],[200,3]],
"Taburi":[[2,4],[4,4],[8,3],[16,2],[32,2]],
"Shorkana":[[2,5],[3,5],[6,4],[12,3],[24,3]],
"Spear(Javelin)":[[3,7],[8,7],[16,6],[32,5],[64,4]],
"Spear(Spear)":[[3,8],[6,8],[12,7],[24,6],[48,5]],
"Spell(Ethereal Stone)":[[2,6],[5,6],[10,6],[20,6],[40,6]],
"Melee":[[1,1],[2,1],[4,1],[8,1],[16,1]]
}


var months = [
"Nuzyael",
"Peonu",
"Kelen",
"Nolus",
"Larane",
"Agrazhar",
"Azura",
"Halane",
"Savor",
"Ilvin",
"Navek",
"Morgat"
]

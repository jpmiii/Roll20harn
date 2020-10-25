//
//
// CONFIGURATION
//
//
var trace = true; // trace entry and exit for debugging
var generate_item_list = true; //generate the item, weapon, and armor lists for the inventory tab on startup
var skill_list_on = true; //regenerate skill list ability on change to skill tab and skill name change
var weapon_list_on = true; //regenerate weapon list ability on change to weapontab and weapon name change
var realtime = true; //character sheet log shows real time 
var gametime = true; //character sheet log shows game time 
var attack_template = "harn-fancy"; // sets the roll template (harn-fancy or harnroll) for the attack function
var defend_template = "harn-defend"; // sets the roll template (harn-defend or harnroll) for the defend function
var emlmax = 97; // canon 95
var emlmin = 4; // canon 5
//
// House rules
//

var missle_close_range_mod = -15; // house rule close range mod (0 is canon) adds an extra range column for close vs short range
var randomize_init_roll = true; // adds 3d6 to the init for randomness

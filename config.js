//
//
// CONFIGURATION
//
//
var trace = true; // trace entry and exit for debugging
var config = {
    serial: 2, // Increase this by one every time you add/rename/delete an attribute.
    generate_item_list: true, //generate the item, weapon, and armor lists for the inventory tab on startup
    skill_list_on: true, //regenerate skill list ability on change to skill tab and skill name change
    weapon_list_on: true, //regenerate weapon list ability on change to weapontab and weapon name change
    realtime: true, //character sheet log shows real time 
    gametime: true, //character sheet log shows game time 
    attack_template: "harn-fancy", // sets the roll template (harn-fancy or harnroll) for the attack function
    defend_template: "harn-defend", // sets the roll template (harn-defend or harnroll) for the defend function
    shock_marker: "sleepy",
    //
    // House rules - default should always be canon rules
    //
    missle_close_range_mod: 0, // house rule close range mod (0 is canon) adds an extra range column for close vs short range
    randomize_init_roll: false, // adds 3d6 to the init for randomness
    emlmax: 95, // canon 95, house rule 97
    emlmin: 5, // canon 5, house rule 4
    additional_target_locations: false, //add additional target locations e.g. neck for faster combat resolution
    bleedspeed: 20, // bleed points per injury point, 0 to disable

};

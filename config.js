//
//
// CONFIGURATION
//
//
var trace = true; // trace entry and exit for debugging
var config = {
    serial : 1, // Increase this by one every time you add/rename/delete an attribute.
    generate_item_list : true, //generate the item, weapon, and armor lists for the inventory tab on startup
    skill_list_on : true, //regenerate skill list ability on change to skill tab and skill name change
    weapon_list_on : true, //regenerate weapon list ability on change to weapontab and weapon name change
    realtime : true, //character sheet log shows real time 
    gametime : true, //character sheet log shows game time 
    attack_template : "harn-fancy", // sets the roll template (harn-fancy or harnroll) for the attack function
    defend_template : "harn-defend", // sets the roll template (harn-defend or harnroll) for the defend function
    //
    // House rules - default should always be canon rules
    //
    missle_close_range_mod : 0, // house rule close range mod (0 is canon) adds an extra range column for close vs short range
    randomize_init_roll : false, // adds 3d6 to the init for randomness
    emlmax : 95, // canon 95, house rule 97
    emlmin : 5, // canon 5, house rule 4
    additional_target_locations : false, //add additional target locations e.g. neck for faster combat resolution
    
    // house rule tables - add additional entries to tables. Any entry listed here which is also in the canon table will override the canon table.
    additional_skills : {            //additional skills for characters
        // "Needlework": {"type":"LORE","sba":["DEX","EYE","WIL"],"ssm":{"Ula":"0"},"oml":"1","notes":""}
    },
    additional_items : {
        "Bow(Minicrossbow)":{"price":1800,"weight":2.5},
        "Byrnie(long), mail":{"price":760,"weight":26.0},
        "Byrnie(long), ring":{"price":365,"weight":19.6},
        "Byrnie(long), scale":{"price":500,"weight":34.8},
        "Cap, cloth":{"price":8,"weight":0.4},
        "Cap, leather":{"price":16,"weight":0.8},
        "Cloak(long), cloth":{"price":120,"weight":8.8},
        "Cloak(long), hood, cloth":{"price":140,"weight":10.8},
        "Cloak(long), hood, leather":{"price":170,"weight":14.0},
        "Cloak(long), leather":{"price":150,"weight":12.0},
        "Cloak, cloth":{"price":100,"weight":6.6},
        "Cloak, hood, cloth":{"price":115,"weight":8.6},
        "Cloak, hood, leather":{"price":140,"weight":11},
        "Cowl(long), cloth":{"price":15,"weight":1.2},
        "Cowl(long), leather":{"price":18,"weight":2.4},
        "Cowl(long), quilt":{"price":42,"weight":3.6},
        "Cowl, cloth":{"price":10,"weight":0.8},
        "Cowl, leather":{"price":12,"weight":1.6},
        "Cowl, mail":{"price":120,"weight":4.0},
        "Cuirass, kurbul":{"price":120,"weight":6.0},           
        "Cuirass, plate":{"price":600,"weight":19.2},    
        "Dress(longsleeve), cloth":{"price":160,"weight":8.2},
        "Dress(shortsleeve), cloth":{"price":150,"weight":7.8},
        "Gauntlets, leather":{"price":16,"weight":0.8},                
        "Gloves, cloth":{"price":15,"weight":0.4},        
        "Gorget, plate":{"price":50,"weight":2.0},
        "Hat, cloth":{"price":16,"weight":0.5},
        "Hat, leather":{"price":28,"weight":1.2},
        "Hauberk(shortsleeve), mail":{"price":855,"weight":26.0},
        "Hauberk(shortsleeve), ring":{"price":399,"weight":24},
        "Hauberk(shortsleeve), scale":{"price":570,"weight":45.5},              
        "Hauberk, mail":{"price":900,"weight":27.0},
        "Hauberk, ring":{"price":420,"weight":26},
        "Hauberk, scale":{"price":600,"weight":50},
        "Hood, cloth":{"price":16,"weight":0.8},
        "Hood, leather":{"price":12,"weight":1.6},
        "Hood, quilt":{"price":32,"weight":2.4},
        "Kneecops, plate":{"price":75,"weight":2.4},         
        "Leggings, cloth":{"price":88,"weight":4.4},
        "Leggings, leather":{"price":176,"weight":8.8},
        "Leggings, mail":{"price":615,"weight":22.0},             
        "Lightsabre":{"price":9600000,"weight":0.2},
        "Loincloth, cloth":{"price":20,"weight":1.0},
        "Loincloth, fur":{"price":40,"weight":2.4},
        "Loincloth, leather":{"price":40,"weight":2.0},
        "Pants, leather":{"price":165,"weight":7.0},
        "Pants, quilt":{"price":174,"weight":8.2},
        "Robe, cloth":{"price":156,"weight":7.8},
        "Robe, hood, cloth":{"price":156,"weight":7.8},
        "Shirt(long), cloth":{"price":100,"weight":6.8},
        "Shirt(long), leather":{"price":120,"weight":11.8},
        "Shirt(long), quilt":{"price":200,"weight":17.5},
        "Shirt, cloth":{"price":100,"weight":5.2},
        "Shirt, leather":{"price":120,"weight":9.8},
        "Shirt, quilt":{"price":200,"weight":15.0},
        "Shorts, cloth":{"price":40,"weight":2.0},
        "Shorts, fur":{"price":60,"weight":4.8}, 
        "Shorts, leather":{"price":60,"weight":4.0},
        "Skirt(long), cloth":{"price":20,"weight":4.0},
        "Skirt(long), leather":{"price":30,"weight":5.6},              
        "Skirt(mid), cloth":{"price":20,"weight":3.0},
        "Skirt(mid), leather":{"price":30,"weight":4.2},
        "Skirt(mini), cloth":{"price":20,"weight":1.0},
        "Skirt(mini), leather":{"price":30,"weight":1.4},
        "Skirt(short), cloth":{"price":20,"weight":2.0},
        "Skirt(short), leather":{"price":30,"weight":2.8},
        "Skull, bone":{"price":0,"weight":0},
        "Surcoat, cloth":{"price":104,"weight":5.2},
        "Surcoat, leather":{"price":208,"weight":10.4},
        "Tunic(long), cloth":{"price":100,"weight":4.8},
        "Tunic(long), leather":{"price":125,"weight":9.2},
        "Tunic(long), quilt":{"price":200,"weight":15.6},
        "Tunic, cloth":{"price":88,"weight":4.4},
        "Vest, cloth":{"price":56,"weight":2.8},
        "Vest, fur":{"price":112,"weight":7.0},
        "Vest, leather":{"price":112,"weight":5.6},
        "Vest, quilt":{"price":112,"weight":7.0},                                        
    },

    additional_armor_coverage : {
        "Hat":{"zone":"head","coverage":["Sk"]},
        "Cowl(long)":{"zone":"head","coverage":["Sk","Nk","Sh"]},
        "Hood":{"zone":"head","coverage":["Sk","Nk"]},
        "Greathelm":{"zone":"head","coverage":["Sk","Fa","Nk"]},
        "Cloak":{"zone":"clok","coverage":["Sh","Tx","Hp","Ua","Gr"]},
        "Cloak, hood":{"zone":"clok","coverage":["SK","Nk","Sh","Tx","Hp","Ua","Gr"]},
        "Cloak(long), hood":{"zone":"body","coverage":["Sk","Nk","Sh","Tx","Ab","Hp","Gr","Th","Kn","Ua"]},
        "Robe":{"zone":"robe","coverage":["Ua","Sh","Tx","Ab","Hp","Gr","Fo","El","Th","Kn","Ca"]},
        "Robe, hood":{"zone":"robe","coverage":["Sk","Nk","Ua","Sh","Tx","Ab","Hp","Gr","Fo","El","Th","Kn","Ca"]},
        "Dress(shortsleeve)":{"zone":"robe","coverage":["Ua","Sh","Tx","Ab","Hp","Gr","Th","Kn","Ca"]},
        "Dress(longsleeve)":{"zone":"robe","coverage":["Fo","El","Ua","Sh","Tx","Ab","Hp","Gr","Th","Kn","Ca"]},
        "Surcoat":{"zone":"robe","coverage":["Sh","Tx","Ab","Hp","Gr","Th"]},
        "Tunic":{"zone":"body","coverage":["Ua","Sh","Tx","Ab","Hp","Gr"]},
        "Tunic(long)":{"zone":"body","coverage":["Ua","Sh","Tx","Ab","Hp","Gr","Th"]},
        "Shirt":{"zone":"body","coverage":["Fo","El","Ua","Sh","Tx","Ab","Hp","Gr"]},
        "Shirt(long)":{"zone":"body","coverage":["Fo","El","Ua","Sh","Tx","Ab","Hp","Gr","Th"]},
        "Vest":{"zone":"body","coverage":["Sh","Tx","Ab"]},
        "Cuirass":{"zone":"thor","coverage":["Tx","Ab"]},
        "Gambeson":{"zone":"body","coverage":["Fo","El","Ua","Sh","Tx","Ab","Hp","Gr","Th"]},
        "Byrnie":{"zone":"body","coverage":["Ua","Sh","Tx","Ab","Hp","Gr"]},
        "Byrnie(long)":{"zone":"body","coverage":["Ua","Sh","Tx","Ab","Hp","Gr","Th"]},
        "Hauberk":{"zone":"body","coverage":["Fo","El","Ua","Sh","Tx","Ab","Hp","Gr","Th"]},
        "Hauberk(shortsleeve)":{"zone":"body","coverage":["Ua","Sh","Tx","Ab","Hp","Gr","Th"]},
        "Gloves":{"zone":"hand","coverage":["Ha"]},
        "Gauntlets":{"zone":"hand","coverage":["Ha"]},
        "Mittens":{"zone":"hand","coverage":["Ha"]},
        "Shorts":{"zone":"thor","coverage":["Hp", "Gr","Th"]},
        "Loincloth":{"zone":"thor","coverage":["Hp","Gr"]},
        "Skirt(mini)":{"zone":"thor","coverage":["Hp","Gr"]},
        "Skirt(short)":{"zone":"thor","coverage":["Hp","Gr","Th"]},
        "Skirt(mid)":{"zone":"thor","coverage":["Hp","Gr","Th","Kn"]},
        "Skirt(long)":{"zone":"thor","coverage":["Hp","Gr","Th","Kn","Ca"]},
        "Pants":{"zone":"legs","coverage":["Hp","Gr","Th","Kn","Ca"]},
        "Leggings":{"zone":"legs","coverage":["Hp","Gr","Th","Kn","Ca","Ft"]},
        "Boots, calf":{"zone":"feet","coverage":["Ca","Ft"]},
        "Boots, knee":{"zone":"feet","coverage":["Kn","Ca","Ft"]},
        "Shoes":{"zone":"feet","coverage":["Ft"]},
        "Sandals":{"zone":"feet","coverage":["Ft"]},
        "Gorget":{"zone":"head","coverage":["Nk"]},
        "Vambraces":{"zone":"vamb","coverage":["Fo"]},
        "Greaves":{"zone":"grev","coverage":["Ca"]}
    },

    additional_armor_prot : {
        "bone":["bone","2","2","2","2"],
        "bone+1":["bone+1","3","3","3","3"],
        "bone+2":["bone+2","4","4","4","4"],
    }

    additional_occupational_skills : {
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
    house_rule_occupation_time : {
        // "Archeologist": "14"
    }
};

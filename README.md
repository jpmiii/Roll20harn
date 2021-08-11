# Roll20harn
Harnmaster roll20 API scripts and custom character sheet


### [Columbia Games Harn](http://columbiagames.com/harn/index.html)

## Installing
1. This set of libraries requires a PRO subscription (API access)
1. From your game landing page (the one with the "launch game" button) 
   go to Settings->Game Settings
1. For Character Sheet Template, select Custom
1. Copy & paste the file ``roll20harn.html`` into the HTML Layout tab
1. Press Save changes
1. Copy & paste the file ``roll20harn.css`` into the CSS Styling tab.
1. Press Save changes
1. From your game landing page (the one with the "launch game" button) 
   go to Settings->API Scripts
1. Create a new script. It doesn't matter what it is named. 
1. Copy & paste the contents of all the .js files into your new script tab. **Alternatively** copy the content from `full.txt` to the new script tab.
1. Save it.

### Installing from publish.ps1 script [Windows]
1. From your game landing page (the one with the "launch game" button) 
   go to Settings->API Scripts
1. Create two new scripts. It doesn't matter what they are named.
1. Save both of them.
1. Move you mouse over the tabs so the link text will show in the status bar on the bottom left of you browser, the number at the end is the script number for that tab.
1. open a power shell in the resources folder that has the publish.ps1 in it.
1. run ```.\publish.ps1 -email you@domain.com -password password -campaign campaign_number -script script_number_1 -confignum script_number_2```
1. If you use the same tab number for script_number_1 and script_number_2 the config and the other .js files will all be uploaded to the one tab.
1. If you don't use the -confignum option no config will be uploaded.
1. Other options:
    ```
    -config: path and name of config file default=..\config.js
    -dir: path to the .js files default=..\
    -pa: public access default=false
    -bgi: background image (none|magic|matrix|field) default=none
    -aci: allow character import default=true
    ```
1. After publishing, you will still need to restart the API sandbox.

### Installing from campaign_publish.sh script [Mac/linux]
1. From your game landing page (the one with the "launch game" button) 
   go to Settings->API Scripts
1. Create a new script. It doesn't matter what it is named. 
1. Move you mouse over the tab so the link text will show in the status bar on the bottom left of you browser, the number at the end is the script number for that tab.
1. Create/edit a file ```campaign.txt```
    ```
    email=you@domain.com
    password=yourpassword
    campaign=campaign number
    script=script number
    publicaccess=(true|false)
    bgimage=(none|magic|matrix|field)
    allowcharacterimport=(true|false)
    ```
1. run ```campaign_publish.sh -l campaign.txt``` on Mac or Linux.
1. If you want to have your own house rule settings, copy config.js to campaign_config.js and publish with
   ```campaign_publish.sh -l campaign.txt -f campaign_config.js```

### Some Info

Also when using the Calculate SB button it will...
if the number in the ML box  is less than SB it will multiply the number in the ML box times the calculated SB and put it in the ML box (it will treat it as an OML)  then put the calculated SB in the SB box. If there's nothing in the ML box it will use the OML from the skills table.

The occupation command uses the occupation box on the character sheet and the character_id. It will add the skills for that occupation to the character and OVERWRITE the ML of that skill with the OML for that occupation. To use it you would make a one shot ability that said "!occupation @{character_id}" or, if your character has a token, select the token and type "!occupation @{selected|character_id}" in the chat.


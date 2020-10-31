# Roll20harn
Harnmaster roll20 API scripts and custom character sheet

## Installing
1. This set of libraries requires a PRO subscription (API access)
1. From your game landing page (the one with the "launch game" button) 
   go to Settings->Game Settings
1. For Character Sheet Template, select Custom
1. copy & paste the file ``roll20harn.html`` into the HTML Layout tab
1. Press Save changes
1. copy & paste the file ``roll20harn.css`` into the CSS Styling tab.
1. Press Save changes
1. From your game landing page (the one with the "launch game" button) 
   go to Settings->API Scripts
1. Create a new script. It doesn't matter what it is named. 
1. copy & paste the contents of all the .js files into your new script tab.
1. Save it.

### Installing from publish.ps1 script [Windows]
1. From your game landing page (the one with the "launch game" button) 
   go to Settings->API Scripts
1. Create two new scripts. It doesn't matter what they are named.
1. Save both of them.
1. Move you mouse over the tabs so the link text will show in the status bar on the bottom left of you browser, the number at the end is the script number for that tab.
1. open a power shell in the rescouces folder that has the publish.ps1 in it.
1. run ```.\publish.ps1 -email you@domain.com -password password -campaign campaign_number -script script_number_1 -confignum script_number_2```
1. After publishing, you will still need to restart the API sandbox.

### Installing from campaign_publish.sh script [Mac/linux]
1. Create/edit a file ```campaign.txt```
    ```
    email=you@domain.com
    password=yourpassword
    campaign=campaign number
    script=script number
    ```
1. run ```campaign_publish.sh -l campaign.txt``` on Mac or Linux.
1. If you want to have your own house rule settings, copy config.js to campaign_config.js and publish with
   ```campaign_publish.sh -l campaign.txt -f campaign_config.js```

The campaign.txt file should contain the following settings in addition to the above.
If you don't have them, then default values will be used.
```
publicaccess=(true|false)
bgimage=(none|magic|matrix|field)
allowcharacterimport=(true|false)
```
[Columbia Games Harn](http://columbiagames.com/harn/index.html)
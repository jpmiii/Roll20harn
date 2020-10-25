# Roll20harn
Harnmaster roll20 API scripts and custom character sheet

## Installing
1. This set of libraries requires a PRO subscription (API access)
1. From your game landing page (the one with the "launch game" button) 
   go to Settings->Game Settings
1. For Character Sheet Template, select Custom
1. copy & paste the file ``roll20harn.html`` into the HTML Layout tab
1. copy & paste the file ``roll20harn.css`` into the CSS Styling tab.
1. Press Save changes
1. From your game landing page (the one with the "launch game" button) 
   go to Settings->API Scripts
1. Create a new script. It doesn't matter what it is named. Save it.
1. Look in the URL - make note of the last part of the URL - that's 
   your campaign number
1. View source of the page you are on and look for ```script-```. Make
   note of the number. That's your script number.
1. [Mac/linux only] Create/edit a file ```campaign.txt```
    ```
    email=you@domain.com
    password=yourpassword
    campaign=campaign number
    script=script number
    ```
1. run ```campaign_publish.sh``` on Mac or Linux.
1. run ```campaign_publish.ps1 -email you@domain.com -campaign campaign_number -script script_number -password password``` on Windows
1. After publishing, you will still need to restart the API sandbox.


[Columbia Games Harn](http://columbiagames.com/harn/index.html)
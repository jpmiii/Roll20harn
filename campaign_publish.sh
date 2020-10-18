#!/bin/sh

# How to install:
# Create a file campaign.txt in the format:
# email=username
# password=password_in_cleartext_sorry
# campaign=the_number_of_your_game_from_the_URL
# script=number_for_your_script_you'll_have_to_get_from_the_HTML

# Original script from user Ammo
# https://app.roll20.net/forum/post/7047550/how-to-share-scripts-between-games/?pageforid=7047550

# read in the variables defined in login.txt
source campaign.txt

# delete the cookies from last time
rm roll20*.cookies 2>/dev/null

# get all the js into a single variable
tempfile=$(mktemp -t harn)

echo "# Published on $(date "+%Y%m%d %H:%M")" > $tempfile
echo "# Git branch: $(git branch --show-current)" >> $tempfile

# combine all the JS files into a single JS file
cat *.js >> $tempfile

CURL_ARGS=""
if [ "-v" == "$1" ]; then
        CURL_ARGS="--verbose"
fi

# Post that one JS file to Roll20.
curl \
        $CURL_ARGS \
        -c roll20.cookies \
        -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' \
        -H 'Accept-Encoding: br, gzip, deflate' \
        -H 'Host: app.roll20.net' \
        -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Safari/605.1.15' \
        -H 'Accept-Language: en-us' \
        -d email=${email} \
        -d password=${password} \
        -o roll20_login.respose https://app.roll20.net/sessions/create \
--next \
        $CURL_ARGS \
        -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' \
        -H 'Host: app.roll20.net' \
        -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Safari/605.1.15' \
        -H 'Accept-Language: en-us' \
        -H 'Referer: https://app.roll20.net/sessions/create' \
        https://app.roll20.net/campaigns/save_script/${campaign}/${script} \
        --data-urlencode 'name=harn.js' \
        --data-urlencode content@$tempfile

rm $tempfile
echo
echo "You now have to manually restart the API sandbox."
#!/bin/sh

# How to install:
# Create a file campaign.txt in the format:
# email=username
# password=password_in_cleartext_sorry
# campaign=the_number_of_your_game_from_the_URL
# script=number_for_your_script_you'll_have_to_get_from_the_HTML

# You can create additional files, each named for your various campaigns, and publish to them
# with the argument -l filename, e.g.
# campaign_publish.sh -l campaign_two.txt

# you can alternately pass in individual settings with -u, -p, -c and -s.

# You can have your house rules for config.js by passing in -f replacement_config.js file

# to help debug, you can pass in -v

# Original script from user Ammo
# https://app.roll20.net/forum/post/7047550/how-to-share-scripts-between-games/?pageforid=7047550

bold=$(tput bold)
normal=$(tput sgr0)

config=config.js
dir="./"
CURL_ARGS="-s"
credfile="campaign.txt"
while getopts ":l:c:s:u:p:f:d:vh" opt; do
  case ${opt} in
    d ) # what directory the files are in
        echo "Looking in $OPTAG for all .js files"
        dir=$OPTARG
        ;;
    f ) # config.js file
        config=$OPTARG
        if [[ -f $config ]]; then
                echo "Using $config instead of config.js"
        else
                echo "Unable to locate ${config}"
                exit 1
        fi
        ;;
    c ) # campaign
        campaign=$OPTARG
        ;;
    s ) # script
        script=$OPTARG
        ;;
    l ) # login credentials file
        echo "Reading credentials from ${OPTARG}"
        source $OPTARG
        ;;
    u ) # username
        email=$OPTARG
        ;;
    p ) # password
        password=$OPTARG
        ;;
    v ) # process option t
        CURL_ARGS="--verbose"
      ;;
    h ) echo "Usage: $(basename $0) [-h] [-t]"
         echo "${bold}-f filename${normal} uploads filename instead of config.js for house rule settings"
         echo "${bold}-d dir${normal} read all js files (except -f filename) from dir instead of current working directory"
         echo "${bold}-l loginfile${normal} a file containing email, password, campaign and script settings"
         echo "${bold}-u email${normal} login to roll20 using email"
         echo "${bold}-p password${normal} login to roll20 using password"
         echo "${bold}-c campaign${normal} publish to this roll20 campaign number"
         echo "${bold}-s script${normal} publish to this roll20 script id"
         echo "${bold}-v${normal} outputs verbose information from the publishing"
         echo "${bold}-h${normal} this help text"
         exit
      ;;
  esac
done
shift $((OPTIND -1))

# read in the variables defined in $credfile
echo "Using email: ${email}, campaign: ${campaign}, script: ${script}"
# delete the cookies from last time
rm roll20*.cookies 2>/dev/null

# get all the js into a single variable
tempfile=$(mktemp -t harn)

echo "// Published on $(date "+%Y%m%d %H:%M")" > $tempfile
echo "// Git branch: $(git branch --show-current)" >> $tempfile
echo "Publishing..."
for i in ${config} *[^config].js; do
        echo "$i"
done
cat ${config} >> $tempfile
# combine all the remaining JS files into a single JS file
cat *[^config].js >> $tempfile

# Post that one JS file to Roll20.
out=$(curl \
        $CURL_ARGS \
        -w 'status_code=%{http_code}\n' \
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
        -w 'status_code=%{http_code}\n' \
        -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' \
        -H 'Host: app.roll20.net' \
        -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Safari/605.1.15' \
        -H 'Accept-Language: en-us' \
        -H 'Referer: https://app.roll20.net/sessions/create' \
        https://app.roll20.net/campaigns/save_script/${campaign}/${script} \
        --data-urlencode 'name=roll20harn.js' \
        --data-urlencode content@$tempfile)
code=$(echo ${out}|grep status_code|awk -F"=" '{print $3}')
echo
if test "$code" != "200"; then
        echo "An error occurred while publishing. Please check the login credentials. Try -v for more information"
else
        echo "${bold}You now have to manually restart the API sandbox.${normal}"
fi
rm $tempfile
echo

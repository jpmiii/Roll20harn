#
# Script to create the full.txt file to easily keep it up to date.
# 
now=$(date +"%m/%d/%Y %H:%M:%S")
echo "//" > full.txt
echo "//  ${now}" >> full.txt
cat *.js >> full.txt
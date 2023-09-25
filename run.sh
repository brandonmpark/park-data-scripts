#!/bin/sh

osascript -e 'tell application "Terminal"
    activate
    do script "cd ~/Desktop/Coding/park-data/scripts && caffeinate -i ./poll.sh"
end tell'
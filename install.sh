#!/bin/bash
NAME="openmediavault-smartfancontrol"
DEBFOLDER="debian"

if [ "$EUID" -ne 0 ]
then 
	echo "Please execute as root ('sudo install.sh' or 'sudo make install')"
	exit
fi

if [ "$1" == "-h" ] || [ "$1" == "-H" ]
then
	echo "Usage:"
	echo "  -h/ -H       : this help file"
	echo "  -d/ -D       : build debian package"
	echo "  -c/ -C       : Cleanup compiled files in install folder"
elif [ "$1" == "-c" ] || [ "$1" == "-C" ]
then
	echo "$NAME Deleting compiled files in install folder"
	rm -f ./*.deb
	rm -rf "$DEBFOLDER"/$NAME
	rm -rf "$DEBFOLDER"/.debhelper
	rm -f "$DEBFOLDER"/files
	rm -f "$DEBFOLDER"/files.new
	rm -f "$DEBFOLDER"/$NAME.*
elif [ "$1" == "-d" ] || [ "$1" == "-D" ]
then
	echo "$NAME build debian package"
	fakeroot debian/rules clean binary
	mv ../*.deb .
else
	echo "$NAME no argument, enter ./install.sh -h for help"
fi

#!/bin/bash
DIR_DIST="dist"
DIR_COMPRESSED="assets/compressed"
CURRENT_TIMESTAMP="$(date +%s)"
ASSETS_URL=""
increment_version()
{
  local v=$1
 if [ -z $2 ]; then 
    local rgx='^((?:[0-9]+\.)*)([0-9]+)($)'
 else 
    local rgx='^((?:[0-9]+\.){'$(($2-1))'})([0-9]+)(\.|$)'
    for (( p=`grep -o "\."<<<".$v"|wc -l`; p<$2; p++)); do 
       v+=.0; done; fi
 val=`echo -e "$v" | perl -pe 's/^.*'$rgx'.*$/$2/'`
 echo "$v" | perl -pe s/$rgx.*$'/${1}'`printf %0${#val}s $(($val+1))`/
}

create_version(){
		ENVVERSIONFILE="../.${1}_current_version.txt"
		if [ ! -f "$ENVVERSIONFILE" ]
                then
                    echo "$ENVVERSIONFILE file not found for this ENV ${1}."                        
                    exit;
                fi
		version=$(head -n 1 $ENVVERSIONFILE)
                version=$(increment_version $version)
		echo $version > $ENVVERSIONFILE
		echo $version
}

create_info_file(){
	INFO_FILE="$DIR_DIST/$DIR_COMPRESSED/build-info.txt"
	rm -f $INFO_FILE;
	touch $INFO_FILE;
	echo ${1} >> $INFO_FILE;
	date >> $INFO_FILE;
	echo $USER >> $INFO_FILE;
	echo "" >> $INFO_FILE;
	echo "Branch Name : " >> $INFO_FILE;
	git rev-parse --abbrev-ref HEAD >> $INFO_FILE;
	echo "" >> $INFO_FILE;
	echo "Commit id : " >> $INFO_FILE;
	git rev-parse HEAD >> $INFO_FILE;
}

create_git_tag(){
	git tag -a ${1} -m "${1}"
        git push origin --tags
}
clean(){
        echo "cleaning $DIR_DIST ..."
	rm -rf $DIR_DIST
        echo "cleaning $DIR_COMPRESSED ..."
        rm -rf $DIR_COMPRESSED
}
minify(){
        clean;
        mkdir -p "$DIR_COMPRESSED"
        mkdir -p "$DIR_DIST/$DIR_COMPRESSED"
        _ENV=${1}
        echo "${1} : Compressing js and css..."
        if [ "$_ENV" == "local" ]; then
            echo "Compression for local build no version created."
        else
            #cvarsion=$(create_version $_ENV);
            create_info_file "$_ENV:$cvarsion";
            #create_git_tag "$_ENV.v$cvarsion";
        fi

        if [ "$_ENV" == "dev" ]; then
            ASSETS_URL="https://imgd.photogurus.com/assets/preview";
        elif [ "$_ENV" == "live" ]; then
            ASSETS_URL="https://imgl.photogurus.com/assets/preview";
        elif [ "$_ENV" == "UAT" ]; then
            ASSETS_URL="https://imgl.photogurus.com/assets/preview";
        else
            ASSETS_URL="../assets/compressed";
        fi
        #echo $ASSETS_URL;

	java -jar ../src/tools/yuicompressor-2.4.8.jar --type css -v -o $DIR_COMPRESSED/main.min.css assets/css/main.css --charset utf-8
        java -jar ../src/tools/yuicompressor-2.4.8.jar --type css -v -o $DIR_COMPRESSED/simple-sidebar.min.css assets/css/thirdparty/simple-sidebar.css --charset utf-8
        java -jar ../src/tools/yuicompressor-2.4.8.jar --type css -v -o $DIR_COMPRESSED/bootstrap.min.min.css assets/css/thirdparty/bootstrap.min.css --charset utf-8
        java -jar ../src/tools/yuicompressor-2.4.8.jar --type css -v -o $DIR_COMPRESSED/jquery.mCustomScrollbar.min.min.css assets/css/thirdparty/jquery.mCustomScrollbar.min.css --charset utf-8
        CSS="$DIR_COMPRESSED/bootstrap.min.min.css $DIR_COMPRESSED/simple-sidebar.min.css $DIR_COMPRESSED/main.min.css"
        cat $CSS > $DIR_DIST/$DIR_COMPRESSED/app.min.css
        rm $CSS;

        java -jar ../src/tools/yuicompressor-2.4.8.jar --type js -o $DIR_COMPRESSED/jquery-1.11.3.min.min.js assets/js/thirdparty/jquery-1.11.3.min.js --charset utf-8
        java -jar ../src/tools/yuicompressor-2.4.8.jar --type js -o $DIR_COMPRESSED/jquery.mCustomScrollbar.concat.min.min.js assets/js/thirdparty/jquery.mCustomScrollbar.concat.min.js --charset utf-8
        java -jar ../src/tools/yuicompressor-2.4.8.jar --type js -o $DIR_COMPRESSED/turn.min.min.js assets/js/thirdparty/turn.min.js --charset utf-8
        java -jar ../src/tools/yuicompressor-2.4.8.jar --type js -o $DIR_COMPRESSED/bootstrap.min.min.js assets/js/thirdparty/bootstrap.min.js --charset utf-8
        java -jar ../src/tools/yuicompressor-2.4.8.jar --type js -o $DIR_COMPRESSED/main.min.js assets/js/main.js --charset utf-8
        java -jar ../src/tools/yuicompressor-2.4.8.jar --type js -o $DIR_COMPRESSED/flipbookService.min.js assets/js/services/flipbookService.js --charset utf-8
        java -jar ../src/tools/yuicompressor-2.4.8.jar --type js -o $DIR_COMPRESSED/GlobalData.min.js assets/js/GlobalData.js --charset utf-8
        java -jar ../src/tools/yuicompressor-2.4.8.jar --type js -o $DIR_COMPRESSED/CookieUtils.min.js assets/js/utils/CookieUtils.js --charset utf-8
	JS="$DIR_COMPRESSED/jquery-1.11.3.min.min.js $DIR_COMPRESSED/turn.min.min.js $DIR_COMPRESSED/bootstrap.min.min.js $DIR_COMPRESSED/main.min.js $DIR_COMPRESSED/flipbookService.min.js $DIR_COMPRESSED/GlobalData.min.js $DIR_COMPRESSED/CookieUtils.min.js"
        cat $JS > $DIR_DIST/$DIR_COMPRESSED/app.min.js
        rm $JS;
        cp -r "assets/images" "$DIR_DIST/assets/"
        cp -r "assets/css/fonts" "$DIR_DIST/$DIR_COMPRESSED"
        cp -r "assets/js/utils/branchIO.js" "$DIR_DIST/$DIR_COMPRESSED"
        cp -r "config/" "$DIR_DIST/"
        cp "index.php" "$DIR_DIST/"
        cp "main.php" "$DIR_DIST/"
        cp "branch.php" "$DIR_DIST/"
        touch "$DIR_DIST/loadassets.php" 
        echo "<link href='$ASSETS_URL/css/app.min.css' rel='stylesheet'>" > "$DIR_DIST/loadassets.php"
        echo "<script src='$ASSETS_URL/js/app.min.js' type='text/javascript'></script>" >> "$DIR_DIST/loadassets.php"        
}

show_usage(){

echo "Usage: $0 [options]
clean			Clean deploy folder & compressed folder
minifylive 		Compress & make build for Live env
minifydev 		Compress & make build for DEV env
minifyUAT 		Compress & make build for DEV UAT
minifylocal             Compress & make build for local test
"
exit
}

if [ $# -lt 1 ]
then
        show_usage
fi

case "$1" in
clean)
	clean;
	;;

minifydev)
	minify "dev"
        ;;
minifylive)
	minify "live"
	;;
minifyUAT)
	minify "UAT"
	;;        
minifylocal)
	minify "local"
	;;

*) echo "Invalid option: $1"
show_usage
	;;

esac

exit

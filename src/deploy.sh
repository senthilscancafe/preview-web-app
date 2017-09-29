#!/bin/bash
DEV_SERVER_HOST="root@ec2-50-16-60-189.compute-1.amazonaws.com";
DEV_SERVER_PATH="/var/www/html/dev/photoguruswebsite";
CURRENT_TIMESTAMP="$(date +%s)";
DIR_COMPRESSED="assets/compressed";
CSS_CONFIG_FILE="css.config";
JS_CONFIG_FILE="js.config";
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
	INFO_FILE="assets/compressed/build-info.txt"
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

getFileName(){
	echo "${1}" | sed "s/.*\///"
}

clean(){
	echo "cleaning ../deploy ..."
	find assets/compressed -mindepth 1 -delete
	find ../deploy -mindepth 1 -delete
}
minifyCSS(){
	ALLCSS="";
	while IFS='' read -u 3 -r cssFile || [[ -n "$cssFile" ]]; do
		NAME=$(getFileName "$cssFile");
    		OUTFILE="$DIR_COMPRESSED/$NAME.min.css";
		ALLCSS="$ALLCSS$OUTFILE ";
		echo "Compressing file $cssFile --> $OUTFILE"
		java -jar tools/yuicompressor-2.4.8.jar --type css -o $OUTFILE $cssFile --charset utf-8
	done 3< "$CSS_CONFIG_FILE"
	#echo $ALLCSS;
	cat $ALLCSS > $DIR_COMPRESSED/app.min.css.tmp;
        sed "s/CTSTAMP/$CURRENT_TIMESTAMP/g" $DIR_COMPRESSED/app.min.css.tmp > $DIR_COMPRESSED/app.min.css;
	rm $ALLCSS;
        rm $DIR_COMPRESSED/app.min.css.tmp;
}

minifyThirdpartyJS(){
	ALLJS="";
	while IFS='' read -u 3 -r jsFile || [[ -n "$jsFile" ]]; do
		NAME=$(getFileName "$jsFile");
		if [ -f "${jsFile}" ]; then
			echo "$NAME";
			OUTFILE="$DIR_COMPRESSED/$NAME.min.js";
			ALLJS="$ALLJS$OUTFILE ";
			echo "Compressing file $jsFile --> $OUTFILE"
			java -jar tools/yuicompressor-2.4.8.jar --type js -o $OUTFILE $jsFile --charset utf-8
		fi
	done 3< "$JS_CONFIG_FILE"
	#echo $ALLJS;
	cat $ALLJS > $DIR_COMPRESSED/allthirdparty.min.js;
	rm $ALLJS;
}

minify(){
	clean
	mkdir -p assets/compressed
        _ENV=${1}
        echo "${1} : Compressing js and css..."
        if [ "$_ENV" == "local" ]; then
            echo "Compression for local build no version created."
        else
            cvarsion=$(create_version $_ENV);
            create_info_file "$_ENV:$cvarsion";
            create_git_tag "$_ENV.v$cvarsion";
        fi
	minifyCSS
	r.js -o compress-js-config.js;
        minifyThirdpartyJS
	echo "Copying to ../deploy"
	rsync -rv --cvs-exclude --exclude-from=deploy-exclude-config.txt ./ ../deploy
        
	mv ../deploy/index-deploy.html ../deploy/index-inc.html
        sed "s/CTSTAMP/$CURRENT_TIMESTAMP/g" ../deploy/index-inc.html > ../deploy/index-ver.html
        sed "s/CVERSIONNO/$cvarsion/g" ../deploy/index-ver.html > ../deploy/index-env.html
	sed s/LOADENVIRONMENTREPLACE/"$_ENV"/g ../deploy/index-env.html > ../deploy/index.html
        rm ../deploy/index-inc.html
        rm ../deploy/index-ver.html
	rm ../deploy/index-env.html
}

show_usage(){

echo "Usage: $0 [options]
js			For js error checking
clean			Clean deploy folder & compressed folder
minifylive 		Compress & make build for Live env
minifypgdemo 		Compress & make build for pgdemo env
minifyUAT 		Compress & make build for UAT env
minifydev 		Compress & make build for DEV env
minifylocal             Compress & make build for local test
deploydev <pemfile>	Upload build on DEV env"
  
exit
}

if [ $# -lt 1 ]
then
        show_usage
fi

case "$1" in
js)
        jshint --config jshint_config.json --exclude-path .jshintignore assets/
        ;;
clean)
	clean
	;;

minifydev)
	minify "dev"
        ;;
minifypgdemo)
	minify "pgdemo"
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
css)
	minifyCSS
	;;
tjs)
	minifyThirdpartyJS
	;;
deploydev)
	if [ -z "$2" ]
  	then
    		echo "Please provide pem file path."
	else
		if [ -f $2 ];
		then
		   echo "Uploading on dev server : $DEV_SERVER_HOST"
		   rsync -avze "ssh -i $2" ../deploy/* "$DEV_SERVER_HOST:$DEV_SERVER_PATH"
		else
		   echo "Pem file $2 does not exist."
		fi
	fi
	
	;;
*) echo "Invalid option: $1"
show_usage
	;;

esac

exit

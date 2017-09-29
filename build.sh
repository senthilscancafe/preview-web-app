#!/bin/bash

clean(){
	echo "cleaning deploy ..."
	find deploy -mindepth 1 -delete
}
build(){
    _ENV=${1}
    cd src;
    ./deploy.sh minify$_ENV;
    cd ..
    mkdir -p deploy/preview
    cd preview/
    ./deploy.sh minify$_ENV;
    cd dist/
    cp -r * ../../deploy/preview/
}
show_usage(){

echo "Usage: $0 [options]
clean			Clean deploy folder & compressed folder
buildlive 		Compress & make build for Live env
buildUAT 		Compress & make build for UAT env
builddev 		Compress & make build for DEV env
buildlocal      Compress & make build for local test
"
exit
}

if [ $# -lt 1 ]
then
        show_usage
fi

case "$1" in
clean)
	clean
	;;

builddev)
	build "dev"
    ;;
buildlive)
	build "live"
	;;
buildUAT)
	build "UAT"
    ;;
buildlocal)
	build "local"
    ;;
*)echo "Invalid option: $1"
    show_usage
	;;

esac

exit
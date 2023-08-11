# meant to be called from root of project due to relative paths

if [ "$1" == "prod" ]; then
    echo "writing production default values into the ui index.html..."
    
    cp front-ui/v1/index.template.html front-ui/v1/index.html

    sed -i 's/%%DEFAULT_SAMPLING_STEPS%%/20/g' front-ui/v1/index.html
    sed -i 's/%%DEFAULT_HEIGHT%%/512/g' front-ui/v1/index.html
    sed -i 's/%%DEFAULT_WIDTH%%/512/g' front-ui/v1/index.html

    
elif [ "$1" == "dev" ]; then
    echo "writing development default values into the ui index.html..."
    
    cp front-ui/v1/index.template.html front-ui/v1/index.html

    sed -i 's/%%DEFAULT_SAMPLING_STEPS%%/2/g' front-ui/v1/index.html
    sed -i 's/%%DEFAULT_HEIGHT%%/64/g' front-ui/v1/index.html
    sed -i 's/%%DEFAULT_WIDTH%%/64/g' front-ui/v1/index.html
    
else
    echo "Please specify an environment: dev or prod"
fi
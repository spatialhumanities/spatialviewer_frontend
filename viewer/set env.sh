#!/bin/bash

# set server-variable (given as parameter) according to given web-root. The protocoll is not configurable at this stage.
# script has to be executed in a directory with spatialstore.war, annotationserver.war and then viewer directory

# todo: sanity check für eingegebene servervariable


	nu_url_base=${1//\//\\/}
	# default value. has to be updated if script is run more than done time
	current_url_base='http://localhost'
	# addresses that will be called from outside localhost. to be inserted in code-level comments
	base_dir_tag='EXTERNAL_SERVER_ADDRESS'


	jar -xf /Users/felixlange/Desktop/tmp/jar/spatialstore.war WEB-INF/classes/
	sed -i  .tmpf "/${base_dir_tag}/ s,${current_url_base},${nu_url_base}," WEB-INF/classes/config.properties
	jar -uf /Users/felixlange/Desktop/tmp/jar/spatialstore.war WEB-INF/classes/
	rm -rf WEB-INF/

	genv_files=('geo2pundit_03.js' 'punditclient/pundit/build/src/Configuration.js' 'communicator.js')


	for i in "${genv_files[@]}" ; do
	sed -i  .tmpf "/${base_dir_tag}/ s,${current_url_base},${nu_url_base}," ${i}
	rm -f "${i}".tmpf
	echo ${i}
	done

	jar -xf annotationserver.war WEB-INF/web.xml
	sed -i  .tmpf "/${base_dir_tag}/ s,${current_url_base},${nu_url_base}," WEB-INF/web.xml
	jar -uf annotationserver.war WEB-INF/web.xml



	sed -i  .tmpf "/${base_dir_tag}/ s,${current_url_base},${nu_url_base}," $war_dir/ask/dojoConfig.js





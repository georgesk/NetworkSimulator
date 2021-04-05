JS_SOURCES = $(shell ls js/*.js js/i18n/*.js)
JS_UGLIFIED = dist/networksim.min.js
TEMPLATES = $(shell ls templates/*.html)

all: $(JS_UGLIFIED) html_files

html_files: html_files_stamp

html_files_stamp: $(TEMPLATES) make_html_files.py
	python3 make_html_files.py
	echo $$(date +%Y%m%d-%H.%M) > html_files_stamp

$(JS_UGLIFIED): $(JS_SOURCES) Gruntfile.js
	grunt

clean :
	find . -name "*~" | xargs rm -f
	rm -f html_files_stamp

.PHONY : all clean install html_files

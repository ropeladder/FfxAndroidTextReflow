VERSION=$(grep em:version "$SRC_DIR"/install.rdf | sed -e 's/<[^>]*>//g')
VERSION=${VERSION// /} # trim whitespace

all:
	./mkxpi.sh

## syntax check won't work as the extension uses nonstandard Ffx syntax 
## extension
#syntax:
#	./check-syntax.sh

commit: all
	git commit -a || true

push: commit
	git push rgh master


release: all commit
	git tag -a v$(VERSION)
	git push rgh master


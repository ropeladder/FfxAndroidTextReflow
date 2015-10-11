
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

add_xpi: all
	git add -f $(XPI)
	git commit $(XPI)

release: all add_xpi commit
	git tag -a v$(VERSION)
	git push rgh master


NAME=$(shell grep name package.json | sed 's/.*: "\(.*\)",/\1/' | head -n1)
VERSION=$(shell grep version package.json | sed 's/.*: "\(.*\)".*/\1/')
XPI=$(NAME)-$(VERSION).xpi


all:	syntax
	cfx --force-mobile --check-memory xpi
	mv $(NAME).xpi $(XPI)

syntax:
	./check-syntax.sh

tst:	syntax
	cfx run --binary-args="-url file:test/Chronobiology\ -\ Wikipedia\,\ the\ free\ encyclopedia.html"


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


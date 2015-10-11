#"/bin/sh

for f in `find -name *.js`; 
do 
    echo "$f"
    esvalidate.js "$f"
done


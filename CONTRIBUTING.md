# Commits 

## Scopes:

web - github pages related stuff
test - test related stuff 

## Files 

assets - for github pages assets 

## Extensions 

1. Add to extensions directory
2. update extensions.html 

## precommit 

The precommit additionally checks

1. buffee.js changed, then version should be updated
2. buffee.js and style.js versions are the same 
3. buffee.js and most recent version in devlog.txt is same.

```
✗ Error: Version mismatch between buffee.js and style.css
    buffee.js: 7.2.0-alpha.1
    style.css: 7.1.0
    Please update @version in style.css to match buffee.js
```

If devlog is out of sync:
```
  ✗ Error: Version mismatch between buffee.js and docs/devlog.txt
    buffee.js:     7.2.0-alpha.1
    devlog.txt:    7.1.0-alpha.1
    Please add a new entry to docs/devlog.txt for version 7.2.0-alpha.1
```
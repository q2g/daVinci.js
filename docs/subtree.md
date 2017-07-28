# Subtree in your Project

We use at the moment the daVinci Codebase as git subtree in our projects.
If you would do the same here the necessary commands:

Command                                                             | Description
--------------------------------------------------------------------|----------------------------------------
git remote add davinci https://github.com/q2g/daVinci.js            | adds remote named davinci for easier use
git subtree add --prefix=src/lib/daVinci.js davinci master          | checkout the master branch from davinci to the local path src/lib/daVinci.js/
git subtree pull --prefix=src/lib/daVinci.js --squash plugin master | pull the changes from the master branch

we don't accept direct push, but if you fork into your on project, the following command is important to you, to
get yout changes back to your fork, before you can make a pull request.

git remote add davinciFORK https://github.com/YOURFORK/daVinci.js
git subtree push --prefix=src/lib/daVinci.js davinciFORK master

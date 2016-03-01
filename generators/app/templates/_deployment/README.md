![The Monkeys](http://www.themonkeys.com.au/img/monkey_logo.png)

Deployment
===================



To push to stage
---------------------------------------------------

    git remote add stage <%= gitStaging %>
    git push stage +stage:refs/heads/stage


And then subsequent pushes to stage:

    git push stage


The stage site will be visible at:

	<%= stagingLink %>



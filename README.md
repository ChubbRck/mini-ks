## mini-ks

A mini version of kickstarter that runs on the command line -- 

### Getting started

* You may need to install Vorpal, a framework for building command line applications with Javascript. Do so by running `npm install vorpal`.
* Next, run `node mini-kickstarter.js`
* That's it! Type help for a list of commands.

**1.** The `project` command will create a new project with a project name
and a target dollar amount.

~~~
project <project> <target amount>
~~~

**2.** The `back` command will back a project with a given name of the
backer, the project to be backed, a credit card number and a backing
dollar amount.

~~~
back <given name> <project> <credit card number> <backing amount>
~~~

**3.** The `list` command will display a project including backers and
backed amounts.

~~~
list <project>
~~~

**4.** The `backer` command will display a list of projects that a backer
has backed and the amounts backed.

~~~
backer <given name>
~~~
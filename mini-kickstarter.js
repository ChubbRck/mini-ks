


const vorpal = require('vorpal')();

projects = [];
backers = [];

num = 5;


// Helper functions
function isAlphanumeric(string){
if( /[^a-zA-Z0-9]/.test( string ) ) {
       return false;
    } else {
    	return true;
    }
}

vorpal
    .delimiter('mini-kickstarter$')
    .show()

    vorpal
      .command('backer <givenName>', 'Lists the projects a backer has backed')
      .action(function(args, callback) {
      	
        
        callback();
      });

      vorpal
      .command('list <projectName>', 'Lists a project\'s backers and the status of a project.')
      .validate(function(args) {
      	// Iterate through all projects
      	for (i=0; i<projects.length; i++){
      		this.log(projects[i].name);
      		if (projects[i].name == args.projectName){
      			// Iterate through this project's backers array
      			for (j = 0; j < projects[i].backers.length; j++){
      				this.log(projects[i].backers[j]);
      			}

      			return true;
      		}
      	}

      	return "Sorry, no projects were found by that name!"
       
      }).action(function(args, callback){

      })

    vorpal
      .command('project <projectName> <targetAmount>', 'Creates a new mini-kickstarter project')
      .validate(function (args) {
      	// Ensure the project name is valid and has not already been taken
      	
      	if (!isAlphanumeric(args.projectName)){
      		return "That's not a valid name, fool!"
      	}
   		// Ensure the target amount is valid
   		if (isNaN(args.targetAmount)){
   			return "That's not a number, fool!";
   			
   		}

   		return true;
      })
      .action(function(args, callback) {
   		this.log(args.projectName);

   	

   		var newProject = {
   			'name' : args.projectName,
   			'targetAmount' : args.targetAmount.toFixed(2),
   			'backers' : []
   		}
   		projects.push(newProject);
   		this.log(projects)
        callback();
      });

      
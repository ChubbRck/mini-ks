


const vorpal = require('vorpal')();

projects = [];
backers = [];


// Helper functions
function isAlphanumeric(string){
  if( /[^a-zA-Z0-9]/.test(string)){
    return false;
  } else {
    return true;
  }
}

function findProject(projectName){
  for (i=0; i<projects.length; i++){
    if (projects[i].name == projectName){
      // If the project exists, as identified by name, return the project object.
      return projects[i];
    }
  }
  // Otherwise, return false.
  return false;
}

function findBacker(backerName){
  for (i=0; i<backers.length; i++){
    if (backers[i].name == backerName){
      // If the backer exists, as identified by name, return the backer object.
      return backers[i];
    }
  }
  // Otherwise, return false.
  return false;
}

// Define Vorpal Commands

vorpal.command('backer <givenName>', 'Lists the projects a backer has backed')
  .action(function(args, callback) {
    callback();
  });

vorpal.command('list <projectName>', 'Lists a project\'s backers and the status of a project.')
  .validate(function(args) {
    // Check if this project exists --
    var thisProject = findProject(args.projectName);
    if (thisProject){
      return true;
    } else {
      return "Sorry, no projects were found by that name!"
    }
  }).action(function(args, callback){
    var thisProject = findProject(args.projectName);
    // Iterate through this project's backers array and keep a tally of the total funds pledged to this project.
    var totalPledgedAmount = 0;
    var backers = thisProject.backers;
    for (j = 0; j < backers.length; j++){
      this.log("-- " + backers[j].name + " pledged $" + backers[j].backingAmount.toFixed(2) + "!");
      totalPledgedAmount += backers[j].backingAmount;
    }
    this.log("Total pledged: $" + totalPledgedAmount.toFixed(2));
    if (totalPledgedAmount >= thisProject.targetAmount){
      // Project was backed successfully!
      this.log(thisProject.name + " is successful!")
    } else {
      // The project still has a way to go...
      var amountRemaining = thisProject.targetAmount - totalPledgedAmount;
      this.log("I'm afraid that " + thisProject.name + " still needs $" + amountRemaining.toFixed(2) + " to be successful..." );
    }
    callback();
  })

vorpal.command('back <backerName> <projectName> <creditCardNumber> <backingAmount>', 'Backs a project with the specified backer name, credit card info, and backing amount.')
  .validate(function(args) {
    var thisProject = findProject(args.projectName);
    if (thisProject){
      return true;
    } else {
      return "Sorry, no projects were found by that name!"
    }     
  }).action(function(args, callback){
    var thisProject = findProject(args.projectName);
    // push this backer's information to the project's backer array.
    var thisBacker = { 'name' : args.backerName, 'backingAmount' : args.backingAmount};
    thisProject.backers.push(thisBacker);

    // additionally, log this activity in the backers array. First, find out if this backer already exists.
    var thisBacker = findBacker(args.backerName);
    if (thisBacker){
      // If this backer already exists, insert this project in his/her projectsBacked array;
      thisBacker.projectsBacked.push({'project' : args.projectName, 'amount': args.backingAmount})
    } else {
      // enter a new backer into the backer array;
      var backerObject = {'name' : args.backerName, 'projectsBacked' : { 'project' : args.projectName, 'amount' : args.backingAmount} };

    }
    callback();
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

vorpal
    .delimiter('mini-kickstarter$')
    .show()
      
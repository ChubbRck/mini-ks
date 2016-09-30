


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

function validateCreditCard(value){
     
  var totalSum = 0;
  var newDigit = 0; 
  var isEveryOtherDigit = false;
  // Eliminate any digits from the string, in case the user input dashes or spaces, etc.
  var valueAsString = String(value);
  valueAsString = valueAsString.replace(/\D/g, "");
  // Move leftwards from the final digit.
  for (var n = valueAsString.length - 1; n >= 0; n--) {

    var currentDigit = valueAsString.charAt(n),
    newDigit = parseInt(currentDigit, 10);
    // Only double every other digit...
    if (isEveryOtherDigit) {
      // If the doubled digit is greater than 9, subtract 9 from it (the equivalent of summing the digits of the products)
      if ((newDigit *= 2) > 9){ 
        newDigit -= 9;
      }
    }
    // Add this 'new digit' to the total
    totalSum += newDigit;
    // Keep track of whether the next digit is every other digit or not with a flag.
    isEveryOtherDigit = !isEveryOtherDigit;
  }
  // Return true if the sum of all digits modulo 10 is equal to 0.
  return (totalSum % 10) == 0;
}

// Define Vorpal Commands

vorpal.command('backer <givenName>', 'Lists the projects a backer has backed')
  .validate(function(args) {
    var thisBacker = findBacker(args.givenName);  
    if (thisBacker){
      return true;
    } else {
      return "Sorry, no backers were found by that name!"
    }
  }).action(function(args, callback){
    var thisBacker = findBacker(args.givenName); 
    // Iterate through the projects this backer has backed

    for (i = 0; i < thisBacker.projectsBacked.length; i++){
      this.log("-- backed " + thisBacker.projectsBacked[i].project + " for $" + thisBacker.projectsBacked[i].amount.toFixed(2));
    }
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
      // The project exists, but is the credit card number valid?
      // Reject the number outright unless it is completely numeric
      this.log(typeof(args.creditCardNumber));
      this.log(typeof(args.creditCardNumber.toString()));
      this.log(args.creditCardNumber.toString().length)
      if (/[^0-9]/.test(args.creditCardNumber)){
        return "Please enter a valid Credit Card number (only numbers, no dashes or spaces allowed).";
        // Reject the number if it is over 19 digits long.
      } else if (args.creditCardNumber.toString().length > 19){
        return "Please enter a valid Credit Card number (max 19 digits).";
        // Test the number against the Lunh-10 algorithm.
      } else if (!validateCreditCard(args.creditCardNumber)){
        return "Please enter a valid Credit Card number."
        // Check if the credit card number already exists in this project.
      } else {
        // Iterate through this projects backers and check that this credit card hasn't been used already.
        for (var i = 0; i<thisProject.backers.length; i++){
          var thisBacker = thisProject.backers[i];
          if (thisBacker.creditCardNumber == args.creditCardNumber){
            return "Sorry, this Credit Card has already been used to back this project.";
          } 
        }
        // If the Credit Card number passes these tests, proceed to back the project!
        return true;
      }
    } else {
      return "Sorry, no projects were found by that name!"
    }     
  }).action(function(args, callback){
    var thisProject = findProject(args.projectName);
    // push this backer's information to the project's backer array.
    var thisBacker = { 'name' : args.backerName, 'backingAmount' : args.backingAmount, 'creditCardNumber' : args.creditCardNumber};
    thisProject.backers.push(thisBacker);

    // additionally, log this activity in the backers array. First, find out if this backer already exists.
    var thisBacker = findBacker(args.backerName);
    if (thisBacker){
      // If this backer already exists, insert this project in his/her projectsBacked array;
      thisBacker.projectsBacked.push({'project' : args.projectName, 'amount': args.backingAmount})
    } else {
      // enter a new backer into the backer array;
      var backerObject = {'name' : args.backerName, 'projectsBacked' : [{ 'project' : args.projectName, 'amount' : args.backingAmount}] };
      backers.push(backerObject);
    }
    this.log ("Project succesfully backed!")
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
      
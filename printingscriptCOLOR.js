//DPEA IT COLOR PRINTING SCRIPT
//WRITTEN BY MATTHEW BERG 2016
function getMinutesSinceMidnight(hours, minutes) {
  return 60 * hours + minutes;
}

function printJobHook(inputs, actions) {
  var STUDENTS_GROUP = 'OU:dpea.org/DPEA-Students';
  var PROGRAMMERS_GROUP = 'OU:dpea.org/Programmers2017';
  var STAFF_GROUP = 'OU:dpea.org/Teachers';
  var MENTORS_GROUP = 'OU:dpea.org/Mentors';
  
  if (inputs.user.isInGroup(STUDENTS_GROUP) || inputs.user.isInGroup(PROGRAMMERS_GROUP)){
    //First Script--Watermark student job//
    actions.job.setWatermark('Printed by %user% at %date%');
   
    //Second Script--Stop students from printing during homeroom
    var WEDNESDAY = 3; // 0 = Sunday, 1 = Monday, etc

    var START_OF_HOMEROOM = getMinutesSinceMidnight(8, 50); //8:55am
    var END_OF_HOMEROOM = getMinutesSinceMidnight(9, 15); //9:15am
    
    // Check to see if job is printed during the peak periods.
    var day = inputs.job.date.getDay();
    var hour = inputs.job.date.getHours();
    var minutes = inputs.job.date.getMinutes();
    var timeOfJob = getMinutesSinceMidnight(hours, minutes);

    var homeroomDay = (WEDNESDAY == day);
    var homeroomTime = ((timeOfJob >= START_OF_HOMEROOM && timeOfJob <= END_OF_HOMEROOM));
    
    if (homeroomDay && homeroomTime) {
          // Cancels Job
          actions.job.cancel();
          //Send Message to Client Software
          actions.client.sendMessage(
            "You job was printing during a restricted period (Wednesday Mornings) "
            + " your job has been canceled. "  
            + "The job has been sent for secondary review.");
        }
    //Third Script--Block Grayscale Jobs from being sent to color printer
    if (!inputs.job.isAnalysisComplete) {
      // No job details yet so return.
      return;
    }
    ///Warns user if that their grayscale job has been rejected from the color printer///
    if (!inputs.job.isColor){
      var deniedColorPrintMessage = "This print job has been denied." 
          + " Grayscale jobs are not permitted to this printer.";
    }
    //Sends denial message 
    actions.client.sendMessage(deniedColorPrintMessage);

    if (inputs.job.isColor) {
      /* Color job, ask the use if they want to print. The job cost is displayed
      * prominently to encourage users to consider black and white printing instead.
      */
      var response = actions.client.promptPrintCancel(
        "<html>This print job is <span style='color:red'><b>color</b></span>"
        + " and costs <b>" + inputs.utils.formatCost(inputs.job.cost)
        + "</b>.  You can save money by printing the job in grayscale.<br><br>" 
        + "Do you want to print this job?</html>",
        {"dialogTitle" : "Color print job", 
         "dialogDesc"  : "Consider printing in grayscale to reduce costs"});
      if (response == "CANCEL" || response == "TIMEOUT") {
        // User did not respond, cancel the job and exit script.
        actions.job.cancel();
        return;
      }
  }
  
  if (inputs.user.isInGroup(STAFF_GROUP) || inputs.user.isInGroup(MENTORS_GROUP)) {
    //Teachers are exempt from printing restriction scripts
    actions.job.setWatermark('');
    }
  }
}

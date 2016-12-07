//DPEA IT GRAYSCALE PRINTING SCRIPT
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
    //Third Script--Check high volume print jobs
    var LIMIT = 10;  // Show message for jobs over 10 pages.
    if (!inputs.job.isAnalysisComplete) {
    // No job details yet so return.
    return;
    }
  
    if (inputs.job.totalPages > LIMIT) {
    /*
    * Job is larger than our page limit, so ask the user to confirm via
    * red warning message so we grab their attention.
    */
    var message = "<html><span style='font-size: 1.5em; color:red'>"
        + "This print job is over " + LIMIT + " pages. Please confirm the job."
        + "</span></html>";
    var response = actions.client.promptPrintCancel(message);
    if (response  == "CANCEL" || response  == "TIMEOUT") {
      // Cancel the job and exit the script.
      actions.job.cancel();
      return;
      }
    // Student pressed OK, so allow the job to print - simply return taking no action.
    }
 }
  
  if (inputs.user.isInGroup(STAFF_GROUP) || inputs.user.isInGroup(MENTORS_GROUP)) {
    //Teachers are exempt from printing restriction scripts
    actions.job.setWatermark('');
  }
}


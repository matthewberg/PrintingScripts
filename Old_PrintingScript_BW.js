function getMinutesSinceMidnight(hours, minutes) {
  return 60 * hours + minutes;
}

function printJobHook(inputs, actions) {
  
  var STUDENTS_GROUP = 'OU:dpea.org/DPEA-Students';
  var PROGRAMMERS_GROUP = 'OU:dpea.org/Programmers2017';
  var STAFF_GROUP = 'OU:dpea.org/Teachers';
  var MENTORS_GROUP = 'OU:dpea.org/Mentors';
  
  var startOfHomeRoom = getMinutesSinceMidnight(7, 50);
  var endOfHomeRoom = getMinutesSinceMidnight(9, 0);
  var dayOfHomeRoom = 5; // 0 = Sunday, 1 = Monday, etc
  
  if (inputs.user.isInGroup(STUDENTS_GROUP) || inputs.user.isInGroup(PROGRAMMERS_GROUP)) {
    // Set the watermark for Students and programmers
    actions.job.setWatermark('Printed by %user% at %date%');
    
    //Set homeroom restriction
    var day = inputs.job.date.getDay();
    var hour = inputs.job.date.getHours();
    var minutes = inputs.job.date.getMinutes();
    var timeOfJob = getMinutesSinceMidnight(hour, minutes);
    
    var homeRoomDay = (dayOfHomeRoom == day);
    var homeRoomTime = ((timeOfJob >= startOfHomeRoom && timeOfJob <= endOfHomeRoom));
    
    if (homeRoomDay && homeRoomTime) {
      actions.job.cancel();
      actions.client.sendMessage(
        "You job was printing during a restricted period (Friday Mornings) " 
        + " your job has been canceled. " 
        + "The job has been sent for secondary review.");
      return;
    }
  }
  
  // Clear the watermark for any Staff or Mentor user
  if (inputs.user.isInGroup(STAFF_GROUP) || inputs.user.isInGroup(MENTORS_GROUP)) {
    actions.job.setWatermark('');
  }
  
  // Get the analysis check done nice and early
  if (!inputs.job.isAnalysisComplete) { return; }
  
  
  // we don't need to anything for the PRINT response
} // End student restriction
// Put more actions here if needed



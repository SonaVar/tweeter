//if the user has entered a value into the textbox:
  //the counter dynamically counts down from 140 for each character being entered
  //the counter counts into negative when text length exceeds 140 characters
  //the counter turns red when text length exceeds 140 characters
$(document).ready(function () {
  $('textarea').on('input', function(event) {
    let l = 140 - this.value.length;
    if (l < 0) {
      $('.counter').css('color', 'red');
    }
    this.form.counter.value = l;
  })
})
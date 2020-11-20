/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


//the below script is run once page is rendered
$(document).ready(() => {
  
  //when the user clicks the compose button on the navigation bar, the compose tweet section comes into view
  $('#nav-div').on('click', () => {
    $('#form-div').show();
  })

  //the tweets stored in the database is loaded onto the page via a GET request
  const loadTweets = function () {
    $.ajax({
      url: "/tweets", 
      method: 'GET'})
    .then(res => {
      let tweetData = res;
      renderTweets(tweetData);
    });
  }
  loadTweets();

  //validator function validates the following:
    //1. if input is empty
    //2. if input is a space
    //3. if input is null
    //4. if input length is > 140 characters
  //if input is valid, nothing is returned
  //if input is invalid, corresponding error messages are returned
  const validator = function (tweetText) {
    if(tweetText === '') {
      return 'There is no input. Watcha thinkin\'?';
    } else if(tweetText === ' ') {
      return 'Spaces not allowed. Sorry mate!';
    } else if(tweetText === null) {
      return 'Invalid input. Try again.';
    } else if(tweetText.length > 140) {
      return 'Tweet is too long. Please respect our arbitrary limit of 140 chars!';
    }
  };

  //script runs on "TWEET" button click. Once tweet is submitted the below actions take place:
    //1. counter is reset to 140
    //2. input is checked for errors by calling the 'validator' function
    //3. if error occurs, error box slides down
    //4. if error is mitigated, error box slided up
    //5. a request is sent to add the tweet to the page
  $('form').on('submit', event => {
    event.preventDefault();
    $('.counter').val(140);
    const bool = validator($('#tweet-text').val());
    if(!bool) {
      $('.error').slideUp();
      $.ajax({
        url: "/tweets/",
        method: "POST",
        data: $('form').serialize()
      }).then(() => {
        $('#tweet-text').val('');
        $('#counter').val(140)
        loadTweets();
      })
    } else {
      $('.error').text(bool)
      $('.error').slideDown();

      return;
    }
  });
});

//function handles cross-site scripting
const escape =  function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

//function creates a new article and loads the data into each html element
const createTweetElement = function (data) {
  const tweet = $(
    `<article class="tweet">
      <div id="header">
        <div>
          <img src=${data.user.avatars}>
          <p>${data.user.name}</p>
        </div>
        <label for="media-handle">
          <p>${data.user.handle}</p>
        </label>
      </div>
      <p>${escape(data.content.text)}</p>
      <footer>
        <p>${data.created_at}</p>
        <div>
          <i class="gg-flag"></i>
          <i class="fa fa-retweet"></i>
          <i class="fa fa-heart"></i>
        </div>
      </footer>
    </article>
    <br>`
  );
    
  return tweet;
};

//function prepends the newly created article to the existing articles on the page
const renderTweets = function (data) {
  for (let element of data) {
    const $tweet = createTweetElement(element);
    $('#container-for-new-tweets').prepend($tweet); 
  }
};
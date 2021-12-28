"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

// This is an error message alert used if there is a failure to add a new story.
const newStoryFailure = "Failure to add a new story."

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  // if a user is logged in, show favorite/not-favorite checkbox
  const showCheckbox = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
        ${showCheckbox ? getCheckboxHTML(story, currentUser) : ""} 
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Display a checkbox. If story instance ia a favorite of the given user, check the checkbox. */

function getCheckboxHTML(story, user) {
  const isFavorite = user.isFavorite(story);
  if (isFavorite) {
    return `
      <span>
        <input type="checkbox" id="fav-story" checked>
      </span>`;
  }
  return `
    <span>
      <input type="checkbox" id="fav-story">
    </span>`;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Gets list of favorite stories from the instance of the current user,
 * generates their HTML, and puts on page. */

function putFavoriteStoriesOnPage() {
  console.debug("putFavoriteStoriesOnPage");

  $favoriteStoriesList.empty();

  if (currentUser.favorites.length === 0) {
    $favoriteStoriesList.append("<h5>No favorites added!</h5>")
  } else {
    // loop through all of our favorite stories and generate HTML for them
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoriteStoriesList.append($story);
    }
  }

  $favoriteStoriesList.show();
}

/** Handle submitting new story form. */

async function submitNewStory(evt) {
  console.debug("submitNewStory");
  evt.preventDefault();

  const author = $("#create-author").val();
  const title = $("#create-title").val();
  const url = $("#create-url").val();
  const username = currentUser.username;
  const storyData = { title, author, url, username };

  const newStory = await storyList.addStory(currentUser, storyData);

  const $newStory = generateStoryMarkup(newStory);
  $allStoriesList.prepend($newStory);

  // hide the form and reset it
  $submitForm.hide();
  $submitForm.trigger("reset");
}

$submitForm.on("submit", submitNewStory);

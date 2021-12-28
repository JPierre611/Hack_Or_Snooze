"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories");
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick");
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** Show submit form on click on "submit" */

function navSubmitStoryClick(evt) {
  console.debug("navSubmitStoryClick");
  hidePageComponents();
  $allStoriesList.show();
  $submitForm.show();
}

$navSubmitStory.on("click", navSubmitStoryClick);

/** Show list of favorite stories on click on "favorites" */

function navFavoritesClick() {
  console.debug("navFavoritesClick");
  hidePageComponents();
  putFavoriteStoriesOnPage();
}

$navFavorites.on ("click", navFavoritesClick);

/** Toggle favorite status of stories when click on story checkbox from allStoriesList. */

function toggleFavoriteStatus(evt) {
  console.debug("toggleFavoriteStatus");
  const story = storyList.stories.find(s => s.storyId === evt.target.parentElement.parentElement.id);
  if (story) {
    if (evt.target.checked) {
      currentUser.addFavorite(story);
    } else {
      currentUser.removeFavorite(story);
    }
  }
}

$allStoriesList.on("click", "input", toggleFavoriteStatus);

/** Turn off favorite status of stories when click on story checkbox from favoriteStoriesList and 
 *  remove story from favoriteStoriesList. */

function turnOffFavoriteStatus(evt) {
  console.debug("turnOffFavoriteStatus");
  const story = currentUser.favorites.find(s => s.storyId === evt.target.parentElement.parentElement.id);
  if (story) {
    if (!evt.target.checked) {
      currentUser.removeFavorite(story);
    }
  }
  $favoriteStoriesList.hide();
  putFavoriteStoriesOnPage();
}

$favoriteStoriesList.on("click", "input", turnOffFavoriteStatus);

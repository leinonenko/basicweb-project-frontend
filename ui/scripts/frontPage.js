'use strict';
console.log('front page');
const url = 'http://localhost:3000';

// Function to fetch data for users
const getUserInfo = async (id) => {
    const response = await fetch(url + '/user/' + id);
    const user = await response.json();
    return user;
};

// Function to fetch data for posts
const getPostInfo = async () => {
    try {
        const response = await fetch(url + '/post');
        const post = await response.json();
        createPosts(post);
    } catch (e) {
        console.log(e.message);
    }
};
getPostInfo();

const feed = document.querySelector('#postFeed');
const nickname = document.querySelector('#nickname');
const profileImg = document.querySelector('.profileImg');
//profileImg.innerHTML = getUserInfo().user.image;  // image not implemented yet

// Function for creating post containers
const createPosts = (posts) => {
    // clear ul
    feed.innerHTML = '';
    // Creating HTML elements
    posts.forEach((post) => {
        const userPost = document.createElement('li');

        const buildText = document.createElement('p');
        buildText.innerHTML = `${post.description}`;

        //if not null do the layout like this
      if (post.filename != null) {
        const postImg = document.createElement('img');
        postImg.src = url + '/' + post.filename;  // will be changes to filename
        postImg.alt = "404 image not found";
        userPost.appendChild(postImg);
      }
        const userImg = document.createElement('img');
        //const postNickname = document.createElement('h5');
        const postTitle = document.createElement('h3');
        postTitle.innerHTML = `${post.title}`;
        // Poster nickname
        const poster = document.createElement('h1');
        poster.innerHTML = `Poster: ${post.postername}`;
        // Poster profile picture
        const posterPfp = document.createElement('img');
        posterPfp.src = url + '/' + post.profile_picture;
      console.log(post.profile_picture);

        // Placing the hierarchy in the post object
        feed.appendChild(userPost);
        userPost.appendChild(posterPfp);
        userPost.appendChild(poster);
        userPost.appendChild(userImg);
        userPost.appendChild(postTitle);
        userPost.appendChild(buildText);
    });
};

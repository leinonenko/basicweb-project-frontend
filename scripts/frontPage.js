'use strict';
const url = 'https://localhost:8000';
const feed = document.querySelector('#postFeed');
const nickname = document.querySelector('#nickname');
const profileImg = document.querySelector('.profileImg');
const name = document.querySelector('#name');
//profileImg.innerHTML = getUserInfo().user.image;  // image not implemented yet
const user = JSON.parse(sessionStorage.getItem('user'));

// Function to fetch data for users
const getUserInfo = async () => {
    try {
        const fetchOptions = {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
            },
        };
        const res = await fetch(url + '/user/' + user.user_id, fetchOptions);
        const users = await res.json();
        console.log('user', users);
        name.innerHTML = users.username;
    } catch (e) {
        console.log(e.message);
    }
};
getUserInfo();

// Function for creating post containers
const createPosts = (posts) => {
    // clear ul
    feed.innerHTML = '';
    // Creating HTML elements
    posts.forEach((post) => {
        // Get logged in user and send a get request for vote info
        const user = JSON.parse(sessionStorage.getItem('user'));
        const userPost = document.createElement('li');

        // Poster nickname
        const poster = document.createElement('h1');
        poster.innerHTML = `${post.postername}`;

        // Poster profile picture
        const posterPfp = document.createElement('img');
        // if poster null but default
        // posterPfp.src = url + '/' + post.profile_picture;
        //getting the default profile pic if not yet set
        posterPfp.src =
            'placeholder/male-default-placeholder-avatar-profile-260nw-582509551.jpg';
        posterPfp.width = '45';
        posterPfp.height = '45';
        //for the upper piece of the postcard
        const posterDiv = document.createElement('div');
        posterDiv.className = 'posterDiv';

        //for the dropdown button setting it up

        //setting the division
        const dropdown = document.createElement('div');

        //setting div class name
        dropdown.className = 'dropdownImg';

        //creating element img
        const verticalMenu = document.createElement('img');
        //setting up size,img and class name
        verticalMenu.src = 'placeholder/icons8-menu-vertical-48.png';
        verticalMenu.width = '20';
        verticalMenu.height = '25';
        verticalMenu.className = 'dropImgBtn';
        //when the vertical button press it will show the dropdown content
        verticalMenu.addEventListener('click', () => {
            dropdownContent.classList.toggle('show');
        });
        //for the content inside of dropdown

        //setting up div
        const dropdownContent = document.createElement('div');

        //setting div class name
        dropdownContent.className = 'dropdown-content-verticalmenu';

        //setting the word delete and report
        const deleteButton = document.createElement('p');
        const reportButton = document.createElement('p');

        reportButton.innerHTML = 'Report';
        dropdownContent.appendChild(reportButton);

        // Check if user is a moderator if not append delete button to drop list only for
        // logged in user's post
        if (user.role === 0) {
            deleteButton.innerHTML = 'Delete';
            dropdownContent.appendChild(deleteButton);
        } else if (user.user_id === post.poster) {
            deleteButton.innerHTML = 'Delete';
            dropdownContent.appendChild(deleteButton);
        }
        //delete the post when you click the delete button
        deleteButton.addEventListener('click', async () => {
            console.log('delete');
            const fetchOptions = {
                method: 'DELETE',
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                },
            };
            try {
                const response = await fetch(
                    url + '/post/' + post.post_id,
                    fetchOptions
                );
                const json = await response.json();
                console.log('delete response', json);
                getPost();
            } catch (e) {
                console.log(e.message);
            }
        });

        //this appends to dropdown div
        dropdown.appendChild(verticalMenu);
        dropdown.appendChild(dropdownContent);
        //this appends to userpost list
        userPost.appendChild(posterDiv);
        //this appends to posterdiv div
        posterDiv.appendChild(posterPfp);
        posterDiv.appendChild(poster);
        posterDiv.appendChild(dropdown);

        //set the description
        const buildText = document.createElement('p');
        buildText.innerHTML = `${post.description}`;

        //if not null do the layout like this
        if (post.filename != null) {
            let postImg;
            //if image on se pistää create element
            if (
                post.file_type === 'image/png' ||
                post.file_type === 'image/jpg' ||
                post.file_type === 'image/webp' ||
                post.file_type === 'image/jpeg'
            ) {
                //create img elements
                postImg = document.createElement('img');
                //source where to get it
                postImg.src = url + '/thumbnails/' + post.filename; // will be changes to filename
                postImg.style.width = '100%';
                //if no img alternative
                postImg.alt = '404 image not found';
                //append postIMG
                userPost.appendChild(postImg);
            } else if (post.file_type === 'video/mp4') {
                //create video element
                postImg = document.createElement('video');
                //set so can control
                postImg.controls = true;
                //source where to get video
                postImg.src = url + '/' + post.filename;
                //postImg.src = url + '/thumbnails/' + post.filename+'/'+post.filename+'-thumbnail-200x200-0010.png';  // will be changes to filename
                postImg.style.width = '100%';
                //if no img alternative
                postImg.alt = '404 image not found';
                //append postIMG
                userPost.appendChild(postImg);
            }
        }
        //const postNickname = document.createElement('h5');
        const postTitle = document.createElement('h3');
        postTitle.innerHTML = `${post.title}`;

        // Upvote button
        const upVote = document.createElement('button');
        upVote.innerHTML = 'Upvote';
        // Downvote button
        const downVote = document.createElement('button');
        downVote.innerHTML = 'Dowvote';
        // Total votes button
        const votes = document.createElement('p');
        votes.innerHTML = `${post.votes}`;

        // Get date from db and format it
        const date = new Date(post.date);
        // Format date
        const formattedDate =
            date.getDate() +
            '-' +
            (date.getMonth() + 1) +
            '-' +
            date.getFullYear() +
            ' ' +
            date.getHours() +
            ':' +
            date.getMinutes();
        // Create element for the date
        const dateText = document.createElement('p');
        dateText.innerHTML = 'Uploaded: ' + formattedDate;

        // Placing the hierarchy in the post object
        feed.appendChild(userPost);
        userPost.appendChild(postTitle);
        userPost.appendChild(buildText);
        userPost.appendChild(upVote);
        userPost.appendChild(downVote);
        userPost.appendChild(votes);
        userPost.appendChild(dateText);

        // Default request method is POST
        let reqMethod = 'POST';
        let voteInfo = 0;

        // Get vote info
        const getVote = async () => {
            const fetchOptions = {
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                    'Content-Type': 'application/json',
                },
            };

            const res = await fetch(
                url + '/vote/' + user.user_id + '/' + post.post_id,
                fetchOptions
            );
            const vote = await res.json();
            console.log('vote:', vote.vote_count);

            if (vote.vote_count == 1 || vote.vote_count == 0) {
                reqMethod = 'PUT';
                console.log('Change req method', reqMethod);
            }

            voteInfo = vote;
            console.log('variable test:', vote.vote_count);
        };
        getVote();

        // Send a request for upvoting
        upVote.addEventListener('click', async () => {
            const data = { user_id: user.user_id, vote_count: 1 };
            console.log('upvoted post with id', post.post_id);
            console.log('variable test upvote:', voteInfo.vote_count);

            // If vote already exist, delete it
            if (voteInfo.vote_count == 1) reqMethod = 'DELETE';
            // Send the req body to reqFunction
            reqFunction(data);
        });

        // Send a request for downvoting
        downVote.addEventListener('click', async () => {
            const data = { user_id: user.user_id, vote_count: 0 };
            console.log('downvoted post with id', post.post_id);

            // If vote already exist, delete it
            if (voteInfo.vote_count == 0) reqMethod = 'DELETE';
            reqFunction(data);
        });
        // Request function
        const reqFunction = async (data) => {
            const fetchOptions = {
                method: reqMethod,
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            };
            console.log('req method:', reqMethod);

            try {
                const res = await fetch(
                    url + '/vote/' + post.post_id,
                    fetchOptions
                );
                const vote = await res.json();
                console.log(vote);
            } catch (e) {
                console.error('error', e.message);
            }
            getPost();
        };
    });
};

// Close the dropdown if the user clicks outside of it
feed.onclick = function (ev) {
    if (!ev.target.matches('.dropImgBtn')) {
        const dropdowns = document.getElementsByClassName(
            'dropdown-content-verticalmenu'
        );
        for (let i = 0; i < dropdowns.length; i++) {
            let openDrown = dropdowns[i];
            if (openDrown.classList.contains('show')) {
                openDrown.classList.remove('show');
            }
        }
    }
};

const getPost = async () => {
    try {
        const fetchOptions = {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
            },
        };
        const res = await fetch(url + '/post', fetchOptions);
        const posts = await res.json();
        createPosts(posts);
    } catch (e) {
        console.log(e.message);
    }
};
getPost();

// Get search button element
const search = document.getElementById('go');

// Event listener for search button, get input value, if the value is empty do nothing
// else end the word/letter to searchPosts function
search.addEventListener('click', (evt) => {
    evt.preventDefault();
    const word = document.getElementById('key-word').value;
    if (word == '') {
        return;
    }
    searchPosts(word);
});

// Send GET request with the word/letter as a parameter. catch any errors
const searchPosts = async (word) => {
    try {
        const fetchOptions = {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
            },
        };
        const res = await fetch(url + '/post/search/' + word, fetchOptions);
        const posts = await res.json();
        createPosts(posts);
    } catch (e) {
        console.log(e.message);
    }
};

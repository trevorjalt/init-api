# [Init](https://init-blush.vercel.app/) API

`Init` is a social media app that helps developers connect over their work.

This is a repository for the `Init API`.

You can view the live project [here](https://init-blush.vercel.app/)

You can view the `Init Client` repository [here](https://github.com/trevorjalt/init-client)

`Init` was created by [Adyceum Magna Ccarri](https://github.com/i-MCcarri), [Rachel Reilly](https://github.com/Rachanastasia), [Steven Henderson](https://github.com/Hendoe), and [Trevor J Alt](https://github.com/trevorjalt)

## Tech Stack

. Node.js with Express
. PostgreSQL with Knex.js
. Mocha, Chai, SuperTest
. JWT Authentication

## API Endpoints

### /api/auth

### /api/avatar

### /api/user

### /api/follow

#### GET /api/follow

Get all users that are following the logged in user and all of the users which the logged in user is following.

#### POST /api/follow

Adds follower to current user's followers

#### DELETE /api/follow

Removes follower from current user's followers

### /api/post

### /api/comment

#### GET /api/comment/:post_id

Get all comments for a specific post by id.

#### POST /api/comment/:post_id

Add a comment to the post with the specific id. This returns an array of all comments for the post.

## Set up

Complete the following steps to start a new project (NEW-PROJECT-NAME):

1. Clone this repository to your local machine `git clone BOILERPLATE-URL NEW-PROJECTS-NAME`
2. `cd` into the cloned repository
3. Make a fresh start of the git history for this project with `rm -rf .git && git init`
4. Install the node dependencies `npm install`
5. Move the example Environment file to `.env` that will be ignored by git and read by the express server `mv example.env .env`
6. Edit the contents of the `package.json` to use NEW-PROJECT-NAME instead of `"name": "express-boilerplate",`

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

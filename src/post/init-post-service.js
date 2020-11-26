const InitPostService = {
    // getAllPosts(knex) {
    //     return knex.select('*').from('init_posts')
    // },

    getUserPosts(db, id) {
      return db
          .from('init_posts AS project')
          .select('*')
          .where('project.user_id', id)
          .orderBy('project.date_created', 'desc')
    },

    insertPost(db, uploadData) {
        return db
            .insert(uploadData)
            .into('init_posts')
            .returning('*')
            .then(([data]) => data)
  },

    async getPostById(db, post_id) {

      try {
        return await db
          .select('*')
          .from('init_posts')
          .where({ id: post_id })
          .then(async p => {
            const [post] = p
            try {
              const user = await db
                .select('*')
                .from('user_information')
                .where({ id: post.user_id })

              return {
                ...user,
                ...post
              }
            }
            catch (error) {
              return console.log(error)
            }


          })

      }
      catch (error) {
        return console.log(error)
      }

    },
};

module.exports = InitPostService;
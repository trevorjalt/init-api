const InitPostService = {
  getAllPosts(knex) {
    return knex.select('*').from('init_posts')
  },

  async getPostById(db, post_id) {
    const post = await db
      .select('*')
      .from('init_posts')
      .where({ id: post_id })


    const user = await db
      .select('username', 'fullname')
      .from('user_information')
      .where({ id: post.user_id })


    return {
      ...user,
      ...post
    }
  }
};

module.exports = InitPostService;
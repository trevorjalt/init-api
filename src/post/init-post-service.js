const InitPostService = {
    getAllPosts(knex) {
      return knex.select('*').from('init_posts')
    },
  };
  
  module.exports = InitPostService;
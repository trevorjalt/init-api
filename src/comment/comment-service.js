const AvatarService = require(AvatarService);

const CommentService = {
    async getCommentsForPost(db, post_id) {
        const comments = await db
            .from('init_comments')
            .select('id', 'text', 'user_id', 'date_created')
            .where({ post_id })

        return comments.map(c => {

            const username = await db
                .select('username')
                .from('user_information')
                .where({ id: c.user_id })

            const [avatar] = AvatarService.getAvatar(db, c.user_id)

            return {
                ...c,
                username,
                avatar
            }
        })
    },
    insertComment(db, user_id, post_id, text) {
        return db
            .insert({ post_id, user_id, text })
            .into('init_comments')
            .catch(err => console.log(err))
    }






}


module.exports(CommentService)
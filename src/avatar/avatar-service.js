const avatarRouter = require("./avatar-router")

const AvatarService = {
    getAvatar(db, id) {
        return db
            .from('user_avatar AS avatar')
            .select('*')
            .where('avatar.user_id', id)
    },

    insertAvatar(db, uploadData) {
        return db
            .insert(uploadData)
            .into('user_avatar')
            .returning('*')
            .then(([data]) => data)
    },
}

module.exports = AvatarService
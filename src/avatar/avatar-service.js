const AvatarService = {
    getAvatar(db) {
        return db
            .from('user_avatar')
            .select('*')
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
// const xss = require('xss')

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

    getById(db, id) {
        return db
            .from('user_avatar AS avatar')
            .select('*')
            .where('avatar.id', id)
            // .first()
    },

    updateAvatar(db, id, newAvatarFields) {
        return db
            .from('user_avatar')
            .where({ id })
            .update(newAvatarFields)
    }

    // serializeAvatar(avatar) {
    //     return {
    //         id: avatar.id,
    //         name: xss(avatar.name),
    //         date: avatar.date,
    //         img_type: avatar.img_type,
    //         img_file: avatar.img_file,
    //         user_id: avatar.user_id,
    //     }
    // }
}

module.exports = AvatarService
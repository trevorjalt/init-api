const AvatarService = require('../avatar/avatar-service');

const FollowService = {

    async getAllFollows(db, user_id) {
        try {
            const follows = await db
                .select('users_id')
                .from('following')
                .where({ following_id: user_id })

            const followsData = await Promise.all(
                follows.map(async f => {
                    try {
                        const { users_id } = f
                        let [followData] = await db
                            .select('fullname', 'username', 'id')
                            .from('user_information')
                            .where({ id: users_id })
                        return followData
                    }
                    catch {
                        return err => console.log(err);
                    }
                }))
            return followsData;
        }
        catch {
            return err => console.log(err)
        }
    },

    async getAllFollowing(db, users_id) {
        try {
            const following = await db
                .select('following_id')
                .from('following')
                .where({ users_id })
            const followingsData = await Promise.all(
                following.map(async f => {

                    const { following_id } = f

                    const [followingData] = await db
                        .select('fullname', 'username', 'id')
                        .from('user_information')
                        .where({ id: following_id })

                    return followingData

                }))
            return followingsData;
        }
        catch {
            return err => console.log(err)
        }
    },

    addFollow(db, user, following) {
        return db
            .insert({ users_id: following, following_id: user })
            .into('following')
            .catch(err => console.log(err))
    },

    removeFollow(db, users_id, following_id) {
        try {
            return db
                .from('following')
                .where({ users_id })
                .andWhere({ following_id })
                .del()
        }
        catch {
            return err => console.log(err)
        }
    },

    async isFollowing(db, user, following) {
        const res = await db
            .select('*')
            .from('following')
            .where({ users_id: user, following_id: following })

        return res.length ? true : false

    },

    async countFollowedbyUser(db, user_id) {
        return db
            .count('users_id')
            .from('following')
            .where({ following_id: user_id })
    },

    async countFollowingUser(db, users_id) {
        return db
            .count('following_id')
            .from('following')
            .where({ users_id })
    },
    makeFollowNotification(db, user_id, following_id) {
        //no message
        //make notification in table for following_id
        //type = follow
        //store user_id

    }



}

module.exports = FollowService;
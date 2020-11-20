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
                        console.log(f)
                        const [followData] = await db
                            .select('fullname', 'username', 'id')
                            .from('user_information')
                            .where({ id: users_id })

                        return followData
                    }
                    catch {
                        return err => console.log(err);
                    }
                }))
            console.log('FOLLOWS', followsData)
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
                    console.log(f)
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

    /* REFACTOR TO USE ASYNC AWAIT*/
    addFollow(db, user, following) {
        return db
            .insert({ users_id: following, following_id: user })
            .into('following')
            .catch(err => console.log(err))
    },

    async removeFollow(db, users_id, following_id) {
        try {

            return await db
                .from('following')
                .where({ users_id })
                .andWhere({ following_id })
                .del()
        }
        catch {
            return err => console.log(err)
        }
    },

}

module.exports = FollowService;
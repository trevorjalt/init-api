const AvatarService = require('../avatar/avatar-service');

const FollowService = {

    async getAllFollows(db, user_id) {
        try {
            const follows = await db
                .select('user_id')
                .from('following')
                .where({ following_id: user_id })

            const followsData = await Promise.all(

                follows.map(async f => {
                    try {
                        const { user_id } = f

                        const [followData] = await db
                            .select('fullname', 'username', 'id')
                            .from('user_information')
                            .where({ id: user_id })

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

    async getAllFollowing(db, user_id) {
        try {
            const following = await db
                .select('following_id')
                .from('following')
                .where({ user_id })

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

    async addFollow(db, user_id, following_id) {
        try {
            return await db
                .insert({ user_id, following_id })
                .into('following')
        }
        catch {
            return err => console.log(err)
        }
    },

    async removeFollow(db, user_id, following_id) {
        try {

            return await db
                .from('following')
                .where({ user_id })
                .andWhere({ following_id })
                .del()
        }
        catch {
            return err => console.log(err)
        }
    },

    async isFollowing(db, user_id, following_id) {
        try {
            const bool = await db
                .select('*')
                .from('following')
                .where({ user_id })
                .andWhere({ following_id })

            console.log('BOOL', bool)
            return bool ? true : false
        }
        catch {
            return err => console.log(err)
        }
    }

}

module.exports = FollowService;




//get all following

//remove from following list

//add to following list
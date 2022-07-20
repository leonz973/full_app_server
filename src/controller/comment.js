/*comment Controller控制器*/

const Comment = require('../model/Comment');
const Dayjs = require('dayjs')

//新增
async function create(content, username) {
    //创建数据库并保存
    const newComment = await Comment.create({
        content,
        username,
        update_time: Dayjs().format('YYYY-MM-DD HH:mm:ss')
    })
    return newComment
}

//更改
async function update(_id, username, content) {
    //查询并更新
    console.log(_id, username, content)
    const newData = await Comment.findOneAndUpdate(
        { _id, username },
        { content },
        { new:true }
    )

    return {
        content: newData.content,
        update_time: newData.update_time
    }
}

//删除
async function del(_id, username) {
    await Comment.deleteOne({
        _id, 
        username
    });
}

//获取单个详情
async function getCommentInfo(_id, username) {
    let data = await Comment.findOne({
        _id,
        username
    });

    return {
        content: data.content,
        update_time: data.update_time
    }
}


//获取列表
async function getList(username = '') {
    const whereOpt = {}
    if(username) {
        whereOpt.username = username
    }

    const list = await Comment.aggregate([
        {
            $match: whereOpt
        },
        {
            $lookup: {  //关联查询
                from: 'users', //从users集合获取数据
                localField: 'username', //当前集合字段
                foreignField: 'username', //users集合字段
                as: 'user_info' //合并后新字段名
            }
        },
        {
            $project: {
                content: 1,
                update_time: 1,
                netName: '$user_info.netName'  //从user_info中取值
            }
        },
        {
            $unwind: "$netName"   //按用户拆分数据
        }
    ])
    return list;
}

module.exports = {
    getList,
    del,
    create,
    update,
    getCommentInfo
}

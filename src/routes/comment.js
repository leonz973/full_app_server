/**router路由代码*/
/*comment.js*/
//留言功能的路由

const router = require('koa-router')();
const loginCheck = require('../middleware/loginCheck');
const { create, getList, del, update, getCommentInfo } = require('../controller/comment');

router.prefix('/comment');

//创建留言
router.post('/create', loginCheck, async(ctx, next) =>{
    //获取内容
    const { content, pics } = ctx.request.body;
    const { username } = ctx.state.user.data;

    //提交留言, 进入controller处理
    const newComment = await create(content, pics, username)

    //接口返回
    ctx.body = {
        status: '000',
        data: newComment,
        message: ''
    }
});

//更新留言
router.post('/update', loginCheck, async(ctx, next) =>{
    //获取id, 内容
    const { id, content } = ctx.request.body;
    //从token中获取用户
    const { username } = ctx.state.user.data;

    //执行更新
    try{
        const newData = await update(id, username, content);
        //接口返回
        ctx.body = {
            status: '000',
            data: newData,
            message: ''
        }

    } catch(ex) {
        console.error('更新失败',ex);
        ctx.body = {
            status: '-1',
            message: '更新失败',
            data: null
        }
    }
    
});

//删除留言
router.post('/del', loginCheck, async(ctx, next) =>{
    //获取id
    const { id } = ctx.request.body;
    //从token中获取用户
    const { username } = ctx.state.user.data;

    //执行更新
    try{
        await del(id, username);
        //接口返回
        ctx.body = {
            status: '000',
            data: null,
            message: '删除成功'
        }

    } catch(ex) {
        console.error('删除失败',ex);
        ctx.body = {
            status: '-1',
            message: '删除失败',
            data: null
        }
    }
    
});

//查询留言列表
router.post('/list', loginCheck, async(ctx, next) =>{
    //获取查询条件
    let { filterType } = ctx.request.body;
    filterType = parseInt(filterType) || 1;

    //从token中获取用户
    let username
    if(filterType == 2){
        username = ctx.state.user.data.username;
    }

    //获取列表
    const list = await getList(username);
    //接口返回
    ctx.body = {
        status: '000',
        data: list,
        message: ''
    }
    
});

//查询留言详情
router.post('/getCommentInfo', loginCheck, async(ctx, next) =>{
    //获取查询条件
    let { id } = ctx.request.body;

    //从token中获取用户
    let { username } = ctx.state.user.data;

    //获取列表
    const commentInfo = await getCommentInfo(id, username);
    console.log(commentInfo)
    //接口返回
    ctx.body = {
        status: '000',
        data: commentInfo,
        message: ''
    }
    
});


module.exports = router
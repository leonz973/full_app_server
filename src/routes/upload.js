const router = require('koa-router')()
const { updateUserAvatar } = require('../controller/user');
const loginCheck = require('../middleware/loginCheck');

const Dayjs = require('dayjs')
const koaBody = require("koa-body");
const path = require('path');
const fs = require("fs");

// 检查文件夹是否存在如果不存在则新建文件夹
function mkdir(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdir(path.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;
        }
    }
}

//文件上传
router.post('/upload', loginCheck, koaBody({
    multipart: true, // 支持多文件上传
    encoding: "gzip", // 编码格式
    formidable: {
      uploadDir: path.join(__dirname, "../public/upload/"), // 设置文件上传目录
      keepExtensions: true, // 保持文件的后缀
      maxFieldsSize: 10 * 1024 * 1024, // 文件上传大小限制
      onFileBegin: (name, file) => {
        // 无论是多文件还是单文件上传都会重复调用此函数
        // 最终要保存到的文件夹目录
        // console.log('name',file)
        const dirName = Dayjs(new Date()).format("YYYYMMDD");
        
        const dir = path.join(__dirname, `../public/upload/${dirName}`);
        // 检查文件夹是否存在如果不存在则新建文件夹
        mkdir(dir);

        // 文件名称去掉特殊字符但保留原始文件名称
        const fileName = file.originalFilename
          .replaceAll(" ")
          .replace(/[`~!@#$%^&*()|\-=?;:'",<>\{\}\\\/]/gi,"_");
          
        file.newFilename = fileName;
        // 覆盖文件存放的完整路径(保留原始名称)
        file.filepath = `${dir}/${fileName}`;
      },
      onError: (error) => {
        console.log('error', error)
        return
      },
    },
}), async(ctx, next) =>{

    // //从token中获取用户
    const { _id, username } = ctx.state.user.data;
    const file = ctx.request.files.file; // 上传的文件在ctx.request.files.file
    console.log(file)
    // // 修改文件的名称
    let oldPath = path.join(__dirname, `../public/upload/${Dayjs(new Date()).format("YYYYMMDD")}/${file.newFilename}`);
    let newFilename = `${_id}_${Dayjs(new Date()).format("YYYYMMDD")}_${file.newFilename}`
    let uploadPath = path.join(__dirname, `../public/upload/${Dayjs(new Date()).format("YYYYMMDD")}/${newFilename}`);

    fs.renameSync(oldPath, uploadPath);

    // //返回保存的路径
    // file.filepath = `${dir}/${_id}_${Dayjs(new Date()).format("YYYYMMDD_HH")}${fileName}`;

    let newAvatarUrl = `/upload/${Dayjs(new Date()).format("YYYYMMDD")}/${newFilename}`
    //调用controller更新头像地址
    console.log('path', newAvatarUrl)
    await updateUserAvatar(_id, newAvatarUrl)
    

    ctx.body = {
        status: '000',
        data: null,
        message: '上传成功'
    }
    
})

module.exports = router
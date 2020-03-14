require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fse = require('fs-extra');
const exStatic = require('express-static');
const multiparty = require('multiparty');
const {getFileExtName} = require('./utils');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post('/upload', function (req, res) {
  const multipart = new multiparty.Form();

  multipart.parse(req, async (err, fields, files) => {
    if (err) return;

    const [chunk] = files.chunk;
    const [hash] = fields.hash;
    const [index] = fields.index;
    const chunkDir = path.resolve(__dirname, 'files', hash);

    if (!fse.existsSync(chunkDir)) {
      fse.mkdirsSync(chunkDir);
      console.log(`已创建目录：${chunkDir}`);
    }

    if (await fse.pathExists(`${chunkDir}/${hash}-${index}`)) {
      await fse.remove(`${chunkDir}/${hash}-${index}`);
      console.log(`已删除文件：${hash}-${index}`);
    }
    await fse.move(chunk.path, `${chunkDir}/${hash}-${index}`);
    console.log(`已移动文件：${hash}-${index}`);

    res.json({data: true});
  });
});

app.post('/merge', async function (req, res) {
  const {hash, fileName: _filename} = req.body.data;
  const ext = getFileExtName(_filename);
  const fileName = ext ? `${hash}.${ext}` : hash;
  const chunkDir = path.resolve(__dirname, 'files', hash);
  const files = await fse.readdir(chunkDir);
  files.sort();

  const targetPath = path.resolve(__dirname, 'completed', fileName);
  fse.mkdirsSync(path.resolve(__dirname, 'completed'));

  if (fse.existsSync(targetPath)) {
    await fse.remove(targetPath);
    console.log(`已删除文件：${targetPath}`);
  }

  pipeFile(0);

  function pipeFile(i) {
    const chunkName = files[i];
    if (chunkName) {
      const chunkPath = path.resolve(__dirname, 'files', hash, chunkName);
      const writeStream = fse.createWriteStream(path.resolve(__dirname, 'completed', fileName), {flags: 'a'});
      const readStream = fse.createReadStream(chunkPath);
      writeStream.on('close', async function () {
        console.log(`合并文件：`, chunkName);
        await fse.remove(chunkPath);
        pipeFile(i + 1);
      });
      readStream.pipe(writeStream);
    } else {
      res.json({data: true});
    }
  }
});

app.use(exStatic(path.resolve(__dirname, '../Frontend')));

app.listen(process.env.APP_PORT, function () {});

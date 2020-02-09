let app = new Vue({
  el: '#app',
  data: {
    chunkSize: 4,
    file: null,
  },
  methods: {
    handleFileChange(e) {
      this.file = e.target.files && e.target.files[0];
    },
    async uploadFile() {
      if (!this.file) return alert('请选择文件');
      const hash = await this.getFileHash();
      const fileChunkList = this.getFileChunkList(hash);

      console.log(`文件Hash：${hash}`);

      const requestList = fileChunkList.map((chunk, i) => {
        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('hash', String(hash));
        formData.append('index', String(i));

        return axios.post('/upload', formData);
      });

      Promise.all(requestList).then(() => {
        axios.post('/merge', {
          data: {hash, fileName: this.file.name}
        });
      });
    },

    /* --------------∽-★-∽--- 我是华丽的分割线 ---∽-★-∽-------------- */
    /** 切割文件 **/
    getFileChunkList() {
      const fileSize = this.file.size;
      const chunkCount = fileSize / this.chunkSize >> 0;
      const fileChunkList = [];

      let index = 0;
      for (let i = 0; i < this.chunkSize; i++) {
        fileChunkList.push(this.file.slice(index, index + chunkCount + 1));
        index += chunkCount + 1;
        console.log(fileChunkList[i]);
      }

      console.log(`文件大小：${this.file.size}\n切片数量：${this.chunkSize}`);
      return fileChunkList;
    },
    /** 计算文件hash **/
    getFileHash() {
      return new Promise((resolve, reject) => {
        let worker = new Worker('/hash-worker.js');
        worker.postMessage({file: this.file});
        worker.onmessage = e => resolve(e.data.hash);
        worker.onerror = reject;
      });
    }
  }
});

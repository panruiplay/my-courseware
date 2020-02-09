self.importScripts('/lib/spark-md5.min.js');

self.onmessage = e => {
  const {file} = e.data;
  const spark = new self.SparkMD5.ArrayBuffer();
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  reader.onload = e => {
    spark.append(e.target.result);
    self.postMessage({
      hash: spark.end()
    });
    self.close();
  };
};

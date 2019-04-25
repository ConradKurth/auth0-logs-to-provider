const AWS = require('aws-sdk');

 const config = require('../config');
const logger = require('../logger');

 module.exports = () => {
  AWS.config.update({
    accessKeyId: config('AWS_ACCESS_KEY_ID'),
    secretAccessKey: config('AWS_SECRET_KEY'),
    region: config('AWS_REGION')
  });

    logger.info("Setting up kinesis");
   const kinesis = new AWS.Kinesis({ apiVersion: '2013-12-02' });

   const maxRecords = 500;

   const chunk = (array, size) => {
    const chunked_arr = [];
    let copied = [...array];
    const numOfChild = Math.ceil(copied.length / size);
    for (let i = 0; i < numOfChild; i++) {
      chunked_arr.push(copied.splice(0, size));
    }
    return chunked_arr;
  }


   return (logs, callback) => {
    logger.info("Trying to send to kinesis");
    return callback();
    // if (!logs || !logs.length) {
    //   return callback();
    // }

    // logger.info(`Sending ${logs.length} logs to Kinesis...`);
    // // these are the max number of records that can be sent to kinesis
    // const chunks = chunk(logs, maxRecords);

    //  chunks.forEach(logChunk => {
    //     const records = logChunk.map(log => ({ PartitionKey: String(numbers.random() * 100000), Data: JSON.stringify(log) }));

    //      var params = {
    //         Records: records,
    //         StreamName: config('STREAM_NAME')
    //     }

    //      kinesis.putRecords(params,
    //     (err, result) => {
    //         logger.info(`Results and error ${err}, ${result}`);
    //         callback(err, result);
    //     });
    // });
  };
};

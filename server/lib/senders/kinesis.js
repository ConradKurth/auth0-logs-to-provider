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
  const firehose = new AWS.Firehose({apiVersion: '2015-08-04'});

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
    if (!logs || !logs.length) {
      return callback();
    }

    logger.info(`Sending ${logs.length} logs to Kinesis...`);
    // these are the max number of records that can be sent to kinesis
    const chunks = chunk(logs, maxRecords);

    chunks.forEach(logChunk => {
      const records = logChunk.map((log) => {
          log.id = log._id;
          delete log._id
          return log
      }).map(log => ({ PartitionKey: String(Math.random() * 100000), Data: JSON.stringify(log) }));

      var params = {
        Records: records,
        DeliveryStreamName: config('STREAM_NAME')
      }

      firehose.putRecordBatch(params, (err, result) => {
        logger.info(`Results and error ${err}, ${result}`);
        callback(err, result);
      });
    });
  };
};

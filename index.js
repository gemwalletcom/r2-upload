const S3 = require('aws-sdk/clients/s3');
const core = require('@actions/core');
const fs = require('fs');
const path = require('path');

try {
    const endpoint = core.getInput('endpoint');
    const accessKeyID = core.getInput('access_key_id');
    const secretAccessKey = core.getInput('secret_access_key');
    const bucket = core.getInput('bucket');
    const file = core.getInput('file');
    const destination = core.getInput('destination');

    const s3 = new S3({
        endpoint: endpoint,
        accessKeyId: accessKeyID,
        secretAccessKey: secretAccessKey,
        signatureVersion: 'v4',
    });

    const fileContent = fs.readFileSync(file);
    let uploadParams = {
        Bucket: bucket,
        Key: destination ? destination : path.basename(file),
        Body: fileContent
    };

    // call S3 to retrieve upload file to specified bucket
    s3.upload(uploadParams, function (err, data) {
        if (err) {
            console.log("Error", err);
            core.setFailed(err);
        } if (data) {
            console.log("Upload Success", data.Location);
        }
    });
} catch (error) {
    core.setFailed(error.message);
}
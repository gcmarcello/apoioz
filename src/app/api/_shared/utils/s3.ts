import { getEnv } from "@/_shared/utils/settings";
import { S3Client } from "@aws-sdk/client-s3";

const accessKeyId = getEnv("AWS_ACCESS_KEY_ID");
const secretAccessKey = getEnv("AWS_SECRET_ACCESS_KEY");

if (!accessKeyId || !secretAccessKey) {
  throw new Error("AWS credentials not found");
}

const s3Client = new S3Client({
  region: getEnv("AWS_REGION"),
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export default s3Client;

import { getEnv } from "@/_shared/utils/settings";
import { S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: getEnv("AWS_REGION"),
  credentials: {
    accessKeyId: getEnv("AWS_ACCESS_KEY_ID"),
    secretAccessKey: getEnv("AWS_SECRET_ACCESS_KEY"),
  },
});

export default s3Client;

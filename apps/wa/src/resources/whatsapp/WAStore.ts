import { AwsS3Store } from "wwebjs-aws-s3";

import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { Store } from "whatsapp-web.js";

const s3 = new S3Client({
  region: "us-east-005",
  endpoint: "https://s3.us-east-005.backblazeb2.com/",
  credentials: {
    accessKeyId: "005f1de32d377c20000000001",
    secretAccessKey: "K005wRPz1N+nTq6JSIPn6VNNZhwWxK8",
  },
});

const putObjectCommand = PutObjectCommand;
const headObjectCommand = HeadObjectCommand;
const getObjectCommand = GetObjectCommand;
const deleteObjectCommand = DeleteObjectCommand;

export const waStore: Store = new AwsS3Store({
  bucketName: "apoioz",
  remoteDataPath: "wa/session/",
  s3Client: s3,
  putObjectCommand,
  headObjectCommand,
  getObjectCommand,
  deleteObjectCommand,
});

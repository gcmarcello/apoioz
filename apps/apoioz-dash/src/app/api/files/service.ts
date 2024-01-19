import { getEnv } from "@/_shared/utils/settings";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "../_shared/utils/s3";

export async function uploadFile(file: Blob) {
  try {
    const uploadParams = {
      Bucket: getEnv("S3_BUCKET_NAME"),
      Key: crypto.getRandomValues(new Uint32Array(10)).join(""),
      Body: file,
      ContentType: "image/jpg",
    };

    const command = new PutObjectCommand(uploadParams);
    const uploadedFile = await s3Client.send(command);

    return uploadedFile.ETag;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteFile(key: string) {
  try {
    const deleteParams = {
      Bucket: getEnv("S3_BUCKET_NAME"),
      Key: key,
    };

    const command = new PutObjectCommand(deleteParams);
    const deletedFile = await s3Client.send(command);

    return deletedFile.ETag;
  } catch (error) {
    console.log(error);
  }
}

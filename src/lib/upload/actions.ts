'use server';

import {S3Client, PutObjectCommand} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';
import {getServerAuthSession} from '~/server/auth';
import crypto from 'crypto';
import {api} from '~/trpc/server';
import {redirect} from 'next/navigation';

const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

type signedURLResponse = Promise<
  | {failure?: undefined; success: {url: string; mediaID: number}}
  | {failure: string; success?: undefined}
>;

const acceptedFileTypes = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
];

const maxFileSize = 1024 * 1024 * 8; // 8 MB

const generateFileName = (b = 32) => {
  return crypto.randomBytes(b).toString('hex');
};

export const handleUpload = async (
  type: string,
  size: number,
  checksum: string
): signedURLResponse => {
  const session = await getServerAuthSession();

  if (!session) {
    return {
      failure: 'You must be signed in to upload posts.',
    };
  }

  if (!acceptedFileTypes.includes(type)) {
    return {
      failure: 'Invalid file type',
    };
  }

  if (size > maxFileSize) {
    return {
      failure: 'File is too large',
    };
  }

  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: generateFileName(),
    ContentType: type,
    ContentLength: size,
    ChecksumSHA256: checksum,
    Metadata: {
      userId: session.user.id,
    },
  });

  const url = await getSignedUrl(s3, putObjectCommand, {
    expiresIn: 60,
  });

  const dbUploadResult = await api.post.createMedia({url});

  return {
    success: {
      url: url,
      mediaID: dbUploadResult,
    },
  };
};

export const createPost = async (mediaID: number, caption: string) => {
  const session = await getServerAuthSession();
  if (session) {
    await api.post.createPost({mediaId: mediaID, caption: caption});
    const userData = await api.user.getUserData();
    return redirect(`/${userData?.username}`);
  }
};

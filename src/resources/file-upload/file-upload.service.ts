import { S3 } from 'aws-sdk';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { generateRandomness } from 'src/common/utils/helper';

@Injectable()
export class FileUploadService {
    private readonly logger = new Logger(FileUploadService.name);
    private readonly s3: S3;

    constructor(
        private configService: ConfigService,
        @Inject(REQUEST) private readonly request: Request,
    ) {
        this.s3 = new S3({
            accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
        });
    }

    async uploadToS3(file, bucket, name) {
        const params = {
            Bucket: bucket,
            Key: String(name),
            Body: file,
            ContentType: file.mimetype,
            ACL: 'public-read',
        };
        return new Promise((resolve, reject) => {
            this.s3.upload(params, (err, data) => {
                if (err) {
                    this.logger.verbose(
                        'Error occurred while uploading to S3',
                        err.message,
                    );
                    reject(err.message);
                }
                this.logger.verbose('File has uploaded successfully');
                resolve(data);
            });
        });
    }

    async upload(file, key) {
        const bucketS3 = this.configService.get('AWS_BUCKET_NAME');
        const { Location } = <Record<any, any>>(
            await this.uploadToS3(file.buffer, bucketS3, key)
        );
        return Location;
    }

    async getFileUrl(file) {
        let imageUrl = '';

        if (file) {
            const fileType = file.mimetype.split('/')[1];
            const key = `${process.env['S3_IMAGE_FOLDER ']}/${generateRandomness(20)}.${fileType}`;
            imageUrl = await this.upload(file, key);
        }

        return imageUrl;
    }

    async uploadFile(file) {
        return this.getFileUrl(file);
    }


    // delete image from s3
    async deleteFromS3(Key) {
        return new Promise((resolve, reject) => {
            this.s3.deleteObject(
                {
                    Bucket: this.configService.get('AWS_BUCKET_NAME'),
                    Key,
                },
                (err, data) => {
                    if (err) {
                        this.logger.verbose('Error deleting file', err);
                        reject(err.message);
                    }
                    this.logger.verbose('File has been deleted successfully');
                    resolve(data);
                },
            );
        });
    }


}

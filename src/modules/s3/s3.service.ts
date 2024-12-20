import { Injectable } from "@nestjs/common";
import {S3, S3ClientConfig} from "@aws-sdk/client-s3"
import { S3AccessKey, S3EndPoint, S3SecretKey } from "src/common/constant/s3.constant";
import { extname } from "path";

@Injectable()
export class S3Service {
    private s3Client: S3;
    private bucket: string;
    constructor(){
        this.bucket = "amirsnappfood"
        this.s3Client = new S3(this.initConfig());
    }
    initConfig(){
        const config: S3ClientConfig = {
            credentials: {
                accessKeyId: S3AccessKey,
                secretAccessKey: S3SecretKey
            },
            region: "default",
            endpoint: "https://storage.c2.liara.space"
        }
        return config;
    }

    async uploadFile(file: Express.Multer.File, folder: string){
        const ext = extname(file.originalname);
        const Key= `${folder}/${new Date().getTime()}${ext}`
        const {$metadata} = await this.s3Client.putObject({
            Bucket: this.bucket,
            Body: file.buffer,
            Key,
        })
        return {
            Location: `https://${S3EndPoint}/${Key}`,
            Key
        }
    }
}
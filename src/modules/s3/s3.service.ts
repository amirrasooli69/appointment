import { Injectable } from "@nestjs/common";
import {S3, S3ClientConfig} from "@aws-sdk/client-s3"
import { S3AccessKey, S3SecretKey } from "src/common/constant/s3.constant";

@Injectable()
export class S3Service {
    private s3Client: S3;
    constructor(){
        this.s3Client = new S3(this.initConfig());
    }
    initConfig(){
        const config: S3ClientConfig = {
            credentials: {
                accessKeyId: S3AccessKey,
                secretAccessKey: S3SecretKey
            },
            region: "default",
            endpoint: "storage.c2.liara.space "
        }
        return config;
    }

    async uploadFile(file: Express.Multer.File, folder: string){
        this.s3Client 
    }
}
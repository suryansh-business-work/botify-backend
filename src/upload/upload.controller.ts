import ImageKit from 'imagekit'
import dotenv from "dotenv";
import { errorResponse, successResponseArr } from '../utils/response-object'

dotenv.config();

const imagekit = new ImageKit({
  publicKey: 'public_kgj5PULxw6pfjeO2IGwEVundBIQ=',
  privateKey: 'private_n4IdSlg7DbXXn88rRAVqZhCgGVw=',
  urlEndpoint: 'https://ik.imagekit.io/esdata1'
})

const imageKitUpload: any = async (req: any, res: Response) => {
  try {
    if (req && req?.files && req?.files?.files) {
      if (!Array.isArray(req?.files?.files)) {
        const { name, data, size, mimetype } = req?.files?.files
        const uploadResponse = await imagekit.upload({
          file: data,
          fileName: name,
          folder: '/botify'
        })
        successResponseArr(
          res,
          [
            {
              fileId: uploadResponse?.fileId,
              size: uploadResponse?.size,
              fileName: {
                actual: name,
                uploadedName: uploadResponse?.name
              },
              filePath: {
                filePath: uploadResponse?.filePath,
                fileUrl: uploadResponse?.url,
                thumbnailUrl: uploadResponse?.thumbnailUrl
              },
              fileType: uploadResponse?.fileType
            }
          ],
          {},
          'File uploaded successfully'
        )
      } else {
        const uploadPromises = req?.files?.files?.map(async (file: any) => {
          const { name, data } = file
          const uploadResponse = await imagekit.upload({
            file: data,
            fileName: name
          })
          return {
            fileId: uploadResponse?.fileId,
            size: uploadResponse?.size,
            fileName: {
              actual: name,
              uploadedName: uploadResponse?.name
            },
            filePath: {
              filePath: uploadResponse?.filePath,
              fileUrl: uploadResponse?.url,
              thumbnailUrl: uploadResponse?.thumbnailUrl
            },
            fileType: uploadResponse?.fileType
          }
        })
        const allUploadedFiles = await Promise.all(uploadPromises)
        successResponseArr(res, allUploadedFiles, {}, 'All File uploaded successfully')
      }
    } else {
      errorResponse(
        res,
        { error: 'Files requested for upload is not selected (It should be Array of files or a single file)' },
        'File not uploaded successfully'
      )
    }
  } catch (error: any) {
    errorResponse(res, { error: error }, 'File not uploaded successfully')
  }
}
export { imageKitUpload }

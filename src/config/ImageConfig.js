import fileBlank from "../assets/image/blank.png";
import fileCSV from "../assets/image/csv.png";
import fileDOC from "../assets/image/doc.png";
import fileIMG from "../assets/image/image.png";
import filePDF from "../assets/image/pdf.png";
import filePPT from "../assets/image/ppt.png";
import fileXLS from "../assets/image/xls.png";

export const ImageConfig = {
    default: fileBlank,

    'text/csv': fileCSV,

    'application/msword': fileDOC,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': fileDOC,

    'image/jpeg': fileIMG,
    'image/png': fileIMG,
    'image/bmp (.bmp)': fileIMG,

    'application/pdf': filePDF,

    'application/vnd.openxmlformats-officedocument.presentationml.presentation': filePPT,
    'application/vnd.ms-powerpoint': filePPT,


    'application/vnd.ms-excel': fileXLS,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': fileXLS
}

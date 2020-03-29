const fs = require("fs");
const path = require('path');
const config = require('config');
if (typeof require !== 'undefined') XLSX = require('xlsx');
const { createObjWithCustomerKey, readFirstSheet, sheetToJson, createWorkbook, addOriginalSheet, createSheetToEachCustomer } = require('./utils/utils')

const COLUMN_TITLE = config.get('COLUMN_TITLE');
const CREATED_FILE_NAME = `result-${new Date().toLocaleDateString()}.xlsx`
const tempDIr = config.get('readCurrentDir');

const executeProject = (tempDIr, filename) => {
    console.log("ads",tempDIr,filename)
    const pathDirAndFile = path.join(tempDIr, filename);
    const worksheet = readFirstSheet(pathDirAndFile);

    //convert excel content to json
    const wsJson = sheetToJson(worksheet.content);

    const objWithKeysOfCustomers = createObjWithCustomerKey(wsJson, COLUMN_TITLE);

    let newWB = createWorkbook();
    newWB = addOriginalSheet(newWB, wsJson, worksheet.sheetName);
    newWB = createSheetToEachCustomer(newWB, objWithKeysOfCustomers)

    XLSX.writeFile(newWB, CREATED_FILE_NAME);
//remove the file
        fs.unlink(pathDirAndFile, (err) => {
            if (err) throw err;
           console.log(filename + " was deleted");
        });
}

fs.readdir(tempDIr, (err, files) => {
    if (err) {
        console.log(err);
        return;
    }
    files.forEach(filename => {
       
        executeProject(tempDIr, filename);
    })
})






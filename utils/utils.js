const config = require('config');
const readFirstSheet = (fileName) => {
    // cellText:false (so the text isn't generated) and cellNF:false (so the date formats aren't generated), cellDates:true means get the date as a Date type
    const workbook = XLSX.readFile(fileName, { type: 'binary', cellDates: true, cellNF: false, cellText: false });
    return { sheetName: workbook.SheetNames[0], content: workbook.Sheets[workbook.SheetNames[0]] }
}

const sheetToJson = (worksheet) => {
    return XLSX.utils.sheet_to_json(worksheet, { raw: false, dateNF: "DD/MM/YYYY" })
}

const createObjWithCustomerKey = (wsJson, chosenKey) => {
    return wsJson.reduce((accum, curr) => {
        let key = curr[chosenKey];
        if (key) {
            //THE LIMIT CHARECTERS IN SHEET NAME IS 30
            key = key.slice(0, 30).replace(/\*|\)|\'/g, "")
        }
        else if (curr['שם לקוח']===config.get('COLUMN_TITLE_CUSTOMER_NAME')) {
            key = config.get('COLUMN_TITLE_CUSTOMER_NAME')
        }
        else{
            key = config.get('COLUMN_TITLE_DEFAULT')
        }

        if (!accum[key]) {
            accum[key] = []
        }
        accum[key].push(curr);
        return accum;
    }, {})
}

const createWorkbook = (title = 'SheetJS', subject = 'All invoices', author = 'Ofir', date = new Date()) => {
    let newWB = XLSX.utils.book_new();
    newWB.Props = {
        Title: title,
        Subject: subject,
        Author: author,
        CreatedDate: date
    };
    return newWB;
}
const addOriginalSheet = (newWorkbook, worksheetJson, sheetName) => {
    return createContentJsonInSheet(newWorkbook, worksheetJson, sheetName);
}

const createSheetToEachCustomer = (workbook, objWithKeysOfCustomers) => {
    const sheetNames = Object.keys(objWithKeysOfCustomers);
    const sheetContens = Object.values(objWithKeysOfCustomers);
    for (i = 0; i < sheetNames.length; i++) {
        workbook = createContentJsonInSheet(workbook, sheetContens[i], sheetNames[i]);
    }
    return workbook;
}

const createContentJsonInSheet = (workbook, worksheetJson, sheetName) => {
    workbook.SheetNames.push(sheetName);
    const ws = XLSX.utils.json_to_sheet(worksheetJson);
    workbook.Sheets[sheetName] = ws;
    return workbook;
}


module.exports = {
    readFirstSheet,
    createObjWithCustomerKey,
    sheetToJson,
    createWorkbook,
    addOriginalSheet,
    createSheetToEachCustomer
}
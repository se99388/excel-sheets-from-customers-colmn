const path = require('path');

const readCurrentDir = path.resolve(__dirname,'..','input-file');
const resultDir = path.resolve(__dirname,'..','result-file');
const COLUMN_TITLE = 'שם לקוח משלם';
const COLUMN_TITLE_CUSTOMER_NAME = 'שראל-פתרונות לוגיסטיים ומוצרים';
const COLUMN_TITLE_DEFAULT = 'אחרים'
module.exports={
    readCurrentDir,
    resultDir,
    COLUMN_TITLE,
    COLUMN_TITLE_DEFAULT,
    COLUMN_TITLE_CUSTOMER_NAME
}
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Specify the folder path containing the Excel files
const folderPath = './excelFilesFolder'; // Replace with your folder path

// Get a list of all Excel files in the folder
const excelFiles = fs.readdirSync(folderPath).filter(file => path.extname(file) === '.xlsx');

excelFiles.forEach(excelFile => {
    // Load the Excel file
    const workbook = XLSX.readFile(path.join(folderPath, excelFile));

    // Assuming the first sheet is the one to convert
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert the worksheet data to JSON format
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Split keys, and create separate 'ko' and 'en' JSON objects
    const koData = {};
    const enData = {};

    jsonData.forEach(entry => {
        function convertToNestedObject(keyString, value, obj) {
            const keys = keyString.split('.');

            keys.reduce((acc, key, index) => {
                if (index === keys.length - 1) {
                    acc[key] = value;
                } else {
                    if (!acc[key]) {
                        acc[key] = {};
                    }
                    return acc[key];
                }
                return acc;
            }, obj);

            return obj;
        }

        convertToNestedObject(entry.key, entry.ko, koData);
        convertToNestedObject(entry.key, entry.en, enData);
    });

    // Write 'ko' and 'en' JSON files
    const jsonFilePathKo = path.join('output', 'ko',`${path.basename(excelFile, '.xlsx')}.json`);
    const jsonFilePathEn = path.join('output', 'en',`${path.basename(excelFile, '.xlsx')}.json`);
    fs.writeFileSync(jsonFilePathKo, JSON.stringify(koData, null, 2));
    fs.writeFileSync(jsonFilePathEn, JSON.stringify(enData, null, 2));

    console.log(`Conversion complete for ${excelFile}!`);
});
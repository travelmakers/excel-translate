const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Specify the folder path containing the JSON files
const folderPath = './jsonFilesFolder'; // Replace with your folder path

const locales = ['/ko', '/en'];

// Get a list of all JSON files in the folder
const jsonFiles = [];
locales.map(locale => {
    jsonFiles.push(
        ...fs.readdirSync(folderPath + locale).filter(file => path.extname(file) === '.json')
    );

})

const flattenKeys = (obj, prefix = '') => {
    return Object.keys(obj).reduce((acc, key) => {
        const newKey = prefix ? `${prefix}.${key}` : `${key}`;

        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            const nestedKeys = flattenKeys(obj[key], newKey);
            return { ...acc, ...nestedKeys };
        } else {
            return { ...acc, [newKey]: obj[key] };
        }
    }, {});
};

const transformToTwoColumns = (obj, objEn) => {
    const result = [];

    Object.keys(obj).forEach((key) => {
        const row = {
            ['key']: key,
            ['ko']: obj[key],
            ['en']: objEn[key],
        };
        result.push(row);
    });

    return result;
};


jsonFiles.forEach(jsonFile => {
    // Load the JSON data
    const jsonData = require(`./jsonFilesFolder/ko/${jsonFile}`);
    const jsonDataEn = require(`./jsonFilesFolder/en/${jsonFile}`);
    const flattenedKeys = flattenKeys(jsonData);
    const flattenedEnKeys = flattenKeys(jsonDataEn);
    const transformedData = transformToTwoColumns(flattenedKeys, flattenedEnKeys);

    // Convert the JSON data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(transformedData);

    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1'); // 'Sheet1' is the sheet name

    // Write the workbook to a file
    const excelFilePath = path.join('output', 'excel', `${path.basename(jsonFile, '.json')}.xlsx`);
    XLSX.writeFile(workbook, excelFilePath);

    console.log(`Conversion complete for ${jsonFile}!`);
});

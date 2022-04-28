// Use npx ts-node to run
import { processCsvFile } from './directusHelper';
import fs from 'fs';

const collectionName = ''
const csvFile = ''
const directusHost = ''
const directuEmail = ''
const directusPassword = ''

console.log(csvFile, collectionName)

processCsvFile(fs.readFileSync(csvFile), collectionName, directusHost, directuEmail, directusPassword)

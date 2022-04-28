// Use npx ts-node to run
import { processCsvFile } from './directusHelper';
import fs from 'fs';

const collectionName = 'wikipedia'
const csvFile = '/mnt/c/Users/pryks/lightkeeper/fusion-search/topics2.csv'
const directusHost = 'https://data-sandbox.dev.lightkeeper.polysentry.com'
const directuEmail = 'admin@lightkeeper.polysentry.com'
const directusPassword = 'rJBdX%u$ui!x8Z*t'

console.log(csvFile, collectionName)

processCsvFile(fs.readFileSync(csvFile), collectionName, directusHost, directuEmail, directusPassword)

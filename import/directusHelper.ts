import {parse} from 'csv-parse/sync'
import {stringify} from 'csv-stringify/sync'
import axios from 'axios'
const FormData = require('form-data')

var directus_url = "" 
var email = ""
var password = "" 

const batchSize = 200
const info_size = 20
var access_token = ""
var collection = ""

async function loginToDirectus(){
    const auth_response = await axios.post(`${directus_url}/auth/login`, {email: email, password: password})
    access_token = auth_response.data.data.access_token
}

export async function processCsvFile(input: any, collectionName: string, directusHost:string, directuEmail:string, directusPassword:string){   
    collection = collectionName
    directus_url = directusHost
    email = directuEmail
    password = directusPassword

    await loginToDirectus()

    const rows = parse(input, {columns: true})
    if(shouldProcessRows(rows)){
      await processRows(rows)
    } 
}

function shouldProcessRows(rows: any[]){
  return rows[0].hasOwnProperty('image')
}

async function processRows(rows: any[]){
  const size = rows.length
  let parsed = 0
  let parsedRows: any[] = []
  for await (const row of rows){
    parsedRows.push(await parseRow(row))
    parsed += 1

    if(parsed % info_size == 0){
      console.log(`Parsed ${parsed}/${size}`)
    }

    if(parsed % batchSize == 0) {
      console.log("Sending batch to directus")
      await sendRowsToDirectus(parsedRows)
      parsedRows = []
    }
  }

  console.log("Sending batch to directus")
  await sendRowsToDirectus(parsedRows)
}

async function parseRow(row: any){
  const url = row.image;
  if(isValidUrl(url)){
    console.log(`Getting image for ${url}`)
    const image_uuid = await sendImportRequest(url)
    row.image = image_uuid
  } else {
    row.image = null
  }
  return row;
}

async function sendImportRequest(import_url: string){
  try {
    const import_response = await axios.post(`${directus_url}/files/import`,{url: import_url}, {headers: {'Authorization' : `Bearer ${access_token}`}})
    return import_response.data.data.id
    
  } catch(e: any){
    console.error(`Error while sending import request for ${import_url}`)
    if(e.response.status == 401){
      await loginToDirectus()
    }
    return null
  }
}

async function sendRowsToDirectus(rows: any[]){
  const output = stringify(rows, {header: true})
  const formData = new FormData();
  formData.append('file', output, { filename : 'document.csv' });

  try{
    await axios.post(`${directus_url}/utils/import/${collection}`, formData, {headers: {'Authorization' : `Bearer ${access_token}`, 'content-type': `multipart/form-data; boundary=${formData._boundary}`}})
  } catch(e: any){
    console.error(e)
    if(e.response.status == 401){
      await loginToDirectus()
    }
  }
}

function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return (url.match(/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp|)(\?(.*))?$/gmi) !== null);
    } catch (err) {
        return false;
    }
}
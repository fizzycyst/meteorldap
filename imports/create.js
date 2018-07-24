import  Papa  from 'papaparse';
import { Assets } from 'meteor/meteor';
export function createUsersFile() {

const csv = Assets.getText('/nazmes/csv');
const rows = Papa.parse(csv).data;

console.log(rows[0]);
}
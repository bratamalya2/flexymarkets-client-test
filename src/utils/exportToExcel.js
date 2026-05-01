import { setNotification } from "../globalState/notificationState/notificationStateSlice";
import * as XLSX from 'xlsx';

export const handleExportToExcel = (rows, filename, dispatch) => {
    const rowData = rows.map((row) => row.original || row);
    if (!rowData.length) {
        dispatch(setNotification({ open: true, message: "No data to export.", severity: "info" }));
        return;
    }
    const worksheet = XLSX.utils.json_to_sheet(rowData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, filename || 'List.xlsx');
};
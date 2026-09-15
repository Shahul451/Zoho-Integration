"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flattenObject = flattenObject;
exports.flattenTableData = flattenTableData;
/**
 * Helper utility to flatten nested JSON objects into single-level tabular records for Power BI table querying.
 */
function flattenObject(obj, prefix = '', res = {}) {
    for (const key of Object.keys(obj)) {
        const val = obj[key];
        const newKey = prefix ? `${prefix}_${key}` : key;
        if (val === null || val === undefined) {
            res[newKey] = '';
        }
        else if (Array.isArray(val)) {
            // If array contains simple primitives or custom fields, serialize or extract summary
            if (val.length === 0) {
                res[newKey] = '';
            }
            else if (typeof val[0] === 'object' && val[0] !== null) {
                // Special case: Custom fields array
                if (val[0].label && (val[0].value !== undefined || val[0].value_formatted !== undefined)) {
                    val.forEach((cf) => {
                        const cfKey = `cf_${cf.label.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
                        res[cfKey] = cf.value_formatted || cf.value || '';
                    });
                }
                else {
                    res[newKey] = JSON.stringify(val);
                }
            }
            else {
                res[newKey] = val.join(', ');
            }
        }
        else if (typeof val === 'object') {
            flattenObject(val, newKey, res);
        }
        else {
            res[newKey] = val;
        }
    }
    return res;
}
/**
 * Transforms an array of Zoho entities into flattened table rows suitable for Power BI.
 */
function flattenTableData(records) {
    if (!Array.isArray(records))
        return [];
    return records.map((record) => flattenObject(record));
}

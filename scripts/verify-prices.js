const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'src', 'mocks', 'data.js');
const tmpPath = path.join(__dirname, 'tmp-mockdata-for-verify.js');

let src = fs.readFileSync(dataPath, 'utf8');

// Naive transform: replace 'export const' with 'const' so we can require the file in Node
src = src.replace(/export const /g, 'const ');

// Append module.exports for the collections we need
src += '\n\nmodule.exports = {' +
"\n  mockListPricesHeaders,\n  mockPrices,\n  mockProducts,\n  mockEmployees,\n  mockAccounts,\n  mockInventory,\n};\n";

fs.writeFileSync(tmpPath, src, 'utf8');

const { mockListPricesHeaders, mockPrices, mockProducts } = require(tmpPath);

function getPriceHeaders() {
  return mockListPricesHeaders;
}

function getActivePriceHeaders() {
  return mockListPricesHeaders.filter((p) => p.isActive === true || p.state === true);
}

function getPrices() {
  const enrichedPrices = mockPrices.map((price) => {
    const allPUT = mockProducts.flatMap((p) => p.ProductUnitTypes || []);
    const put = allPUT.find((put) => put.id === price.ProductUnitTypeId);
    const product = mockProducts.find((p) => p.id === (put && put.ProductId));
    return {
      ...price,
      ProductUnitType: put
        ? {
            ...put,
            Product: product
              ? { id: product.id, name: product.name, barcode: product.barcode }
              : null,
          }
        : null,
    };
  });
  return enrichedPrices;
}

function getPriceLinesByHeader(headerId) {
  const lines = mockPrices.filter((pl) => {
    if (pl.ListPricesHeaderId && String(pl.ListPricesHeaderId) === String(headerId)) return true;
    if (pl.priceHeaderId && String(pl.priceHeaderId) === String(headerId)) return true;
    if (pl.ListPricesHeaderId && !Number.isNaN(Number(pl.ListPricesHeaderId)) && Number(pl.ListPricesHeaderId) === Number(headerId)) return true;
    if (pl.priceHeaderId && !Number.isNaN(Number(pl.priceHeaderId)) && Number(pl.priceHeaderId) === Number(headerId)) return true;
    return false;
  });
  return lines;
}

console.log('== All price headers ==');
console.log(JSON.stringify(getPriceHeaders(), null, 2));
console.log('\n== Active price headers ==');
console.log(JSON.stringify(getActivePriceHeaders(), null, 2));
console.log('\n== Enriched prices (sample 10) ==');
console.log(JSON.stringify(getPrices().slice(0, 20), null, 2));
console.log('\n== Price lines for PRICE_HEADER_003 ==');
console.log(JSON.stringify(getPriceLinesByHeader('PRICE_HEADER_003'), null, 2));

// Cleanup
fs.unlinkSync(tmpPath);

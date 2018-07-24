const PdfPrinter = require('pdfmake');
const fs = require('fs');
const { spawn } = require('child_process');
const config = require('./config');

// injected from outside
let logger = null;
const setLogger = (l) => { logger = l; };

const fonts = {
  Roboto: {
    normal: '../fonts/Roboto-Regular.ttf',
    bold: '../fonts/Roboto-Medium.ttf',
    italic: '../fonts/Roboto-Italic.ttf',
    bolditalics: '../fonts/Roboto-MediumItalic.ttf',
  },
  OpenSansLight: {
    normal: '../fonts/OpenSans-Light.ttf',
    italics: '../fonts/OpenSans-LightItalic.ttf',
    bold: '../fonts/OpenSans-Regular.ttf',
    bolditalics: '../fonts/OpenSans-Italic.ttf',
  },
  OpenSans: {
    normal: '../fonts/OpenSans-Regular.ttf',
    italics: '../fonts/OpenSans-Italic.ttf',
    bold: '../fonts/OpenSans-Semibold.ttf',
    bolditalics: '../fonts/OpenSans-SemiboldItalic.ttf',
  },
  OpenSansSemi: {
    normal: '../fonts/OpenSans-Semibold.ttf',
    italics: '../fonts/OpenSans-SemiboldItalic.ttf',
    bold: '../fonts/OpenSans-Bold.ttf',
    bolditalics: '../fonts/OpenSans-BoldItalic.ttf',
  },
  OpenSansExtra: {
    normal: '../fonts/OpenSans-Bold.ttf',
    italics: '../fonts/OpenSans-BoldItalic.ttf',
    bold: '../fonts/OpenSans-ExtraBold.ttf',
    bolditalics: '../fonts/OpenSans-ExtraBoldItalic.ttf',
  },
};

const images = {
  logo: '../images/logo.png',
};

const pdfPrinter = new PdfPrinter(fonts);

const actionMap = {
  hw_buy: 'receive',
  hw_sell: 'return',
  hw_repurchase: 'invoice_data',
};

const formatPrice = (price) => {
  const elems = [];
  price.toString().split('').reverse().forEach((digit, idx) => {
    if (idx && (idx % 3 === 0)) { elems.push(','); }
    elems.push(digit);
  });
  return elems.reverse().join('');
};

const monthMap = {
  '01': 'January',
  '02': 'February',
  '03': 'March',
  '04': 'April',
  '05': 'May',
  '06': 'June',
  '07': 'July',
  '08': 'August',
  '09': 'September',
  10: 'October',
  11: 'November',
  12: 'December',
};

const generatePdf = (options) => new Promise((resolve) => {
  // document definition
  const document = {
    pageSize: 'A4',
    pageOrientation: 'portrait',
    pageMargins: [40, 100, 40, 68],
    header: {
      margin: [40, 40],
      image: images.logo,
      width: 100,
    },
    footer: (current, total) => ({
      margin: [40, 20],
      columns: [
        {
          text: 'Registered office: Štefánikova 18/25, Prague 5, 15000, Czech Republic',
          style: 'footer',
        },
        {
          text: `Page ${current} of ${total}`,
          style: ['footer', 'right'],
        },
      ],
    }),
    content: [],
    defaultStyle: {
      font: 'OpenSans',
      fontSize: 8,
    },
    styles: {
      title: { font: 'OpenSansSemi', fontSize: 16, bold: true },
      bold: { bold: true },
      italics: { italics: true },
      table: { font: 'OpenSansLight' },
      right: { alignment: 'right' },
      signature: { font: 'OpenSansLight', fontSize: 6 },
      footer: { font: 'OpenSansLight', fontSize: 6 },
    },
  };
  if (options.type !== 'hw_repurchase') {
    // handover protocol
    document.content.push({ text: 'Handover protocol', style: 'title', margin: [0, 0, 0, 20] });
    const parties = {
      giving: [{ text: 'Handed over by:', style: 'bold' }],
      receiving: [{ text: 'Taken over by:', style: 'bold' }],
    };
    parties[(options.type === 'hw_buy' ? 'receiving' : 'giving')].push({ text: options.user.name });
    parties[(options.type === 'hw_buy' ? 'giving' : 'receiving')].push(
      { text: 'Salsita s.r.o.' },
      { text: 'Štefánikova 18/25' },
      { text: '15000, Prague 5' },
      { text: 'Czech Republic' },
    );
    document.content.push({
      table: {
        widths: [40, '*', 40, '*', 40],
        headerRows: 1,
        body: [['', parties.giving, '', parties.receiving, '']],
      },
      layout: {
        hLineWidth: () => 0,
        vLineWidth: () => 0,
      },
      margin: [0, 0, 0, 20],
    });
    const tableBody = [
      [{ text: 'Description', style: 'bold' }, { text: 'Price CZK', style: ['bold', 'right'] }],
    ];
    options.hwList.forEach((item) => {
      const descr = [{
        text: [
          { text: 'Category: ', style: 'italics' },
          { text: `${item.category} (${item.condition})`, style: { font: 'OpenSans' } },
        ],
      }];
      if (item.description) {
        descr.push({ text: [{ text: 'Specification: ', style: 'italics' }, item.description] });
      }
      if (item.serial_id) {
        descr.push({ text: [{ text: 'Serial ID: ', style: 'italics' }, item.serial_id] });
      }
      const purchase = [
        { text: 'Purchased in ', style: 'italics' },
        item.store,
        { text: ' on ', style: 'italics' },
        item.purchase_date,
        { text: ' for (CZK) ', style: 'italics' },
        formatPrice(item.purchase_price),
      ];
      if (item.store_invoice_id) {
        purchase.push({ text: ' with invoice ID ', style: 'italics' }, item.store_invoice_id);
      }
      descr.push({ text: purchase });
      const price = { text: formatPrice(item.amount), style: 'right' };
      tableBody.push([descr, price]);
    });
    if (options.includeKey) {
      tableBody.push([{ text: 'Office key', style: { font: 'OpenSans' } }, '']);
    }
    document.content.push({
      style: 'table',
      table: {
        widths: ['*', 40],
        headerRows: 1,
        body: tableBody,
      },
      layout: {
        hLineWidth: (i) => (i === 1 ? 0.5 : 0),
        vLineWidth: () => 0,
      },
      margin: [0, 0, 0, 20],
    });
    const dateArr = options.date.split('-');
    document.content.push({
      text: `In Prague, on ${monthMap[dateArr[1]]} ${parseInt(dateArr[2], 10)}, ${dateArr[0]}.`,
      margin: [0, 0, 0, 60],
    });
    const signitures = {
      giving: {},
      receiving: {},
    };
    signitures[(options.type === 'hw_buy' ? 'receiving' : 'giving')] = { text: options.user.name };
    signitures[(options.type === 'hw_buy' ? 'giving' : 'receiving')] = { text: 'Salsita s.r.o.' };
    document.content.push({
      table: {
        widths: [40, '*', 40, '*', 40],
        headerRows: 1,
        body: [[
          { text: '', style: 'signature', border: [false, false, false, false] },
          { text: signitures.giving, style: 'signature', border: [false, true, false, false] },
          { text: '', style: 'signature', border: [false, false, false, false] },
          { text: signitures.receiving, style: 'signature', border: [false, true, false, false] },
          { text: '', style: 'signature', border: [false, false, false, false] },
        ]],
      },
      layout: {
        hLineWidth: (i) => (!i ? 0.5 : 0),
        vLineWidth: () => 0,
      },
    });
  } else {
    // invoice
    document.content.push({ text: 'Invoice data (for copy-paste)', style: 'title', margin: [0, 0, 0, 20] });
    const parties = {
      buying: [
        { text: 'Issued for:', style: 'bold' },
        { text: options.user.name },
        { text: '... address here ...', style: 'italics' },
      ],
      selling: [
        { text: 'Issued by:', style: 'bold' },
        { text: 'Salsita s.r.o.' },
        { text: 'Štefánikova 18/25' },
        { text: '15000, Prague 5' },
        { text: 'Czech Republic' },
      ],
    };
    document.content.push({
      table: {
        widths: [40, '*', 40, '*', 40],
        headerRows: 1,
        body: [['', parties.buying, '', parties.selling, '']],
      },
      layout: {
        hLineWidth: () => 0,
        vLineWidth: () => 0,
      },
      margin: [0, 0, 0, 20],
    });
    const tableBody = [[
      { text: 'Description', style: 'bold', border: [false, false, false, true] },
      { text: 'Price CZK (tax incl.)', style: ['bold', 'right'], border: [false, false, false, true] },
    ]];
    let invoiceTotal = 0;
    options.hwList.forEach((item) => {
      const descr = [{
        text: [
          { text: 'Category: ', style: 'italics' },
          { text: `${item.category} (${item.condition})`, style: { font: 'OpenSans' } },
        ],
      }];
      if (item.description) {
        descr.push({ text: [{ text: 'Specification: ', style: 'italics' }, item.description] });
      }
      if (item.serial_id) {
        descr.push({ text: [{ text: 'Serial ID: ', style: 'italics' }, item.serial_id] });
      }
      const purchase = [
        { text: 'Purchased in ', style: 'italics' },
        item.store,
        { text: ' on ', style: 'italics' },
        item.purchase_date,
        { text: ' for (CZK) ', style: 'italics' },
        formatPrice(item.purchase_price),
      ];
      if (item.store_invoice_id) {
        purchase.push({ text: ' with invoice ID ', style: 'italics' }, item.store_invoice_id);
      }
      descr.push({ text: purchase });
      const price = { text: formatPrice(item.amount), style: 'right', border: [false, false, false, false] };
      tableBody.push([{ stack: descr, border: [false, false, false, false] }, price]);
      invoiceTotal += item.amount;
    });
    tableBody.push([
      { text: '', border: [false, false, false, false] },
      { text: 'Total CZK (tax incl.)', style: ['bold', 'right'], border: [false, false, false, false] },
    ]);
    tableBody.push([
      { text: '', border: [false, false, false, false] },
      { text: formatPrice(invoiceTotal), style: 'right', border: [false, true, false, false] },
    ]);
    document.content.push({
      style: 'table',
      table: {
        widths: ['*', 75],
        headerRows: 1,
        body: tableBody,
      },
      layout: {
        hLineWidth: () => 0.5,
        vLineWidth: () => 0,
      },
      margin: [0, 0, 0, 20],
    });
    const dateArr = options.date.split('-');
    document.content.push({
      text: `In Prague, on ${monthMap[dateArr[1]]} ${parseInt(dateArr[2], 10)}, ${dateArr[0]}.`,
      margin: [0, 0, 0, 60],
    });
  }

  // generating the PDF document
  const filename = `${config.pdf.outputDir}/${options.date.split('-').join('')}-${options.user.name.split(' ').join('_')}-${actionMap[options.type]}.pdf`;
  try {
    const pdfDoc = pdfPrinter.createPdfKitDocument(document);
    const stream = fs.createWriteStream(filename, { mode: '0644' });
    let failed = false;
    stream.on('error', (e) => {
      logger.error('[generatePdf]: an error occured while generating the protocol!');
      logger.error(e.message);
      failed = true;
      resolve();
    });
    stream.on('close', () => {
      if (!failed) {
        spawn('open', [filename], { detached: true, shell: true });
        resolve();
      }
    });
    pdfDoc.pipe(stream);
    pdfDoc.end();
  } catch (e) {
    logger.error('[generatePdf]: an error occured while generating the protocol!');
    logger.error(e.message);
    resolve();
  }
});

module.exports = {
  generatePdf,
  setLogger,
};

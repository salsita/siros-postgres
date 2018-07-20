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
  hw_repurchase: 'invoice',
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
          style: ['footer', { alignment: 'right' }],
        },
      ],
    }),
    content: [],
    defaultStyle: {
      font: 'OpenSans',
      fontSize: 9,
    },
    styles: {
      footer: { font: 'OpenSansLight', fontSize: 8 },
      title: {
        font: 'OpenSansSemi',
        fontSize: 16,
        bold: true,
        margin: [0, 0, 0, 20],
      },
      subtitle: { bold: true },
    },
  };
  if (options.type !== 'hw_repurchase') {
    document.content.push({ text: 'Handover protocol', style: 'title' });
    const parties = {
      giving: [{ text: 'Handed over by:', style: 'subtitle' }],
      receiving: [{ text: 'Taken over by:', style: 'subtitle' }],
    };
    parties[(options.type === 'hw_buy' ? 'receiving' : 'giving')].push({ text: options.user.name });
    parties[(options.type === 'hw_buy' ? 'giving' : 'receiving')].push(
      { text: 'Salsita s.r.o.' },
      { text: 'Štefánikova 18/25' },
      { text: '15000, Prague 5' },
      { text: 'Czech Republic' },
    );
    document.content.push({
      columns: [parties.giving, parties.receiving],
      columnGap: 10,
      margin: [0, 0, 0, 20],
    });
    document.content.push({ text: 'table here' });
  } else {
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

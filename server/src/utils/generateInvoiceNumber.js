exports.generateInvoiceNumber = () => {
  const romanNumber = [
    'I',
    'II',
    'III',
    'IV',
    'V',
    'VI',
    'VII',
    'VIII',
    'X',
    'XI',
    'XII',
  ];
  const d = new Date();

  let month = d.getMonth();
  let year = d.getFullYear();

  return `${parseInt(Math.random().toString().slice(3, 8)) + 1}/INV/${
    romanNumber[month]
  }/${year}`;
};

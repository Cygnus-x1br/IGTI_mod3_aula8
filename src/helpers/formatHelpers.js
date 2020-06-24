const formater = Intl.NumberFormat('pt-BR');

function formatNumber(value) {
  return formater.format(value);
}

export { formatNumber };

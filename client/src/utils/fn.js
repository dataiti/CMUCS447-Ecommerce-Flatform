export function convertToArrayLength(length) {
  return Array(length).fill("");
}

export const numberWithCommas = (num) =>
  num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export const getTotal = (product) => {
  let totalQuantity = 0;
  let totalPrice = 0;
  product.forEach((item) => {
    totalQuantity += item.quantity;
    totalPrice += item.price * item.quantity;
  });
  return { totalQuantity, totalPrice };
};

export const convertVNDtoUSD = (price) =>
  (parseFloat(price) * 0.00004).toFixed(2);

export const covertToDate = (dateString) => {
  const date = new Date(Date.parse(dateString));
  const formattedDate = `${date.getDate()}-${
    date.getMonth() + 1
  }-${date.getFullYear()}`;

  return formattedDate;
};

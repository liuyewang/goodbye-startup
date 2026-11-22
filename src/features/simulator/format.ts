function createFormat(locale: string): {
  money: (cents: number) => string;
  percent: (rate: number) => string;
} {
  const currency = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
  });
  const percentage = new Intl.NumberFormat(locale, {
    style: "percent",
    maximumSignificantDigits: 21,
  });
  const tinyPercentage = new Intl.NumberFormat(locale, {
    style: "percent",
    notation: "scientific",
    maximumSignificantDigits: 4,
  });
  return {
    money: (cents) => currency.format(cents / 100),
    percent: (rate) =>
      rate > 0 && rate < 1e-8
        ? tinyPercentage.format(rate)
        : percentage.format(rate),
  };
}

/** Keep the current and historical assumptions in the same localized format. */
export const simulationFormat = {
  en: createFormat("en-US"),
  zh: createFormat("zh-CN"),
};

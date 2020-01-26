export const mockCities = [`Amsterdam`, `Geneva`, `Chamonix`, `Saint Petersburg`];
export const menuNames = [`Table`, `Stats`];
export const filterNames = [`everything`, `future`, `past`];
export const offerTypes = [
  {
    name: `Transfer`,
    types: [
      `taxi`,
      `bus`,
      `train`,
      `ship`,
      `transport`,
      `drive`,
      `flight`
    ]
  },
  {
    name: `Activity`,
    types: [
      `check-in`,
      `sightseeing`,
      `restaurant`
    ]
  }
];

export const dummyPoint = {
  id: Number.NaN,
  destination: {name: ``},
  offers: [],
  basePrice: 0,
  isFavorite: false,
  dateFrom: new Date(),
  dateTo: new Date(+(new Date()) + 600000),
  type: offerTypes[0][`types`][0]
};

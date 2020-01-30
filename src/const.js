export const mockCities = [`Amsterdam`, `Geneva`, `Chamonix`, `Saint Petersburg`];
export const menuNames = [`Table`, `Stats`];
export const MenuItem = menuNames.reduce((obj, name) =>
  Object.assign(obj, {[name.toUpperCase()]: name}), {}
);
export const filterNames = [`everything`, `future`, `past`];
export const offerTypes = new Map([
  [
    `Transfer`,
    [
      `taxi`,
      `bus`,
      `train`,
      `ship`,
      `transport`,
      `drive`,
      `flight`
    ]
  ],
  [
    `Activity`,
    [
      `check-in`,
      `sightseeing`,
      `restaurant`
    ]
  ]
]);
/*
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
*/
export const offerTypesEmoji = {
  taxi: String.fromCodePoint(`0x1F695`),
  bus: String.fromCodePoint(`0x1F68C`),
  train: String.fromCodePoint(`0x1F686`),
  ship: String.fromCodePoint(`0x1F6F3`),
  transport: String.fromCodePoint(`0x1F69D`),
  drive: String.fromCodePoint(`0x1F697`),
  flight: String.fromCodePoint(`0x1F6EB`),
  [`check-in`]: String.fromCodePoint(`0x1F3E8`),
  sightseeing: String.fromCodePoint(`0x1F5FC`),
  restaurant: String.fromCodePoint(`0x1F37D`)
};

export const dummyPoint = {
  id: Number.NaN,
  destination: {name: ``},
  offers: [],
  basePrice: 0,
  isFavorite: false,
  dateFrom: new Date(),
  dateTo: new Date(+(new Date()) + 600000),
  type: offerTypes.values().next
};

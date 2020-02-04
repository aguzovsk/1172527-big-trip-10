const destinations = new Map();

const addToDestinations = (places, datum) => {
  return places.set(datum.name, datum);
};

export default class Destinations {
  constructor() {
    throw new Error(`Can't instantiate Destinations, use getInstamce method.`);
  }

  getInstance() {
    return destinations;
  }

  static parseDestinations(data) {
    return data.reduce(addToDestinations, destinations);
  }
}

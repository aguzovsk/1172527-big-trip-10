import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import AbstractSmartComponent from '../abstract-smart-component';
import {offerTypesEmoji, offerTypes} from '../../const';
import {computeDuration} from '../../utils/date-utils';

const getRandomColor = () => {
  const value = Math.floor(Math.random() * 0xffffff);

  return `#${value.toString(16)}`;
};

const getProxy = (defaultValue = 0) => {
  return new Proxy({}, {
    get(target, prop) {
      if (prop in target) {
        return target[prop];
      } else {
        return defaultValue;
      }
    },

    ownKeys(target) {
      return Reflect.ownKeys(target);
    }
  });
};

const renderMoneyChart = (ctx, points) => {
  const moneys = points.reduce((obj, point) => {
    const type = point.type;
    obj[type] = obj[type] + point.basePrice;
    return obj;
  }, getProxy());

  const types = Object.keys(moneys);
  const backgroundColors = types.map(getRandomColor);
  const dataLabels = types.map((type) => `${type} ${offerTypesEmoji[type]}`);

  const chart = new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: dataLabels,
      datasets: [{
        data: types.map((type) => moneys[type]),
        backgroundColor: backgroundColors
      }]
    },
    options: {
      title: {
        display: true,
        position: `left`,
        text: `Money`,
        fontSize: 32,
      },
      legend: {
        position: `left`,
        display: false,
      },
      plugins: {
        datalabels: {
          color: `white`,
          anchor: `end`,
          align: `start`,
          font: {
            size: 20,
          },
          formatter: (value) => `${String.fromCodePoint(`0x20AC`)} ${value}`,
        }
      },
      tooltips: {
        // mode: `point`,
        callbacks: {
          labelColor(tooltipItem) {
            return {
              borderColor: `white`,
              backgroundColor: backgroundColors[tooltipItem.index]
            };
          },
          labelTextColor() {
            // return backgroundColors[tooltipItem.index];
            return `white`;
          }
        }
      },
      scales: {
        xAxes: [{
          ticks: {
            beginAtZero: true,
            autoSkip: false,
          }
        }]
      }
    }
  });

  return chart;
};

const renderTransportChart = (ctx, points) => {
  const counts = points.reduce((obj, point) => {
    const type = point.type;
    const transport = offerTypes.get(`Transfer`);
    if (transport.indexOf(type) !== -1) {
      obj[type] = obj[type] + 1;
    }
    return obj;
  }, getProxy());

  const types = Object.keys(counts);
  const backgroundColors = types.map(getRandomColor);
  const dataLabels = types.map((type) => `${type} ${offerTypesEmoji[type]}`);

  const chart = new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: dataLabels,
      datasets: [{
        data: types.map((type) => counts[type]),
        backgroundColor: backgroundColors
      }]
    },
    options: {
      title: {
        display: true,
        position: `left`,
        text: `Transport`,
        fontSize: 32,
      },
      legend: {
        position: `left`,
        display: false,
      },
      plugins: {
        datalabels: {
          color: `white`,
          anchor: `end`,
          align: `start`,
          font: {
            size: 20,
          },
          formatter: (value) => `${value}x`,
        }
      },
      scales: {
        xAxes: [{
          ticks: {
            beginAtZero: true,
            autoSkip: false,
          }
        }],
      }
    }
  });

  return chart;
};

const renderTimeChart = (ctx, points) => {
  const durations = points.reduce((obj, point) => {
    const type = point.type;
    const pointDuration = computeDuration(point.dateFrom, point.dateTo);
    if (!obj[type]) {
      obj[type] = pointDuration;
    } else {
      obj[type] = obj[type].add(pointDuration);
    }
    return obj;
  }, {});

  const types = Object.keys(durations);
  const backgroundColors = types.map(getRandomColor);
  const dataLabels = types.map((type) => `${type} ${offerTypesEmoji[type]}`);

  const chart = new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: dataLabels,
      datasets: [{
        data: types.map((type) => durations[type].hours()),
        backgroundColor: backgroundColors
      }]
    },
    options: {
      title: {
        display: true,
        position: `left`,
        text: `Time spent`,
        fontSize: 32,
      },
      legend: {
        position: `left`,
        display: false,
      },
      plugins: {
        datalabels: {
          color: `white`,
          anchor: `end`,
          align: `start`,
          font: {
            size: 20,
          },
          formatter: (value) => `${value}H`,
        }
      },
      scales: {
        xAxes: [{
          // type: `time`,
          // time: {
          //   unit: `hour`
          // },
          ticks: {
            beginAtZero: true,
            autoSkip: false,
          }
        }],
      }
    }
  });

  return chart;
};

const statisticsTemplate = () => {
  return (
    `<section class="statistics">
      <h2 class="">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`
  );
};

export default class StatisticsComponent extends AbstractSmartComponent {
  constructor(pointModel) {
    super();

    this._pointModel = pointModel;

    this._moneyChart = null;
    this._transportChart = null;
    this._timeChart = null;

    this._onFilterChangeHandler = this._onFilterChangeHandler.bind(this);
    pointModel.addOnFilterChangeHandler(this._onFilterChangeHandler);
  }

  getTemplate() {
    return statisticsTemplate();
  }

  show() {
    super.show();

    this.rerender();
  }

  rerender() {
    super.rerender();

    if (this._isVisible) {
      this._renderCharts();
    }
  }

  recoveryListeners() {}

  // rerender(points) {
  //   this._points = points
  // }

  _renderCharts() {
    const element = this.getElement();
    const points = this._pointModel.getPoints();

    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeCtx = element.querySelector(`.statistics__chart--time`);

    this._resetCharts();

    this._moneyChart = renderMoneyChart(moneyCtx, points);
    this._transportChart = renderTransportChart(transportCtx, points);
    this._timeChart = renderTimeChart(timeCtx, points);
  }

  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }

    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }

    if (this._timeChart) {
      this._timeChart.destroy();
      this._timeChart = null;
    }
  }

  _onFilterChangeHandler() {
    if (this._isVisible) {
      this.rerender();
    }
  }
}

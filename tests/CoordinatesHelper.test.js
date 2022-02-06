import {
  getIntersection,
  reformatCoordinates,
} from '~/helpers/CoordinatesHelper.tsx';

const isochronesCoordinates = [
  {
    coordinates: [
      [
        [
          [-122.520217, 45.535693],
          [-122.64038, 45.553967],
          [-122.720031, 45.526554],
          [-122.669906, 45.507309],
          [-122.723464, 45.446643],
          [-122.532577, 45.408574],
          [-122.487258, 45.477466],
          [-122.520217, 45.535693],
        ],
      ],
    ],
    reformattedCoordinates: ['...'],
  },
  {
    coordinates: [
      [
        [
          [-122.801742, 45.48565],
          [-122.801742, 45.60491],
          [-122.584762, 45.60491],
          [-122.584762, 45.48565],
          [-122.801742, 45.48565],
        ],
      ],
    ],
    reformattedCoordinates: ['...'],
  },
];

test('intersection of multiPolygon should not be null', () => {
  expect(getIntersection(isochronesCoordinates)).not.toBeNull();
});

const apiReturn = [
  [
    [
      [2.3043119815, 48.8281774604],
      [2.8, 48.9],
    ],
  ],
];

const reformattedApiReturn = [
  [
    [
      {
        longitude: 2.3043119815,
        latitude: 48.8281774604,
      },
      {
        longitude: 2.8,
        latitude: 48.9,
      },
    ],
  ],
];

test('reformat Api return', () => {
  expect(reformatCoordinates(apiReturn)).toStrictEqual(reformattedApiReturn);
});

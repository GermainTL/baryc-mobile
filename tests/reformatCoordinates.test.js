import { reformatCoordinates } from "~/helpers/API/NavitiaAPI.tsx";

const apiReturn = [
                     [
                        [
                           [
                              2.3043119815,
                              48.8281774604
                           ],
                           [
                                2.8,
                                48.9
                           ]
                        ]
                     ]
                  ]

const reformattedApiReturn = [
                                [
                                    [
                                        {
                                            longitude : 2.3043119815,
                                            latitude : 48.8281774604
                                        },
                                        {
                                          longitude:  2.8,
                                          latitude: 48.9
                                        }
                                    ]
                                ]
                              ]


test('reformat Api return', () => {
    expect(reformatCoordinates(apiReturn)).toStrictEqual(reformattedApiReturn)
});
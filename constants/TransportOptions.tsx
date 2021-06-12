import { Icon } from "react-native-elements";
import React from "react";
import palette from "~/constants/Colors.ts";

export default (selectedValue) => {
    return [
        {
            value: "walking",
            displayValue:
                <Icon
                    name="walk-outline"
                    type="ionicon"
                    color={ selectedValue === 'walking' ? palette.orangeLight : palette.greyDark }
                />
        },
        {
            value: "cycling",
            displayValue:
                <Icon
                    name="bicycle-outline"
                    type="ionicon"
                    color={ selectedValue === 'cycling' ? palette.orangeLight : palette.greyDark }
                />
        },
        {
            value: "transport",
            displayValue:
                <Icon
                    name="train-outline"
                    type="ionicon"
                    color={ selectedValue === 'transport' ? palette.orangeLight : palette.greyDark }
                />
        }
    ]
}
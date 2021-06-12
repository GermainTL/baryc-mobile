import { Icon } from "react-native-elements";
import React from "react";
import palette from "~/constants/Colors.ts";

export default [
        {
            value: "walk",
            displayValue:
                <Icon
                    name="walk-outline"
                    type="ionicon"
                    color={ palette.greyDark }
                />
        },
        {
            value: "transport",
            displayValue:
                <Icon
                    name="train-outline"
                    type="ionicon"
                    color={ palette.greyDark }
                />
        }
]
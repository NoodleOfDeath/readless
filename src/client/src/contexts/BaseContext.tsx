import { ConsumptionMode } from "@/components/Post";
import React, { createContext, useState } from "react";

type Props = {
  children: React.ReactNode;
};

type BaseContextType = {
  consumptionMode: ConsumptionMode;
  setConsumptionMode: (consumptionMode: ConsumptionMode) => void;
};

export const DEFAULT_BASE_CONTEXT: BaseContextType = {
  consumptionMode: "cursory",
  setConsumptionMode: () => {
    /** placeholder */
  },
};

export const BaseContext = /*#__PURE__*/ createContext(DEFAULT_BASE_CONTEXT);

export default function BaseContextProvider({ children }: Props) {
  const [consumptionMode, setConsumptionMode] =
    useState<ConsumptionMode>("cursory");
  return /*#__PURE__*/ React.createElement(
    BaseContext.Provider,
    {
      value: {
        consumptionMode,
        setConsumptionMode,
      },
    },
    children
  );
}

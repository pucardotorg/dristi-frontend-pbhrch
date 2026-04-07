import React from "react";

export function transformToCardData<T extends Record<string, unknown>>(
  item: T,
  labelMap?: Record<keyof T, string>
): Record<string, string | JSX.Element> {
  const transformed: Record<string, string | JSX.Element> = {};

  Object.entries(item).forEach(([key, value]) => {
    const label = labelMap?.[key as keyof T] || key;

    // If value is a valid JSX element, retain it
    if (React.isValidElement(value)) {
      transformed[label] = value;
    } else {
      transformed[label] = String(value ?? "");
    }
  });

  return transformed;
}

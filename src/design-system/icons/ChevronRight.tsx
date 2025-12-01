/**
 * ChevronRight Icon
 */

'use client';

import React from "react";
import { Icon, IconProps } from "./Icon";

export function ChevronRight(props: IconProps) {
  return (
    <Icon {...props}>
      <polyline points="9 6 15 12 9 18" />
    </Icon>
  );
}


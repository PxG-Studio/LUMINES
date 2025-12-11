/**
 * Play Icon
 */

'use client';

import React from "react";
import { Icon, IconProps } from "./Icon";

export function PlayIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <polygon points="5 3 19 12 5 21 5 3" />
    </Icon>
  );
}


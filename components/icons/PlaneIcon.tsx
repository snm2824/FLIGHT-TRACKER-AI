import React from 'react';

export const PlaneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M22 16v-2l-8.5-5V3.5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5V9l-8.5 5v2l8.5-2.5V19L7 20.5V22l5-1.5 5 1.5v-1.5L13.5 19v-5.5L22 16z"/>
  </svg>
);

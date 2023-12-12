import React from 'react';

declare namespace ICollapsingHeader {
  interface IProps {
    FixedContent?: React.ReactElement;
    MaxContent?: React.ReactElement;
    MinContent?: React.ReactElement;
    MaxHeight?: number;
    MinHeight?: number;
    children?: React.ReactElement;
  }
}

export {ICollapsingHeader};

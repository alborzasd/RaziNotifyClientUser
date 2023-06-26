import React from 'react';
import {Image as NativeImage} from 'react-native';
// import type {ImageSource} from 'react-native';

type ImageProps = {
  source: any;
  fallbackRequireUri: any;
  [key: string]: any; // allow additional props
};

function Image({source, fallbackRequireUri, ...props}: ImageProps) {
  const [hasError, setHasError] = React.useState(false);

  return (
    <>
      {hasError ? (
        <NativeImage {...props} source={fallbackRequireUri} />
      ) : (
        <NativeImage
          {...props}
          source={source}
          onError={() => setHasError(true)}
        />
      )}
    </>
  );
}

export default Image;

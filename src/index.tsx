import { createRoot } from 'react-dom/client';
import { useMemo, useState, useEffect } from 'react';

import { FieldAppSDK } from '@contentful/app-sdk';
import { GlobalStyles } from '@contentful/f36-components';
import { SDKProvider, useSDK, useFieldValue,  } from '@contentful/react-apps-toolkit';

import './index.css';

const container = document.getElementById('root')!;
const root = createRoot(container);

const RandomFieldID = () => {
  const [counter, resetCounter] = useState(0);
  const [fieldValue, setFieldValue] = useFieldValue();
  const sdk = useSDK<FieldAppSDK>();
  const { lockWhenPublished } = sdk.parameters.instance;
  const isLocked = () => {
    const sys = sdk.entry.getSys();
    const published = !!sys.publishedVersion && sys.version == sys.publishedVersion + 1;
    const changed = !!sys.publishedVersion && sys.version >= sys.publishedVersion + 2;

    return published || changed;
  };
  const randomId = useMemo(() => {
    if (fieldValue && lockWhenPublished && isLocked()) {
      return fieldValue as string;
    }
    const randomNum = Math.floor(Math.random() * 100000) + '';
    const randomString = Math.random().toString(36).substring(2, 7);
    const randDate = Date.now() + '';
    return randomString + randomNum + randDate;
  }, [counter]);
  useEffect(() => {
    if (randomId) {
      setFieldValue(randomId);
    }
  }, [randomId]);

  return (
    <div className="container">
      <input
        width="large"
        id="random-field"
        name="random"
        value={randomId}
        readOnly={true}
        className="disabled"
      />
      {!lockWhenPublished && <button onClick={() => resetCounter(c => c+1)}>reset</button>}
    </div>
  );
}

root.render(
  <SDKProvider>
    <GlobalStyles />
    <RandomFieldID />
  </SDKProvider>
);

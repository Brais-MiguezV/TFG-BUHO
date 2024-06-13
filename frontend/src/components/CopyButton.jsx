import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  return (
    <CopyToClipboard
      text={text}
      onCopy={() => setCopied(true)}
    >
      <button className="copy-button">
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </CopyToClipboard>
  );
};

export default CopyButton;

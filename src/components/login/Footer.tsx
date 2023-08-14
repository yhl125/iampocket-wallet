const Footer = ({ showDisclaimer = false }) => {
  return (
    <div className="m-4">
      {showDisclaimer && (
        <p className="mb-4 border border-yellow-500 border-opacity-40 bg-yellow-900 bg-opacity-5 p-3 text-xs text-yellow-500">
          ⚠️ This is for demo purposes only. Do{' '}
          <span className="font-medium text-yellow-500">not</span> store
          anything of value on your test cloud wallets at this time.
        </p>
      )}
      <p className="text-center text-xs">
        Powered by{' '}
        <a
          href="https://litprotocol.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Lit Protocol
        </a>
      </p>
    </div>
  );
};
export default Footer;

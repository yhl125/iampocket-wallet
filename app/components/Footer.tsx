export default function Footer({ showDisclaimer = false }) {
  return (
    <div className="mt-4">
      {showDisclaimer && (
        <p className="mb-4 border border-yellow-500 border-opacity-40 bg-yellow-900 bg-opacity-5 p-3 text-xs text-yellow-500 sm:mb-6 sm:text-sm">
          ⚠️ This is for demo purposes only. Do{' '}
          <span className="font-medium text-yellow-500">not</span> store
          anything of value on your test cloud wallets at this time.
        </p>
      )}
      <p className="text-base-500 text-center text-xs sm:text-sm">
        Powered by{' '}
        <a
          href="https://litprotocol.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-orange-500"
        >
          Lit Protocol
        </a>
      </p>
    </div>
  );
}

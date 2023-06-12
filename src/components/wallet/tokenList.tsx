import { TokenState } from '@/store/TokenStore';
import Image from 'next/image';
import ethereumSVG from 'public/ethereum-eth-logo.svg';
interface Iprops {
  tokenList: readonly TokenState[];
  ethereumBalance: string;
}
const TokenList = ({ tokenList, ethereumBalance }: Iprops) => {
  return (
    <>
      <div className="token-list">
        <table className="flex table w-full table-auto items-center overflow-scroll">
          <thead style={{ display: 'none' }}>
            <tr>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {ethereumBalance == undefined ? (
              <tr></tr>
            ) : (
              <tr>
                <td>
                  <div className="placeholder avatar">
                    <div className="w-12 rounded-full border-2 bg-neutral-focus text-neutral-content">
                      <Image src={ethereumSVG} alt={'eth'} />
                    </div>
                  </div>
                </td>
                <td>ETH</td>
                <td>{ethereumBalance.substring(0, 5)}</td>
              </tr>
            )}
            {tokenList.map((token: TokenState, idx: number) => (
              <tr key={idx}>
                <td>
                  <div className="placeholder avatar">
                    <div className="w-12 rounded-full border-2 bg-neutral-focus text-neutral-content">
                      <span>{/* asset image */}</span>
                    </div>
                  </div>
                </td>
                <td>{token.tokenSymbol}</td>
                <td>{token.balance.substring(0, 5)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TokenList;

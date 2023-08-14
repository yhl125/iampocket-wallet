import TokenStore, { TokenState } from '@/store/TokenStore';
import { erc20BalanceToReadable } from '@/utils/ERC20Util';
import Image from 'next/image';
import { useSnapshot } from 'valtio';

const TokenList = () => {
  const { tokenList } = useSnapshot(TokenStore.tokenListState);
  if (tokenList.length === 0) {
    return <div>You have no balance on Tokens Try to add one with Deposit</div>;
  } else {
    return (
      <>
        <div className="token-list">
          <table className="table flex w-full table-auto items-center overflow-scroll">
            <thead style={{ display: 'none' }}>
              <tr>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tokenList.map((token: TokenState, idx: number) => (
                <tr key={idx}>
                  <td>
                    <div className="avatar placeholder">
                      <div className="w-12 rounded-full border-2 bg-neutral-focus text-neutral-content">
                        <Image src={token.logoUrl} alt="" fill />
                      </div>
                    </div>
                  </td>
                  <td>{token.symbol}</td>
                  <td>
                    {erc20BalanceToReadable(token.balance, token.decimals)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }
};

export default TokenList;

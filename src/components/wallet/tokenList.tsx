import { EIP155_CHAINS } from '@/data/EIP155Data';
import TokenStore, { IResponseToken } from '@/store/TokenStore';
import { erc20BalanceToReadable } from '@/utils/ERC20Util';
import Image from 'next/image';
import { useSnapshot } from 'valtio';
import TokenImage from '../commons/TokenImage';

function TokenList() {
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
              {tokenList.map((token: IResponseToken, idx: number) => {
                // console.log(token);
                return (
                  <tr key={idx}>
                    <td>
                      <div className="indicator">
                        <span className="badge indicator-item absolute p-0">
                          <Image
                            src={EIP155_CHAINS[`eip155:${token.chainId}`].logo}
                            width={20}
                            height={20}
                            alt={'chain logo'}
                            className="mask mask-circle"
                          />
                        </span>
                        <div className="avatar placeholder">
                          <div className="relative w-12 rounded-full border-2 bg-neutral-focus text-neutral-content">
                            <TokenImage
                              logoUrl={token.logoUrl}
                              address={token.address}
                            />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{token.symbol}</td>
                    <td>
                      {erc20BalanceToReadable(token.balance, token.decimals)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </>
    );
  }
}

export default TokenList;

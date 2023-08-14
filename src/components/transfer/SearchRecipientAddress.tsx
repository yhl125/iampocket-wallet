import { ethers } from "ethers";
import { Dispatch, SetStateAction } from "react";

interface Props {
  setVerifyAddress: Dispatch<SetStateAction<Boolean>>;
  setRecipientAddressOrEns: Dispatch<SetStateAction<string>>;
}

const SearchRecipientAddress = ({
  setVerifyAddress,
  setRecipientAddressOrEns,
}: Props) => {
  const checkRecipientAddress = (recipientAddress: string): Boolean => {
    if (recipientAddress != '') {
      const isAddressVerified = ethers.utils.isAddress(recipientAddress);
      return isAddressVerified;
    } else return false;
  };

  return (
    <div className="p-2 mt-2">
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Send to</span>
        </label>
        <input
          onChange={(e: any) => {
            setVerifyAddress(checkRecipientAddress(e.target.value));
            setRecipientAddressOrEns(e.target.value);
          }}
          type="text"
          placeholder="Address(0x),ENS"
          className="input input-bordered w-full max-w-xs"
        />
      </div>
    </div>
  );
};

export default SearchRecipientAddress;

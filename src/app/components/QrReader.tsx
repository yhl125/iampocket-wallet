// import dynamic from "next/dynamic";
import Image from "next/image";
import { Fragment, useState } from "react";
import { QrReader as ReactQrReader } from "react-qr-reader";
import { Loading } from "@/components/Loading";

/**
 * You can use normal import if you are not within next / ssr environment
 * @info https://nextjs.org/docs/advanced-features/dynamic-import
 */
// const ReactQrReader = dynamic(() => import('react-qr-reader'), { ssr: false })

/**
 * Types
 */
interface IProps {
  onConnect: (uri: string) => Promise<void>;
}

/**
 * Component
 */
export default function QrReader({ onConnect }: IProps) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  function onError() {
    setShow(false);
  }

  async function onScan(data: string | null) {
    if (data) {
      await onConnect(data);
      setShow(false);
    }
  }

  function onShowScanner() {
    setLoading(true);
    setShow(true);
  }

  return (
    <div className="container">
      {show ? (
        <Fragment>
          {loading && <Loading />}
          <div className="qrVideoMask">
            <ReactQrReader
              onResult={(result, error) => {
                // if result is not null or undefined
                if (!!result) {
                  onScan(result.getText());
                }

                if (!!error) {
                  onError;
                }
              }}
              videoStyle={{ width: "100%" }}
              constraints={{ facingMode: "user" }}
            />
          </div>
        </Fragment>
      ) : (
        <div className="qrPlaceholder container">
          <Image
            src="/icons/qr-icon.svg"
            width={100}
            height={100}
            alt="qr code icon"
            className="qrIcon"
          />
          <button className="btn" onClick={onShowScanner}>
            Scan QR code
          </button>
        </div>
      )}
    </div>
  );
}

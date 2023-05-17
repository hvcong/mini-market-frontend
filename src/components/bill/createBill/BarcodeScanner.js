import { Howl } from "howler";
import React, { useEffect } from "react";
import { useRef } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import qrAudioUrl from "../../../assets/files/qr_audio.mp3";
import Webcam from "react-webcam";
import { message } from "antd";

var sound = new Howl({
  src: [qrAudioUrl],
  html5: true,
});

function BarcodeScanner({ onScanned, isShowWebCam }) {
  const [data, setData] = React.useState(null);
  const [torchOn, setTorchOn] = React.useState(false);

  useEffect(() => {
    if (data) {
      sound.play();
      onScanned(data);
      setTimeout(() => {
        setData(null);
      }, 2000);
    }

    return () => {};
  }, [data]);

  return (
    <>
      {isShowWebCam && <Webcam className="webcamera" />}
      <div className="barcode_container">
        <BarcodeScannerComponent
          width={500}
          height={500}
          torch={torchOn}
          onUpdate={(err, result) => {
            if (result) {
              if (data != result.text) {
                setData(result.text);
              }
            }
          }}
        />
      </div>
    </>
  );
}

export default BarcodeScanner;

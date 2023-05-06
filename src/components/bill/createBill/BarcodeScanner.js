import { Howl } from "howler";
import React, { useEffect } from "react";
import { useRef } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import qrAudioUrl from "../../../assets/files/qr_audio.mp3";

var sound = new Howl({
  src: [qrAudioUrl],
  html5: true,
});

function BarcodeScanner({ onScanned }) {
  const [data, setData] = React.useState(null);
  const [torchOn, setTorchOn] = React.useState(false);

  if (data) {
    sound.play();
    onScanned(data);
  }

  // useEffect(() => {
  //   setTimeout(() => {
  //     sound.play();
  //     onScanned("22222");
  //   }, 2000);
  //   return () => {};
  // }, []);

  return (
    <div className="barcode_container">
      {/* <Webcam ref={camRef} /> */}
      <BarcodeScannerComponent
        width={10}
        height={10}
        torch={torchOn}
        onUpdate={(err, result) => {
          if (result) setData(result.text);
          else setData(null);
        }}
      />
    </div>
  );
}

export default BarcodeScanner;

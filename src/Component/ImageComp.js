import React, { useRef, useState } from "react";
import { Tooltip, Image } from "antd";
import "../App.css";

// import { MDCCircularProgress } from '@material/circular-progress';
export default function ImageComponent({ objs, url }) {
  const imageRef = useRef(null);
  const [load, stateLoad] = useState(false);

  const [backdropOpen, setBackdropOpen] = useState(false);
  const bImageRef = useRef(null);
  const [bLoad, stateBLoad] = useState(false);

  console.log(objs);

  const makeBoxPoints = () => {
    // // console.log(imageDetail)
    // if(imageDetail.objects === undefined || imageDetail.object === null ){
    //     // console.log("Not Ai")
    //     return (<></>)
    // }

    return objs.map((object) => {
      // console.log(document.getElementById(url).client);
      var boxPoints = object.box_points;
      var newBoxPoints = {
        left:
          imageRef.current.offsetLeft +
          (boxPoints[0] * imageRef.current.width) /
            imageRef.current.naturalWidth +
          "px",
        top:
          imageRef.current.offsetTop +
          (boxPoints[1] * imageRef.current.height) /
            imageRef.current.naturalHeight +
          "px",
        width:
          ((boxPoints[2] - boxPoints[0]) * imageRef.current.width) /
            imageRef.current.naturalWidth +
          "px",
        height:
          ((boxPoints[3] - boxPoints[1]) * imageRef.current.height) /
            imageRef.current.naturalHeight +
          "px",
      };
      return (
        <Tooltip key={boxPoints[0]} title={object.name} placement="top" arrow>
          <div
            style={{
              border: "2px solid red",
              position: "absolute",
              left: newBoxPoints.left,
              top: newBoxPoints.top,
              width: newBoxPoints.width,
              height: newBoxPoints.height,
              zIndex: 10,
            }}
            className="ai-boxpoints"
          ></div>
        </Tooltip>
      );
    });
  };

  const boxPoints = () => {
    // // console.log(imageDetail)
    // if(imageDetail.objects === undefined || imageDetail.object === null ){
    //     // console.log("Not Ai")
    //     return (<></>)
    // }

    return objs.map((object) => {
      // console.log(document.getElementById(url).client);
      var boxPoints = object.box_points;
      var newBoxPoints = {
        left:
          bImageRef.current.offsetLeft +
          (boxPoints[0] * bImageRef.current.width) /
            bImageRef.current.naturalWidth +
          "px",
        top:
          bImageRef.current.offsetTop +
          (boxPoints[1] * bImageRef.current.height) /
            bImageRef.current.naturalHeight +
          "px",
        width:
          ((boxPoints[2] - boxPoints[0]) * bImageRef.current.width) /
            bImageRef.current.naturalWidth +
          "px",
        height:
          ((boxPoints[3] - boxPoints[1]) * bImageRef.current.height) /
            bImageRef.current.naturalHeight +
          "px",
      };
      return (
        <Tooltip key={boxPoints[0]} title={object.name} placement="top" arrow>
          <div
            style={{
              border: "2px solid red",
              position: "absolute",
              left: newBoxPoints.left,
              top: newBoxPoints.top,
              width: newBoxPoints.width,
              height: newBoxPoints.height,
              zIndex: 10,
            }}
            className="ai-boxpoints"
          ></div>
        </Tooltip>
      );
    });
  };

  return (
    <div>
      <img
        onLoad={() => {
          stateLoad(true);
        }}
        ref={imageRef}
        className="px-2"
        width={350}
        src={url}
      />
      {/* <Backdrop open={backdropOpen}>
              <img onLoad={() => {stateBLoad(true)}} ref={bImageRef} className='px-2' height={'100%'} src={url} />
            </Backdrop> */}
      {/* <Image className='px-2' width={400} src={url} /> */}

      {/* {console.log("REFFFFFF:  ", imageRef)} */}
      {load ? makeBoxPoints() : <></>}
      {bLoad && backdropOpen ? boxPoints() : <></>}
    </div>
  );
}

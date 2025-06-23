import { useState, useRef } from "react";
import useOutsideClick from ".";

export default function UseOnclickOutsideTest() {
  const [showContent, setShowContent] = useState(false);
  const ref = useRef();
  useOutsideClick(ref, () => setShowContent(false));
  return (
    <div ref={ref}>
      {showContent ? (
        <div>
          <h1>This is a random content</h1>
          <p>
            Please click outside to close this. It won't close if you click
            inside of this content
          </p>
        </div>
      ) : (
        <button onClick={() => setShowContent(true)}>Show Content</button>
      )}
    </div>
  );
}

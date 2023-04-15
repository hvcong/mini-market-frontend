import React, { useEffect, useState } from "react";

function getText() {
  let date = new Date();
  let text = "";
  let hh = date.getHours();

  if (hh < 9) {
    text = "Chào buổi sáng ";
    return text;
  }
  text = "Xin chào ";
  return text;
}

const TalkWithUser = () => {
  const [text, setText] = useState("");

  useEffect(() => {
    let id = setInterval(() => {
      setText(getText());
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, []);

  return <div className="hellow_text">{text}</div>;
};

export default TalkWithUser;

import React from "react";
import Item from "./Item";

const List = () => {
  return (
    <div className="container">
      <div className="row">
        <Item
          title="Practice Javascript"
          lang="javascript"
          banner="https://picsum.photos/1200/800"
        />
        {/* <Item
          title="Practice CSS"
          lang="css"
          banner="https://picsum.photos/1201/800"
        />
        <Item
          title="Practice HTML"
          lang="html"
          banner="https://picsum.photos/1202/800"
        /> */}
      </div>
    </div>
  );
};

export default List;

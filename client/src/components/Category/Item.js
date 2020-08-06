import React from "react";
import { Link } from "react-router-dom";
import classes from "./style.module.scss";

const Item = ({ title, lang, banner }) => {
  return (
    <div className="col-sm-4">
      <div className={classes.item}>
        <div className={classes.banner}>
          <img src={banner} alt="" />
        </div>
        <h2>
          <Link to={`/${lang}`}>{title} </Link>
        </h2>
      </div>
    </div>
  );
};

export default Item;

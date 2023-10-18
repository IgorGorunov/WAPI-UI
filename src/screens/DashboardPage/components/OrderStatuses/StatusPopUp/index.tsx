import React from "react";
import { StatusType } from "../index";
import classes from "./StatusPopUp.module.scss";

type PopupPropsType = {
  innerStatuses: StatusType[];
};

const StatusPopup: React.FC<PopupPropsType> = ({ innerStatuses }) => {
  return (
    <div className={classes.wrapper}>
      <ul className={classes["status-list"]}>
        {innerStatuses
          .filter((item) => item.ordersCount !== 0)
          .map((item: StatusType, index: number) => (
            <li key={item.status + index} className={classes.status}>
              <p className={classes["status-text"]}>{item.status}</p>
              <p>{item.ordersCount}</p>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default StatusPopup;

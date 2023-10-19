import React from "react";
import { StatusType } from "../index";
import "./styles.scss";

type PopupPropsType = {
  innerStatuses: StatusType[];
};

const StatusPopup: React.FC<PopupPropsType> = ({ innerStatuses }) => {
  return (
    <div className="status-popup status-popup__wrapper">
      <ul className="status-popup__status-list">
        {innerStatuses
          .filter((item) => item.ordersCount !== 0)
          .map((item: StatusType, index: number) => (
            <li key={item.status + index} className="status-popup__status">
              <p className="status-popup__status-text">{item.status}</p>
              <p>{item.ordersCount}</p>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default StatusPopup;

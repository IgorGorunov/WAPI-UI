import React, { useState } from "react";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { GroupOrderStatusType, StatusColors } from "../index";
import StatusPopup from "../StatusPopUp";
import classes from "./StatusBar.module.scss";

type StatusBarPropsType = {
  groupStatus: GroupOrderStatusType;
  maxAmount: number;
};

const StatusBar: React.FC<StatusBarPropsType> = ({
  groupStatus,
  maxAmount,
}) => {
  const [isDisplayedPopup, setIsDisplayedPopup] = useState(false);

  const showPopup = () => setIsDisplayedPopup(true);
  const hidePopup = () => setIsDisplayedPopup(false);

  const barWidth =
    maxAmount === 0
      ? 0
      : Math.round((groupStatus.ordersCount / maxAmount) * 100) + "%";
  const barColor = StatusColors[groupStatus.status];
  return (
    <div className={`${classes["status-wrapper"]}`}>
      <div
        className={classes.label}
        onMouseOver={showPopup}
        onMouseOut={hidePopup}
      >
        {groupStatus.status}
        <div className={classes.count}>
          <span>{groupStatus.ordersCount}</span>
          {groupStatus.ordersCount !== 0 && isDisplayedPopup && (
            <StatusPopup innerStatuses={groupStatus.statuses} />
          )}
        </div>
      </div>
      <div className={classes["colored-bar"]}>
        <div
          style={{
            background: barColor,
            height: "4px",
            width: barWidth,
            borderRadius: "2px",
          }}
        ></div>
      </div>
    </div>
  );
};

export default StatusBar;

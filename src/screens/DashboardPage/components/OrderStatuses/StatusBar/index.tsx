import React, { useState } from "react";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { GroupOrderStatusType, StatusColors } from "../index";
import StatusPopup from "../StatusPopUp";
import "./styles.scss";

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
    <div className={`status-bar status-bar__wrapper`}>
      <div
        className="status-bar__label"
        onMouseOver={showPopup}
        onMouseOut={hidePopup}
      >
        {groupStatus.status}
        <div className="status-bar__count">
          <span>{groupStatus.ordersCount}</span>
          {groupStatus.ordersCount !== 0 && isDisplayedPopup && (
            <StatusPopup innerStatuses={groupStatus.statuses} />
          )}
        </div>
      </div>
      <div className="colored-bar">
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

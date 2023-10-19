import React from "react";
import StatusBar from "./StatusBar";
import "./styles.scss";

export const enum GroupStatuses {
  "Assigned" = "Assigned",
  "Delivered" = "Delivered",
  "In transit" = "In transit",
  "Returned" = "Returned",
  "Returning" = "Returning",
  "Trouble status" = "Trouble status",
}

export type GroupStatusType = keyof typeof GroupStatuses;

export const StatusColors = {
  [GroupStatuses.Assigned]: "#FEDB4F",
  [GroupStatuses.Delivered]: "#29CC39",
  [GroupStatuses["In transit"]]: "#3361FF",
  [GroupStatuses.Returned]: "#FF4000",
  [GroupStatuses.Returning]: "#FF4000",
  [GroupStatuses["Trouble status"]]: "#FEDB4F",
};

export type StatusType = {
  ordersCount: number;
  status: string;
};

export type GroupOrderStatusType = {
  ordersCount: number;
  status: GroupStatusType;
  statuses: StatusType[];
};

export type OrderStatusesPropsType = {
  ordersByStatuses: GroupOrderStatusType[];
};

const OrderStatuses: React.FC<OrderStatusesPropsType> = ({
  ordersByStatuses,
}) => {
  let maxAmount = 0;
  for (let i = 0; i < ordersByStatuses.length; i++) {
    if (maxAmount < ordersByStatuses[i].ordersCount) {
      maxAmount = ordersByStatuses[i].ordersCount;
    }
  }

  return (
    <div className={`card order-statuses order-statuses__container`}>
      <h4 className="title">Orders by statuses</h4>
      <div className="order-statuses__wrapper">
        {ordersByStatuses.map((item: GroupOrderStatusType) => (
          <StatusBar
            key={item.status}
            groupStatus={item}
            maxAmount={maxAmount}
          />
        ))}
      </div>
    </div>
  );
};

export default OrderStatuses;

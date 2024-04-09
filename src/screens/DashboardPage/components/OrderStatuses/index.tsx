import React from "react";
import StatusBar from "./StatusBar";
import "./styles.scss";


export const enum GroupStatuses {
  "Ready for dispatch" = 'Ready for dispatch',
  "Delivered" = "Delivered",
  "In transit" = "In transit",
  "Returned" = "Returned",
  "Returning" = "Returning",
  "Other statuses" = "Other statuses",
}

export const GroupStatusesOrder = {
  [GroupStatuses["Ready for dispatch"]]: 0,
  [GroupStatuses.Delivered]: 2,
  [GroupStatuses["In transit"]]: 1,
  [GroupStatuses.Returned]: 4,
  [GroupStatuses.Returning]: 3,
  [GroupStatuses["Other statuses"]]: 5,
}

export type GroupStatusType = keyof typeof GroupStatuses;

export const StatusColors = {
  [GroupStatuses["Ready for dispatch"]]: "#FEDB4F",
  //[GroupStatuses["Ready for dispatch"]]: "orange",
  [GroupStatuses.Delivered]: "#29CC39",
  [GroupStatuses["In transit"]]: "#5380F5",
  [GroupStatuses.Returned]: "#FF4000",
  [GroupStatuses.Returning]: "#FF4000",
  [GroupStatuses["Other statuses"]]: "#FEDB4F",
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
  if (ordersByStatuses) {
      for (let i = 0; i < ordersByStatuses.length; i++) {
        if (maxAmount < ordersByStatuses[i].ordersCount) {
          maxAmount = ordersByStatuses[i].ordersCount;
        }
      }
  }

  return (
      <div className={`card order-statuses order-statuses__container`}>
        <p className="title-h4 title">Orders by statuses</p>
          {ordersByStatuses && ordersByStatuses.sort((a,b)=>GroupStatusesOrder[a.status]>GroupStatusesOrder[b.status] ? 1 : -1 ).map((item: GroupOrderStatusType) => (
              <StatusBar
                  key={item.status}
                  groupStatus={item}
                  maxAmount={maxAmount}
              />
          ))}
      </div>
  );
};

export default OrderStatuses;

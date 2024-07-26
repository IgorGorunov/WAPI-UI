import React from "react";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { GroupOrderStatusType, StatusColors } from "../index";
import "./styles.scss";
import {Popover} from "antd";
import SimplePopup from "@/components/SimplePopup";
import {useIsTouchDevice} from "@/hooks/useTouchDevice";

type StatusBarPropsType = {
    groupStatus: GroupOrderStatusType;
    maxAmount: number;
};

const StatusBar: React.FC<StatusBarPropsType> = ({groupStatus, maxAmount}) => {

    const isTouchDevice = useIsTouchDevice();

    const barWidth =
        maxAmount === 0
            ? 0
            : Math.round((groupStatus.ordersCount / maxAmount) * 100) + "%";
    const barColor = StatusColors[groupStatus.status];

    const popupItems = groupStatus.statuses
        .filter(status => status.ordersCount !== 0)
        .map(status => ({
            title: status.status,
            description: status.ordersCount.toString()
        }));

    // @ts-ignore
    return (
        <div className={`status-bar status-bar__wrapper`}>
            <Popover
                content={<SimplePopup
                    items={popupItems}
                    width={350}
                />}
                trigger={isTouchDevice ? 'click' : 'hover'}
                placement="right"
                overlayClassName={`doc-list-popover ${popupItems.length === 0 ? 'is-empty' : ''}`}
            >
                <div className="status-bar__label">
                    {groupStatus.status}
                    <div className="status-bar__count">
                        <span>{groupStatus.ordersCount}</span>
                    </div>
                </div>
            </Popover>
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

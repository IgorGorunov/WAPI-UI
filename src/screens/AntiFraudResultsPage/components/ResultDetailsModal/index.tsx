import React from "react";
import Modal from "@/components/Modal";
import Loader from "@/components/Loader";
import {
    AntiFraudResultObject,
    AntiFraudResultType,
    PremiumProductTypeResultsType,
} from "@/screens/AntiFraudResultsPage/types";
import {ANTIFRAUD_ACTIONS, ZONE_COLORS} from "@/screens/AntiFraudSettingsPage/types";
import styles from "./styles.module.scss";
import {formatDateToDisplayString, formatTimeStringFromString} from "@/utils/date";
import Icon from "@/components/Icon";
import SingleDocument from "@/components/SingleDocument";
import {NOTIFICATION_OBJECT_TYPES} from "@/types/notifications";

type ResultDetailsModalProps = {
    row: AntiFraudResultType | null;
    detail: AntiFraudResultObject | null;
    isLoading: boolean;
    error: string | null;
    onClose: () => void;
    hasOrder: boolean;
};

const ACTION_COLORS: Record<string, string> = {
    [ANTIFRAUD_ACTIONS.Allow]: "#29CC39",
    [ANTIFRAUD_ACTIONS.Block]: "#E62E2E",
};

function pct(value: number, total: number): string {
    if (!total) return "0%";
    return `${((value / total) * 100).toFixed(1)}%`;
}

function isPremiumProductType(
    types: AntiFraudResultObject["result"]["productsTypes"]
): types is PremiumProductTypeResultsType {
    return types !== undefined && types !== null && typeof types === "object" && !Array.isArray(types);
}

const ResultDetailsModal: React.FC<ResultDetailsModalProps> = ({
    row,
    detail,
    isLoading,
    error,
    onClose,
    hasOrder,
}) => {
    if (!row) return null;

    const zoneColor = ZONE_COLORS[detail?.zone as keyof typeof ZONE_COLORS] || "#7D8FB3";
    const actionColor = detail ? ACTION_COLORS[detail.action] || "var(--color-light-blue-gray)" : "transparent";

    const ext = detail?.result;
    const isExtended = !!ext;

    const isStandard = row.subscription === 'Basic';
    const isPremium = row.subscription === 'Premium';

    const premiumProducts =
        isExtended && ext.productsTypes && isPremiumProductType(ext.productsTypes)
            ? ext.productsTypes
            : null;

    const simpleProductTypes =
        isExtended && ext.productsTypes && !isPremiumProductType(ext.productsTypes)
            ? (ext.productsTypes as string[])
            : null;

    const [docUuid, setDocUuid] = React.useState<string | null>(null);

    const handleOpenOrder = (uuid: string) => {
        console.log('click', uuid);
        setDocUuid(uuid);
    }

    return (<>
        <Modal title={`${hasOrder ? 'Shipment order '+row.shipmentOrder  : 'Phone number '+row.phoneNumber}`} onClose={onClose}>
            <div className={styles["modal-content"]}>
                <div className={styles["modal-content-wrapper"]}>
                    <div className={`${styles["summary-header"]} ${hasOrder ? styles["summary-header--has-order"] : ""}`}>
                        {hasOrder ? <div className={styles["summary-header__item"]}>
                            <span className={styles["label"]}>WH number</span>
                            <span className={`${styles["value"]}`}>
                                <button className={styles['order-btn']} onClick={()=>handleOpenOrder(row.uuid)}>{row.shipmentOrder || "—"}</button>
                            </span>
                        </div> : null}
                        <div className={styles["summary-header__item"]}>
                            <span className={styles["label"]}>Phone number</span>
                            <span className={`${styles["value"]}`}>
                                {row.phoneNumber || "—"}
                            </span>
                        </div>
                        <div className={styles["summary-header__item"]}>
                            <span className={styles["label"]}>Date</span>
                            <span className={styles["value"]}>
                                {row.requestPeriod ? (
                                    <>
                                        <span className={styles["date"]}>{formatDateToDisplayString(new Date(row.requestPeriod))}</span>
                                        <span className={styles["time"]}>{formatTimeStringFromString(row.requestPeriod)}</span>
                                    </>) : "—"
                                }
                            </span>
                        </div>
                        {!isStandard ? <div className={styles["summary-header__item"]}>
                            <span className={styles["label"]}>Buyout %</span>
                            <span className={`${styles["value"]} `}>
                                {detail?.result?.buyout}%
                            </span>
                        </div> : null}
                    </div>

                    {isLoading && (
                        <div className={styles["state-container"]}>
                            <Loader />
                            <p className={styles["state-text"]}>Loading details…</p>
                        </div>
                    )}

                    {!isLoading && error && (
                        <div className={styles["state-container"]}>
                            <p className={`${styles["state-text"]} ${styles["state-text--error"]}`}>{error}</p>
                        </div>
                    )}

                    {!isLoading && !error && detail && (
                        <>
                            <div className={styles["section"]}>
                                <p className={`title-h4 ${styles["section-title"]}`}>WAPI checker Result</p>
                                <div className={styles["field"]}>
                                    <span className={styles["label"]}>Subscription</span>
                                    <span className={styles["value"]}>{detail.subscription || "—"}</span>
                                </div>
                                <div className={styles["fields-grid"]}>
                                    <div className={styles["field"]}>
                                        <span className={styles["label"]}>Zone</span>
                                        <span
                                            className={styles["badge"]}
                                            style={{
                                                backgroundColor: `${zoneColor}22`,
                                                color: zoneColor,
                                                borderColor: `${zoneColor}55`,
                                            }}
                                        >
                                            {detail.zone || "—"}
                                        </span>
                                    </div>

                                    <div className={styles["field"]}>
                                        <span className={styles["label"]}>Action</span>
                                        <span
                                            className={styles["badge"]}
                                            style={{
                                                backgroundColor: `${actionColor}22`,
                                                color: actionColor,
                                                borderColor: `${actionColor}55`,
                                            }}
                                        >
                                            {detail.action || "—"}
                                        </span>
                                    </div>

                                    <div className={`${styles["field"]} ${isPremium ? '' : styles["field--status"]}`}>
                                        <span className={styles["label"]}>Status</span>
                                        <span className={styles["value"]}>{detail.status || "—"}</span>
                                    </div>

                                    {isPremium ? <div className={styles["field"]}>
                                        <span className={styles["label"]}>Date of the last order</span>
                                        <span className={styles["value"]}>
                                            {detail.result.lastOrderDate ? (
                                                <>
                                                    <span className={styles["date"]}>{formatDateToDisplayString(new Date(detail.result.lastOrderDate))}</span>
                                                    <span className={styles["time"]}>{formatTimeStringFromString(detail.result.lastOrderDate)}</span>
                                                </>
                                            ) : null}
                                        </span>
                                    </div> : null}
                                </div>

                            </div>

                            {isExtended && (
                                <div className={styles["section"]}>
                                    <p className={`title-h4 ${styles["section-title"]}`}>Extended Statistics</p>
                                    <div className={`${styles["stats-grid"]} ${(premiumProducts) ? styles["has-premium"] : ""} ${(isPremium) ? styles["is-premium"] : ""}`}>
                                        <div className={`${styles["stat-card"]} ${styles["stat-card--blue"]}`}>
                                            <span className={`${styles["stat-label"]}`}>Total orders</span>
                                            <span className={styles["stat-value"]}>{ext.ordersCount ?? "—"}</span>
                                        </div>
                                        <div className={`${styles["stat-card"]} ${styles["stat-card--green"]}`}>
                                            <span className={styles["stat-label"]}>Successful</span>
                                            <span className={styles["stat-value"]}>
                                                {ext.successful ?? "—"}
                                                <span className={styles["stat-sub"]}>
                                                    {pct(ext.successful, ext.ordersCount)}
                                                </span>
                                            </span>
                                        </div>
                                        <div className={`${styles["stat-card"]} ${styles["stat-card--red"]}`}>
                                            <span className={styles["stat-label"]}>Failures</span>
                                            <span className={styles["stat-value"]}>
                                                {ext.failure ?? "—"}
                                                <span className={styles["stat-sub"]}>
                                                    {pct(ext.failure, ext.ordersCount)}
                                                </span>
                                            </span>
                                        </div>
                                        {isPremium ? (
                                                <div className={`${styles["stat-card"]} ${styles["stat-card--blue"]}`}>
                                                    <span className={styles["stat-label"]}>In transit</span>
                                                    <span className={styles["stat-value"]}>
                                                        {ext.inTransit ?? "—"}
                                                                <span className={styles["stat-sub"]}>
                                                            {pct(ext.inTransit, ext.ordersCount)}
                                                        </span>
                                                    </span>
                                                    {/*<span className={styles["stat-value"]}>{ext.inTransit ?? "—"}</span>*/}
                                                </div> )
                                            : null
                                        }
                                        <div className={styles["stat-card"]}>
                                            <span className={styles["stat-label"]}>Avg. check</span>
                                            <span className={styles["stat-value"]}>{ext.averageCheck ?? "—"}</span>
                                        </div>
                                        <div className={styles["stat-card"]}>
                                            <span className={styles["stat-label"]}>Avg. products</span>
                                            <span className={styles["stat-value"]}>{ext.averageProductsCount ?? "—"}</span>
                                        </div>
                                    </div>

                                    {/* Product types — simple list */}
                                    {simpleProductTypes && simpleProductTypes.length > 0 && (
                                        <div className={styles["product-types"]}>
                                            <p className={`title-h4 ${styles["section-title"]} `}>Product types</p>
                                            <div className={styles["product-types__tags"]}>
                                                {simpleProductTypes.map((t, i) => (
                                                    <span key={i} className={styles["tag"]}>{t}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {premiumProducts && Object.keys(premiumProducts).length > 0 && (
                                        <div className={`${styles["premium-products"]}`}>
                                            <p className={`title-h4 ${styles["section-title"]} `}>Product types</p>
                                            <div className={styles["premium-products__table"]}>
                                                <div className={`${styles["premium-products__header"]} ${hasOrder ? styles["has-order"] : ""}`}>
                                                    <span style={{justifyContent:"start"}}>Product</span>
                                                    <span>Orders</span>
                                                    <span>Success</span>
                                                    <span>Failures</span>
                                                    <span>In transit</span>
                                                    <span>Avg. check</span>
                                                    <span>Avg. quantity</span>
                                                    <span>Buyout,%</span>
                                                    {/*<span>Zone</span>*/}
                                                    {hasOrder ? <span>Order has such product</span> : null}
                                                </div>
                                                {Object.entries(premiumProducts).map(([productName, data], i) => {
                                                    if (!productName || !data) return null;
                                                    return (
                                                        //className={`${styles['product-with-zone']} ${styles[data.zone]}`}
                                                        <div key={i} className={`${styles["premium-products__row"]}  ${hasOrder ? styles["has-order"] : ""} ${styles['product-with-zone']} ${styles[data.zone]}`}>
                                                            <span style={{textAlign:"start"}} title={productName}>{productName}</span>
                                                            <span>{data.ordersCount}</span>
                                                            <span className={styles["green"]}>{data.successful}</span>
                                                            <span className={styles["red"]}>{data.failure}</span>
                                                            <span className={styles["blue"]}>{data.inTransit}</span>
                                                            <span>{data.averageCheck}</span>
                                                            <span>{data.averageProductsCount}</span>
                                                            <span>{data.buyout}</span>
                                                            {/*<span>{data.zone}</span>*/}
                                                            {hasOrder ? (
                                                                <span>
                                                                    {data.orderHasProduct ? <Icon name="big-check"/> : <Icon name="close"/>}
                                                                </span>
                                                            ) : null}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </Modal>

        {docUuid ? <SingleDocument type={NOTIFICATION_OBJECT_TYPES.Fullfilment} uuid={docUuid} onClose={()=>setDocUuid(null)} /> : null}
    </>
    );
};

export default ResultDetailsModal;

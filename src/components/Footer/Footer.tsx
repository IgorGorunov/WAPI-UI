import React, { memo } from "react";
import styles from "./styles.module.scss";
import LogoWAPI from "@/assets/icons/LogoWAPI.svg";
import { Routes } from "@/types/routes";
import useTenant from "@/context/tenantContext";
import { TENANT_TYPE, TenantFooterDataType, TENANTS } from "@/lib/tenants";
import Image from 'next/image';
import Link from "next/link";


const LogoInFooter: React.FC = (tenant: TENANT_TYPE, footer: TenantFooterDataType | null) => {

  if (tenant === TENANTS.WAPI) return <LogoWAPI />;

  if (footer?.logo) {
    return <Image src={footer.logo} alt="logo" width={footer?.logoWidth || 200} height={footer?.logoHeight || 120} />;
  }

  return null;
}

const Footer: React.FC = () => {
  const { tenant, tenantData } = useTenant();
  const footerData = tenantData?.footer;

  return (
    <div className={styles.footer}>
      <div className={styles['footer-wrapper']}>
        <div className={styles['footer-left']}>
          <div className={styles.logo} style={{ paddingTop: `${footerData?.logoPaddingTop || 0}px` }}>
            {LogoInFooter(tenant, footerData)}
          </div>
          {footerData?.copyright ? (
            <p className={styles.copyright}>
              ©{(new Date).getFullYear()} {footerData?.copyright}
            </p>
          ) : null}
          {footerData?.address ? <p className={styles.address}>{footerData?.address}</p> : null}
        </div>
        <div className={styles['footer-right']}>
          <ul className={styles['footer-links']}>
            {tenantData?.email ? <li><a className={styles['is-footer-link']} href={`mailto:${tenantData?.email}`}>{tenantData?.email}</a></li> : null}
            <li><Link className={styles['is-footer-link']} href={Routes.PrivacyPolicy}>Privacy Policy</Link></li>
            <li><Link className={styles['is-footer-link']} href={Routes.CookiePolicy}>Cookie Policy</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default memo(Footer);
